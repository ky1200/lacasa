// LaCasa on a plain Cloudflare Worker.
// Static files in public/ are served by Workers Static Assets before this code runs.
// Owner sign-in: a password (secret OWNER_PASSWORD) sets a signed, expiring cookie.
// Internally the showcase code still reads an owner header; this Worker strips any
// incoming copy of it and adds it only after the cookie verifies, so it can't be forged.
import content from '../lacasa.json';
import samples from '../lacasa.sample.json';
import { identity, loadState, api } from '../showcase/server.mjs';
import { renderPage, choosePage, ownerPage, auditBrief } from '../showcase/render.mjs';
import { videoPage } from '../showcase/video.mjs';
import { canonicalItemURL } from '../showcase/routes.mjs';

const OWNER_COOKIE = 'lacasa_owner';
const OWNER_DAYS = 30;
const INTERNAL_OWNER = 'lacasa-owner';
const enc = new TextEncoder();

const pageHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Robots-Tag': 'noindex, nofollow',
  'X-Frame-Options': 'DENY',
};

async function hmac(secret, text) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(text));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function sameText(a, b) {
  // Compare digests so timing doesn't reveal how much of the password matched.
  const [x, y] = await Promise.all([a, b].map(v => crypto.subtle.digest('SHA-256', enc.encode(String(v)))));
  const ax = new Uint8Array(x), ay = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ax.length; i++) diff |= ax[i] ^ ay[i];
  return diff === 0;
}
function readCookie(request, name) {
  const part = (request.headers.get('cookie') ?? '').split(';').map(p => p.trim()).find(p => p.startsWith(name + '='));
  return part ? part.slice(name.length + 1) : null;
}
async function ownerCookieValid(request, env) {
  if (!env.OWNER_PASSWORD) return false;
  const raw = readCookie(request, OWNER_COOKIE);
  if (!raw) return false;
  const [expires, sig] = raw.split('.');
  if (!/^\d+$/.test(expires ?? '') || Number(expires) < Date.now()) return false;
  return sameText(sig ?? '', await hmac(env.OWNER_PASSWORD, 'owner:' + expires));
}

// Remove any client-sent identity headers, then add the internal owner header only when verified.
async function trusted(request, env) {
  const headers = new Headers(request.headers);
  for (const key of [...headers.keys()]) if (key.startsWith('oai-authenticated-')) headers.delete(key);
  if (await ownerCookieValid(request, env)) headers.set('oai-authenticated-user-id', INTERNAL_OWNER);
  return new Request(request, { headers });
}
// Create the two tables if the deploy step didn't run the migration (safe to repeat).
let schemaReady = null;
function ensureSchema(env) {
  if (!env.DB) return Promise.resolve();
  schemaReady ??= env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS votes (code TEXT NOT NULL CHECK (code IN ('KY','KX','KS')), decision_id TEXT NOT NULL, pick TEXT NOT NULL, lean TEXT, updated_at TEXT NOT NULL, updated_after_reveal INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, decision_id), CHECK (lean IS NULL OR lean <> pick))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS finals (decision_id TEXT PRIMARY KEY NOT NULL, option_id TEXT NOT NULL, reason TEXT NOT NULL CHECK (reason IN ('tie','overdue','lock')), at TEXT NOT NULL)`),
  ]).catch(e => { schemaReady = null; throw e; });
  return schemaReady;
}
const showcaseEnv = env => ({ DB: env.DB, OWNER_SITE_USER_ID: env.OWNER_PASSWORD ? INTERNAL_OWNER : undefined });

async function ownerLogin(request, env, u) {
  if (request.headers.get('origin') !== u.origin) return new Response(ownerPage('Open LaCasa and try again.'), { status: 403, headers: pageHeaders });
  if (!env.OWNER_PASSWORD) return new Response(ownerPage('Owner sign-in is not set up yet.'), { status: 503, headers: pageHeaders });
  const form = await request.formData();
  if (!(await sameText(form.get('password') ?? '', env.OWNER_PASSWORD))) {
    await new Promise(r => setTimeout(r, 800)); // slow down guessing
    return new Response(ownerPage('That password is not right.'), { status: 401, headers: pageHeaders });
  }
  const expires = Date.now() + OWNER_DAYS * 864e5;
  const value = expires + '.' + (await hmac(env.OWNER_PASSWORD, 'owner:' + expires));
  const secure = u.protocol === 'https:' ? '; Secure' : '';
  return new Response(null, { status: 303, headers: { Location: '/admin', 'Cache-Control': 'no-store',
    'Set-Cookie': `${OWNER_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${OWNER_DAYS * 86400}${secure}` } });
}
function ownerLogout(u) {
  const secure = u.protocol === 'https:' ? '; Secure' : '';
  return new Response(null, { status: 303, headers: { Location: '/', 'Cache-Control': 'no-store',
    'Set-Cookie': `${OWNER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}` } });
}

async function page(request, env, u) {
  const sEnv = showcaseEnv(env), who = identity(request, sEnv, content);
  if (u.pathname.startsWith('/video/')) {
    const html = videoPage(content, u.pathname.slice(7), u.origin);
    // The video page embeds YouTube, so it must be allowed in a frame on this site.
    const h = { ...pageHeaders, 'X-Frame-Options': 'SAMEORIGIN' };
    return html ? new Response(html, { headers: h }) : new Response('Video unavailable', { status: 404, headers: h });
  }
  const canonical = canonicalItemURL(request.url, content, samples);
  if (canonical) return new Response(null, { status: 308, headers: { ...pageHeaders, Location: canonical } });
  if (u.pathname === '/audit/brief.txt') return new Response(auditBrief(u.origin, content), { headers: { ...pageHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
  if (u.pathname === '/owner') return new Response(ownerPage(), { headers: pageHeaders });
  if (!who.code || u.pathname === '/choose') return new Response(choosePage(content), { headers: pageHeaders });
  if (u.pathname === '/admin' && !who.isAdmin && !who.audit) return new Response(ownerPage(who.isOwner ? 'Choose KY first, then open Admin.' : ''), { status: 403, headers: pageHeaders });
  try {
    const state = await loadState(request, sEnv, content, samples), rendered = renderPage(state, request.url);
    return new Response(rendered.html, { status: rendered.status, headers: pageHeaders });
  } catch (e) {
    console.error('page failed', e?.stack ?? e);
    return new Response('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>LaCasa</title><body><h1>LaCasa is unavailable</h1><p>Please try again shortly.</p><a href="/">Try again</a></body></html>', { status: 503, headers: pageHeaders });
  }
}

export default {
  async fetch(incoming, env) {
    const u = new URL(incoming.url);
    if (u.pathname === '/owner/login' && incoming.method === 'POST') return ownerLogin(incoming, env, u);
    if (u.pathname === '/owner/logout') return ownerLogout(u);
    const request = await trusted(incoming, env);
    try { await ensureSchema(env); } catch (e) { console.error('schema setup failed', e?.stack ?? e); }
    if (u.pathname.startsWith('/api/')) return api(request, showcaseEnv(env), content, samples);
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    return page(request, env, u);
  },
};
