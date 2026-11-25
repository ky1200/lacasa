// /progress: tick steps (shared with the /buy to-do list), post and delete family updates, pick up others' changes.
(() => {
const root = document.querySelector('[data-progress-page]');
if (!root || root.hasAttribute('data-ro')) return;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const call = async (url, method, body) => {
 const r = await fetch(url, {method, headers: {'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined, cache: 'no-store'});
 const j = await r.json().catch(() => ({}));
 if (!r.ok) throw new Error(j.error || 'Could not save. Check the connection and try again.');
 return j;
};
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const when = at => {const [d, t] = at.split(' '), [y, m, dd] = d.split('-').map(Number), [hh, mm] = t.split(':').map(Number), wd = new Date(Date.UTC(y, m - 1, dd)).getUTCDay(); return `${DOW[wd]} ${dd} ${MON[m - 1]}, ${hh % 12 || 12}:${String(mm).padStart(2, '0')}${hh < 12 ? 'am' : 'pm'}`;};

// Ticks
const count = () => {
 const steps = [...root.querySelectorAll('[data-step]')], done = steps.filter(li => li.classList.contains('is-done')).length;
 root.querySelector('[data-pg-done]').textContent = done;
 const pct = Math.round(done / steps.length * 100);
 root.querySelector('[data-pg-pct]').textContent = pct;
 root.querySelector('.pg-head .pg-bar i').style.width = pct + '%';
 root.querySelectorAll('.pg-stage').forEach(st => {const all = st.querySelectorAll('[data-step]'), d = st.querySelectorAll('[data-step].is-done').length; st.querySelector('summary small').textContent = `${d} of ${all.length} done`; st.querySelector('.pg-mini i').style.width = Math.round(d / all.length * 100) + '%';});
};
const setTick = (id, on) => root.querySelectorAll(`[data-todo-id="${CSS.escape(id)}"]`).forEach(li => {
 if (on) {li.dataset.was = li.dataset.was || [...li.classList].find(c => c.startsWith('is-')) || 'is-next'; li.className = 'pg-step is-done';}
 else li.className = 'pg-step ' + (li.dataset.was && li.dataset.was !== 'is-done' ? li.dataset.was : 'is-next');
 const b = li.querySelector('.pg-tick'), dot = li.querySelector('.pg-dot');
 b?.setAttribute('aria-pressed', String(on)); if (dot) dot.textContent = on ? '✓' : '';
});
root.querySelectorAll('[data-todo-id] button.pg-tick').forEach(b => b.addEventListener('click', async () => {
 const li = b.closest('[data-todo-id]'), id = li.dataset.todoId, on = !li.classList.contains('is-done');
 setTick(id, on); count();
 try {await call('/api/buy/' + encodeURIComponent('t:' + id), 'PUT', {value: on ? '1' : ''});}
 catch (e) {setTick(id, !on); count(); alert(e.message);}
}));

// Updates
const list = root.querySelector('[data-pg-updates]');
const draw = log => {
 list.innerHTML = log.length ? log.slice(0, 30).map(u => `<li data-id="${esc(u.id)}"><span class="pg-who-chip">${esc(u.w)}</span><div><p>${esc(u.t)}</p><small>${esc(when(u.at))}</small></div><button type="button" class="pg-del" data-del aria-label="Delete this update">Delete</button></li>`).join('') : '<li class="pg-empty">No updates yet. Post the first one above.</li>';
};
list.addEventListener('click', async ev => {
 const b = ev.target.closest('[data-del]'); if (!b) return;
 if (!b.dataset.armed) {b.dataset.armed = '1'; b.textContent = 'Tap to delete'; setTimeout(() => {if (b.isConnected) {delete b.dataset.armed; b.textContent = 'Delete';}}, 4000); return;}
 try {const j = await call('/api/progress/remove', 'POST', {id: b.closest('li').dataset.id}); draw(j.log);} catch (e) {alert(e.message);}
});
const form = root.querySelector('[data-pg-form]'), err = root.querySelector('[data-pg-err]');
try {const w = localStorage.getItem('lacasa-who'); if (w) {const r = form.querySelector(`input[name=w][value="${CSS.escape(w)}"]`); if (r) r.checked = true;}} catch {}
form.addEventListener('submit', async ev => {
 ev.preventDefault();
 const w = form.elements.w.value, t = form.elements.t.value.trim();
 if (t.length < 2) {err.textContent = 'Write a short update first.'; err.hidden = false; form.elements.t.focus(); return;}
 err.hidden = true;
 const btn = form.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Posting…';
 try {const j = await call('/api/progress/update', 'POST', {w, t}); draw(j.log); form.elements.t.value = ''; try {localStorage.setItem('lacasa-who', w);} catch {}}
 catch (e) {err.textContent = e.message; err.hidden = false;}
 finally {btn.disabled = false; btn.textContent = 'Post update';}
});

// Others' changes
let last = '';
const poll = async () => {
 if (document.hidden || document.activeElement === form.elements.t) return;
 try {
  const j = await call('/api/progress/state', 'GET'), key = JSON.stringify(j);
  if (key === last) return; last = key;
  draw(j.log);
  root.querySelectorAll('[data-todo-id]').forEach(li => {const on = j.ticks[li.dataset.todoId] === '1'; if (on !== li.classList.contains('is-done')) setTick(li.dataset.todoId, on);});
  count();
 } catch {}
};
setInterval(poll, 30000);
document.addEventListener('visibilitychange', poll);
})();
