import {shopperState} from './shopper.mjs';
import {stateFor,result,validVotes,validateVote,areaOf,todaySG} from './domain.mjs';
export class AppError extends Error {constructor(status,message){super(message);this.status=status;}}
export const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Cookie'}});
export const isAuditRequest=request=>/^\/audit(?:\/|$)/.test(new URL(request.url).pathname)||new URL(request.url).searchParams.get('view')==='audit';
export function identity(request,env,content){
 const audit=isAuditRequest(request),cookie=(request.headers.get('cookie')??'').split(';').map(p=>p.trim()).find(p=>p.startsWith('lacasa_person='));
 const selected=cookie?.slice('lacasa_person='.length),person=content.people.find(p=>p.code===selected);
 const isOwner=!!env.OWNER_SITE_USER_ID&&request.headers.get('oai-authenticated-user-id')===env.OWNER_SITE_USER_ID;
 return {signedIn:!!request.headers.get('oai-authenticated-user-id'),code:audit?'AUDIT':person?.code??null,name:audit?'Claude':person?.name??null,isOwner,isAdmin:!audit&&isOwner&&person?.code===content.admin,readOnly:audit,audit};
}
export async function readRecords(db){const rows=await db.batch([db.prepare('SELECT code, decision_id, pick, lean, updated_at, updated_after_reveal FROM votes'),db.prepare('SELECT decision_id, option_id, reason, at FROM finals')]);return{votes:rows[0].results,finals:rows[1].results};}
export function visitorState(content,samples,who,votes=[],finals=[],showSamples=false){
 if(who.audit){
  const base=stateFor(content,{decisions:[]},'KY',votes,finals,false),practice=stateFor({...content,decisions:[]},samples,'KY',[],[],true);
  return {...base,content:{...content,decisions:[...base.content.decisions,...samples.decisions]},results:{...base.results,...practice.results},ownVotes:{},code:'AUDIT',name:'Claude',isAdmin:false,isOwner:false,readOnly:true,audit:true,progress:{...base.progress,AUDIT:{total:0,done:0}}};
 }
 return {...stateFor(content,samples,who.code,votes,finals,showSamples),isAdmin:who.isAdmin,isOwner:who.isOwner,readOnly:false,audit:false};
}
export async function loadState(request,env,content,samples){const who=identity(request,env,content);if(!who.code)throw new AppError(401,'Choose your name before entering LaCasa.');if(!env.DB)throw new AppError(503,'The database is not ready yet. Try again shortly.');const {votes,finals}=await readRecords(env.DB);const showSamples=who.isAdmin&&new URL(request.url).searchParams.get('samples')==='on';return visitorState(content,samples,who,votes,finals,showSamples);}
async function bodyJSON(request){if(Number(request.headers.get('content-length')??0)>16384)throw new AppError(422,'This request is too large.');const text=await request.text();if(text.length>16384)throw new AppError(422,'This request is too large.');try{return JSON.parse(text);}catch{throw new AppError(422,'This request could not be read.');}}
export async function api(request,env,content,samples){try{
 const u=new URL(request.url),path=u.pathname,method=request.method,who=identity(request,env,content);
 if(method==='GET'&&path==='/api/me')return json(who);
 if(method!=='GET'&&request.headers.get('origin')!==u.origin)throw new AppError(403,'Open LaCasa and try this action again.');
 if(who.readOnly&&(method!=='GET'||path.startsWith('/api/admin/')))throw new AppError(403,'The audit view is read only. No votes or decisions can be changed.');
 if(path==='/api/session'&&method==='POST'){
  const form=await request.formData(),person=content.people.find(p=>p.code===form.get('person'));
  if(!person)throw new AppError(422,'Choose KY, KX or KS.');
  const secure=u.protocol==='https:'?'; Secure':'';
  return new Response(null,{status:303,headers:{'Location':'/','Cache-Control':'no-store','Set-Cookie':`lacasa_person=${person.code}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure}`}});
 }
 if(!who.code)throw new AppError(401,'Choose your name before entering LaCasa.');
 if(path.startsWith('/api/admin/')&&!who.isAdmin)throw new AppError(403,'Only KY can do that.');
 if(!env.DB)throw new AppError(503,'The private database is not ready yet.');
 const {votes,finals}=await readRecords(env.DB),showSamples=who.isAdmin&&u.searchParams.get('samples')==='on';
 const state=visitorState(content,samples,who,votes,finals,showSamples),all=state.content;
 if(method==='GET'&&path==='/api/state')return json(shopperState(state));
 if(method==='GET'&&path==='/api/admin/export')return json({exportedAt:new Date().toISOString(),votes,finals});
 if(method==='DELETE'&&path==='/api/admin/sample-votes'){await env.DB.batch([env.DB.prepare("DELETE FROM votes WHERE decision_id LIKE 'SAMPLE-%'"),env.DB.prepare("DELETE FROM finals WHERE decision_id LIKE 'SAMPLE-%'")]);return json({ok:true});}
 if(method==='PUT'&&path.startsWith('/api/votes/')){
  const d=all.decisions.find(d=>d.id===decodeURIComponent(path.slice('/api/votes/'.length))),body=await bodyJSON(request),r=d?state.results[d.id]:{status:'waiting'};
  const problem=validateVote(all,d,who.code,body,r);if(problem)throw new AppError(422,problem);
  if(Object.keys(body).some(k=>!['pick','lean'].includes(k)))throw new AppError(422,'Send only your pick and lean.');
  const old=validVotes(d,votes).find(v=>v.code===who.code),lean=body.lean??null;
  const changed=old&&(old.pick!==body.pick||old.lean!==lean),updated=changed&&['decided','tie'].includes(r.status)?1:old?.updated_after_reveal??0;
  const guardOptions=d.options.map(()=>'?').join(',');
  const write=await env.DB.prepare(`INSERT INTO votes (code,decision_id,pick,lean,updated_at,updated_after_reveal)
   SELECT ?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM finals WHERE decision_id=? AND reason='lock' AND option_id IN (${guardOptions}))
   ON CONFLICT(code,decision_id) DO UPDATE SET pick=excluded.pick,lean=excluded.lean,updated_at=excluded.updated_at,updated_after_reveal=excluded.updated_after_reveal
   WHERE NOT EXISTS (SELECT 1 FROM finals WHERE decision_id=? AND reason='lock' AND option_id IN (${guardOptions}))`).bind(who.code,d.id,body.pick,lean,new Date().toISOString(),updated,d.id,...d.options.map(o=>o.id),d.id,...d.options.map(o=>o.id)).run();
  if(!write.meta.changes)throw new AppError(422,'This decision is locked. Ask KY to unlock it.');
  return json({ok:true,updated:!!updated});
 }
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
