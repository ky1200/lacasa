// /day#price-check: add shop prices and notes (shared), lowest price on top, picks up others' entries every 20 s.
(() => {
const root = document.querySelector('[data-cmp]');
if (!root || root.hasAttribute('data-ro')) return;
const D = JSON.parse(root.querySelector('#cmp-data').textContent);
let log = D.log;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const sgd = n => 'S$' + n.toLocaleString('en-SG', {minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2});
const call = async (url, method, body) => {
 const r = await fetch(url, {method, headers: {'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined, cache: 'no-store'});
 const j = await r.json().catch(() => ({}));
 if (!r.ok) throw new Error(j.error || 'Could not save. Check the connection and try again.');
 return j;
};
const draw = () => {
 for (const it of D.items) {
  const box = root.querySelector(`[data-cmp-item="${it.id}"] [data-cmp-rows]`);
  if (!box) continue;
  const rows = [...it.p.map(([s, pr, note, href]) => ({s, pr, note, href, k: 'online'})), ...log.filter(q => q.item === it.id && q.price !== null).map(q => ({s: q.shop, pr: q.price, note: q.note, k: 'quote', w: q.w}))].sort((a, b) => a.pr - b.pr);
  const low = rows[0]?.pr;
  box.innerHTML = rows.map(r => `<li class="cmp-row is-${r.k}${r.pr === low ? ' is-low' : ''}"><span class="cmp-price">${esc(sgd(r.pr))}</span><span class="cmp-shop">${r.href ? `<a href="${esc(r.href)}" target="_blank" rel="noopener">${esc(r.s)}</a>` : esc(r.s)}${r.k === 'quote' ? ` <em>shop quote · ${esc(r.w)}</em>` : ''}${r.note ? `<small>${esc(r.note)}</small>` : ''}</span>${r.pr === low ? '<span class="cmp-low">Lowest</span>' : ''}</li>`).join('');
 }
 const notes = root.querySelector('[data-cmp-notes]');
 notes.innerHTML = log.length ? log.map(q => {const it = D.items.find(i => i.id === q.item); return `<li data-id="${esc(q.id)}"><span class="pg-who-chip">${esc(q.w)}</span><div><p><b>${esc(q.shop)}</b>${it ? ' · ' + esc(it.n.split(':')[0]) : ''}${q.price !== null ? ' · ' + esc(sgd(q.price)) : ''}${q.note ? ': ' + esc(q.note) : ''}</p><small>${esc(q.at.slice(11))}</small></div><button type="button" class="pg-del" data-del>Delete</button></li>`;}).join('') : '<li class="pg-empty">No notes yet.</li>';
};
const form = root.querySelector('[data-cmp-form]'), err = root.querySelector('[data-cmp-err]');
const remember = (k, v) => {try {localStorage.setItem(k, v);} catch {}};
const recall = k => {try {return localStorage.getItem(k);} catch {return null;}};
root.addEventListener('click', async ev => {
 const add = ev.target.closest('[data-cmp-add]');
 if (add) {
  form.hidden = false; err.hidden = true;
  form.elements.item.value = add.dataset.cmpAdd;
  const shop = recall('lacasa-shop'), who = recall('lacasa-who');
  if (shop) form.elements.shop.value = shop;
  if (who) {const r = form.querySelector(`input[name=w][value="${CSS.escape(who)}"]`); if (r) r.checked = true;}
  form.elements.price.value = ''; form.elements.note.value = '';
  add.closest('article').after(form);
  form.elements.price.focus({preventScroll: true});
  form.scrollIntoView({behavior: 'smooth', block: 'center'});
  return;
 }
 const del = ev.target.closest('[data-del]');
 if (del && del.closest('[data-cmp-notes]')) {
  if (!del.dataset.armed) {del.dataset.armed = '1'; del.textContent = 'Tap to delete'; setTimeout(() => {if (del.isConnected) {delete del.dataset.armed; del.textContent = 'Delete';}}, 4000); return;}
  try {log = (await call('/api/compare/remove', 'POST', {id: del.closest('li').dataset.id})).log; draw();} catch (e) {alert(e.message);}
 }
});
form.querySelector('[data-cmp-cancel]').onclick = () => {form.hidden = true;};
form.addEventListener('submit', async ev => {
 ev.preventDefault();
 const f = form.elements, raw = f.price.value.trim().replace(/[$,S\s]/gi, ''), note = f.note.value.trim();
 if (raw && !/^\d+(\.\d{1,2})?$/.test(raw)) {err.textContent = 'Type the price as a number, e.g. 480 or 480.50.'; err.hidden = false; return;}
 if (!raw && note.length < 2) {err.textContent = 'Add a price or a short note.'; err.hidden = false; return;}
 const body = {item: f.item.value, shop: f.shop.value, price: raw ? Number(raw) : null, note, w: f.w.value};
 const btn = form.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Saving…';
 try {log = (await call('/api/compare/add', 'POST', body)).log; remember('lacasa-shop', body.shop); remember('lacasa-who', body.w); form.hidden = true; draw();}
 catch (e) {err.textContent = e.message; err.hidden = false;}
 finally {btn.disabled = false; btn.textContent = 'Save';}
});
const poll = async () => {
 if (document.hidden || !form.hidden) return;
 try {const j = await call('/api/compare/state', 'GET'); if (JSON.stringify(j.log) !== JSON.stringify(log)) {log = j.log; draw();}} catch {}
};
setInterval(poll, 20000);
document.addEventListener('visibilitychange', poll);
})();
