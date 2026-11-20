import {shopperState} from './shopper.mjs';
import {visitKeys,applyVisitSpaces} from './visit.mjs';
import {buyKeys,validBuyValue} from './buy-plan.mjs';
import {stateFor} from './domain.mjs';
const VISIT_KEYS=visitKeys(),BUY_KEYS=buyKeys();
export class AppError extends Error {constructor(status,message){super(message);this.status=status;}}
export const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Cookie'}});
export const isAuditRequest=request=>/^\/audit(?:\/|$)/.test(new URL(request.url).pathname)||new URL(request.url).searchParams.get('view')==='audit';
// The site has one shared view for the whole family (no KY/KX/KS name picker).
// Owner controls need the owner password cookie (the Worker turns it into the internal header).
export const FAMILY='FAMILY';
export function identity(request,env,content){
 const audit=isAuditRequest(request);
 const isOwner=!!env.OWNER_SITE_USER_ID&&request.headers.get('oai-authenticated-user-id')===env.OWNER_SITE_USER_ID;
 return {signedIn:!!request.headers.get('oai-authenticated-user-id'),code:audit?'AUDIT':FAMILY,name:audit?'Claude':'Family',isOwner,isAdmin:!audit&&isOwner,readOnly:audit,audit};
}
export async function readRecords(db){const rows=await db.batch([db.prepare('SELECT code, decision_id, pick, lean, updated_at, updated_after_reveal FROM votes'),db.prepare('SELECT decision_id, option_id, reason, at FROM finals')]);return{votes:rows[0].results,finals:rows[1].results};}
export function visitorState(content,samples,who,votes=[],finals=[],showSamples=false){
 if(who.audit){
  const base=stateFor(content,{decisions:[]},'KY',votes,finals,false),practice=stateFor({...content,decisions:[]},samples,'KY',[],[],true);
  return {...base,content:{...content,decisions:[...base.content.decisions,...samples.decisions]},results:{...base.results,...practice.results},ownVotes:{},code:'AUDIT',name:'Claude',isAdmin:false,isOwner:false,readOnly:true,audit:true,progress:{...base.progress,AUDIT:{total:0,done:0}}};
 }
 return {...stateFor(content,samples,who.code,votes,finals,showSamples),isAdmin:who.isAdmin,isOwner:who.isOwner,readOnly:false,audit:false};
}
export async function readVisit(db){try{const rows=(await db.prepare('SELECT key, value FROM visit_notes').all()).results??[];return Object.fromEntries(rows.map(r=>[r.key,r.value]));}catch{return {};}}
export async function loadState(request,env,content,samples){const who=identity(request,env,content);if(!env.DB)throw new AppError(503,'The database is not ready yet. Try again shortly.');const [{votes,finals},visit]=await Promise.all([readRecords(env.DB),readVisit(env.DB)]);const showSamples=who.isAdmin&&new URL(request.url).searchParams.get('samples')==='on';return {...visitorState(applyVisitSpaces(content,visit),samples,who,votes,finals,showSamples),visit};}
async function bodyJSON(request){if(Number(request.headers.get('content-length')??0)>16384)throw new AppError(422,'This request is too large.');const text=await request.text();if(text.length>16384)throw new AppError(422,'This request is too large.');try{return JSON.parse(text);}catch{throw new AppError(422,'This request could not be read.');}}
export async function api(request,env,content,samples){try{
 const u=new URL(request.url),path=u.pathname,method=request.method,who=identity(request,env,content);
 if(method==='GET'&&path==='/api/me')return json(who);
 if(method!=='GET'&&request.headers.get('origin')!==u.origin)throw new AppError(403,'Open LaCasa and try this action again.');
 if(who.readOnly&&(method!=='GET'||path.startsWith('/api/admin/')))throw new AppError(403,'The audit view is read only. No votes or decisions can be changed.');
 if(method==='PUT'&&path.startsWith('/api/visit/')){
  if(!env.DB)throw new AppError(503,'The private database is not ready yet.');
  const key=decodeURIComponent(path.slice('/api/visit/'.length)),body=await bodyJSON(request);
  if(!VISIT_KEYS.has(key))throw new AppError(422,'This field is not on the visit page.');
  const value=typeof body.value==='string'?body.value.trim():'';
  if(value.length>2000)throw new AppError(422,'Keep this under 2,000 characters.');
  if(/^[mq]:/.test(key)&&value&&!/^\d{1,6}(?:[.,]\d{1,2})?$/.test(value))throw new AppError(422,'Type a number only, like 120 or 4.5.');
  if(/^(?:ok|c|a):/.test(key)&&!['','1'].includes(value))throw new AppError(422,'Tick or untick only.');
  if(value)await env.DB.prepare('INSERT INTO visit_notes (key,value,code,updated_at) VALUES (?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,code=excluded.code,updated_at=excluded.updated_at').bind(key,value,who.code,new Date().toISOString()).run();
  else await env.DB.prepare('DELETE FROM visit_notes WHERE key=?').bind(key).run();
  return json({ok:true});
 }
 if(method==='PUT'&&path.startsWith('/api/buy/')){
  if(!env.DB)throw new AppError(503,'The private database is not ready yet.');
  const key=decodeURIComponent(path.slice('/api/buy/'.length)),body=await bodyJSON(request),spec=BUY_KEYS.get(key);
  if(!spec)throw new AppError(422,'This item is not on the to-buy list.');
  const value=typeof body.value==='string'?body.value.trim():'';
  if(!validBuyValue(spec,value))throw new AppError(422,spec.kind==='qty'?'Use a number from 1 to 99.':spec.kind==='pick'?'Choose one of the listed options.':spec.kind==='tag'?'Choose Before, After or Maybe.':'Tick or untick only.');
  if(value)await env.DB.prepare('INSERT INTO visit_notes (key,value,code,updated_at) VALUES (?,?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,code=excluded.code,updated_at=excluded.updated_at').bind(key,value,who.code,new Date().toISOString()).run();
  else await env.DB.prepare('DELETE FROM visit_notes WHERE key=?').bind(key).run();
  return json({ok:true});
 }
 // Voting is off: with no name picker there is no voter. Per-person KY/KX/KS buttons can come later.
 if(path.startsWith('/api/votes/'))throw new AppError(403,'Voting is off for now.');
 if(path.startsWith('/api/admin/')&&!who.isAdmin)throw new AppError(403,'Only the site owner can do that.');
 if(!env.DB)throw new AppError(503,'The private database is not ready yet.');
 const {votes,finals}=await readRecords(env.DB),showSamples=who.isAdmin&&u.searchParams.get('samples')==='on';
 const state=visitorState(content,samples,who,votes,finals,showSamples),all=state.content;
 if(method==='GET'&&path==='/api/state')return json(shopperState(state));
 if(method==='GET'&&path==='/api/admin/export')return json({exportedAt:new Date().toISOString(),votes,finals});
 if(method==='DELETE'&&path==='/api/admin/sample-votes'){await env.DB.batch([env.DB.prepare("DELETE FROM votes WHERE decision_id LIKE 'SAMPLE-%'"),env.DB.prepare("DELETE FROM finals WHERE decision_id LIKE 'SAMPLE-%'")]);return json({ok:true});}
 if(method==='POST'&&path==='/api/admin/final'){
  const body=await bodyJSON(request),d=all.decisions.find(d=>d.id===body.decisionId);
  if(!d||d.status!=='voting'||!d.options.some(o=>o.id===body.optionId))throw new AppError(422,'Choose an available option on an item ready for voting.');
  const r=state.results[d.id];
  if(r.status==='locked')throw new AppError(422,'Unlock this decision first.');
  if(body.reason==='tie'){if(r.status!=='tie'||!r.tied.includes(body.optionId))throw new AppError(422,'Choose one of the tied options.');}
  else if(body.reason==='overdue'){if(r.status!=='waiting'||!r.overdue)throw new AppError(422,'KY may decide when the deadline has passed and answers are missing.');}
  else if(body.reason==='lock'){if(r.status!=='decided'||r.winner!==body.optionId)throw new AppError(422,'Decide the winning option before locking it.');}
  else throw new AppError(422,'Choose a tie decision, overdue decision or lock.');
  await env.DB.prepare('INSERT INTO finals(decision_id,option_id,reason,at) VALUES(?,?,?,?) ON CONFLICT(decision_id) DO UPDATE SET option_id=excluded.option_id,reason=excluded.reason,at=excluded.at').bind(d.id,body.optionId,body.reason,new Date().toISOString()).run();
  return json({ok:true});
 }
 if(method==='DELETE'&&path.startsWith('/api/admin/final/')){
  const id=decodeURIComponent(path.slice('/api/admin/final/'.length));if(!all.decisions.some(d=>d.id===id))throw new AppError(422,'This item is unavailable.');
  await env.DB.prepare('DELETE FROM finals WHERE decision_id=?').bind(id).run();return json({ok:true});
 }
 throw new AppError(404,'This page is unavailable.');
 }catch(e){if(e instanceof AppError)return json({error:e.message},e.status);console.error('LaCasa API failed',{kind:e?.name});return json({error:'LaCasa could not save or load your data. Please try again.'},503);}}
