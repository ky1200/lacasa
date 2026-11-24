// /day: map + live re-planning. Times are shared: saved as one value (PUT /api/day/log) and re-read every 20 s.
(() => {
const root = document.querySelector('[data-day-page]');
if (!root) return;
const D = JSON.parse(root.querySelector('#day-data').textContent), S = D.stops, ro = root.hasAttribute('data-ro');
let log = D.log;
const toMin = s => {const [a, b] = s.split(':').map(Number); return a * 60 + b;};
const toHM = m => {m = Math.round(m); const x = ((m % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');};
const l12 = s => {const m = toMin(s), hh = Math.floor(m / 60), mm = m % 60; return `${hh % 12 || 12}${mm ? ':' + String(mm).padStart(2, '0') : ''}${hh < 12 ? 'am' : 'pm'}`;};
const sgNow = () => {const d = new Date(Date.now() + 8 * 3600e3); return toHM(d.getUTCHours() * 60 + d.getUTCMinutes());};
// Same rules as dayTimes() in showcase/day.mjs.
const times = () => {
 const out = []; let t = toMin(S[0].plan), pt = t;
 S.forEach((s, i) => {
  if ((log.x ?? []).includes(s.id)) {out.push({id: s.id, start: toHM(t), end: toHM(t), plan: toHM(pt), late: 0, wait: 0, skip: true, warn: []}); return;}
  const stay = log.d?.[s.id] ?? s.stay, A = log.a?.[s.id], L = log.l?.[s.id];
  if (i) {t += s.drive; pt += s.drive;}
  let start = t, ps = pt;
  if (s.notBefore) {start = Math.max(start, toMin(s.notBefore)); ps = Math.max(ps, toMin(s.notBefore));}
  const wait = A ? 0 : start - t;
  if (A) start = toMin(A);
  const end = L ? toMin(L) : start + stay, pe = ps + s.stay, warn = [];
  if (s.close && !L && end > toMin(s.close)) warn.push(start >= toMin(s.close) ? `Arrives after closing (${l12(s.close)})` : `Closes at ${l12(s.close)}: cut the visit short`);
  if (s.by && start > toMin(s.by)) warn.push(`Past ${l12(s.by)}`);
  out.push({id: s.id, start: toHM(start), end: toHM(end), plan: toHM(ps), late: start - ps, wait, skip: false, done: !!L || (!!A && !stay), here: !!A && !L && !!stay, warn});
  t = end; pt = pe;
 });
 return out;
};

// Map
let map = null, lines = {}, marks = {};
const el = root.querySelector('#day-map');
if (window.L && el) {
 map = L.map(el, {scrollWheelZoom: false, tap: true, zoomControl: true, attributionControl: true});
 L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {minZoom: 11, maxZoom: 18, detectRetina: true, attribution: 'OneMap © SLA'}).addTo(map);
 for (const [k, pts] of Object.entries(D.routes)) lines[k] = L.polyline(pts, {color: '#273c66', weight: 4, opacity: .55}).addTo(map);
 const seen = new Map();
 S.forEach((s, i) => {
  const key = s.at.join(','), n = seen.get(key);
  if (n) {n.label += ',' + (i + 1); n.m.setIcon(L.divIcon({className: 'day-pin', html: `<span>${n.label}</span>`, iconSize: null})); marks[s.id] = n.m; return;}
  const m = L.marker(s.at, {icon: L.divIcon({className: 'day-pin', html: `<span>${i + 1}</span>`, iconSize: null}), title: s.n, keyboard: false}).addTo(map).bindPopup(`<b>${i + 1}. ${s.n.replace(/</g, '&lt;')}</b>`);
  seen.set(key, {m, label: String(i + 1)}); marks[s.id] = m;
 });
 map.fitBounds(L.latLngBounds(S.map(s => s.at)), {padding: [18, 18]});
}

const render = () => {
 const T = times(), now = sgNow();
 T.forEach((t, i) => {
  const s = S[i], li = root.querySelector(`[data-stop="${s.id}"]`);
  if (!li) return;
  li.querySelector('[data-start]').textContent = l12(t.start);
  li.querySelector('[data-plan]').textContent = t.skip ? 'skipped' : t.late ? `plan ${l12(t.plan)} (${t.late > 0 ? '+' : '−'}${Math.abs(t.late)} min)` : 'on plan';
  const w = li.querySelector('[data-warn]'); w.hidden = !t.warn.length; w.textContent = t.warn.join(' · ');
  const wt = li.querySelector('[data-wait]'); wt.hidden = !(t.wait > 0); wt.textContent = t.wait > 0 ? `${t.wait} min spare before this` : '';
  li.classList.toggle('is-skip', t.skip); li.classList.toggle('is-here', t.here); li.classList.toggle('is-done', t.done);
  const a = li.querySelector('[data-act=a]'), l = li.querySelector('[data-act=l]'), k = li.querySelector('[data-act=skip]');
  if (a) a.textContent = (s.btn ?? 'Arrived') + ' ' + (log.a?.[s.id] ? l12(log.a[s.id]) : 'now');
  if (l) l.textContent = log.l?.[s.id] ? 'Left ' + l12(log.l[s.id]) : 'Left now';
  if (k) k.textContent = t.skip ? 'Add back' : 'Skip';
 });
 const next = T.findIndex(t => !t.skip && !t.done && !t.here), here = T.findIndex(t => t.here);
 const last = [...T].reverse().find(t => log.a?.[t.id] || log.l?.[t.id]);
 root.querySelector('[data-now]').textContent = here >= 0 ? `At ${S[here].n}` : l12(now);
 root.querySelector('[data-next]').textContent = next >= 0 ? `${S[next].n.replace(/^Optional: /, '')} ≈ ${l12(T[next].start)}` : 'Done';
 const late = last ? last.late : 0;
 root.querySelector('[data-late]').textContent = !last ? 'Not started' : late > 2 ? `${late} min late` : late < -2 ? `${-late} min early` : 'On time';
 if (map) {
  const nextLeg = next >= 0 ? S[next].route : null;
  S.forEach((s, i) => {if (!s.route || !lines[s.route]) return; const t = T[i], prevDone = i && (T[i - 1].done || T[i - 1].skip); lines[s.route].setStyle(t.done || t.here ? {color: '#9a968c', weight: 3, opacity: .7, dashArray: null} : s.route === nextLeg && prevDone ? {color: '#3f6a4e', weight: 6, opacity: .95, dashArray: null} : {color: '#273c66', weight: 4, opacity: .55, dashArray: t.skip ? '6 6' : null});});
  S.forEach((s, i) => {const m = marks[s.id]; if (m?._icon) m._icon.classList.toggle('is-done', T[i].done);});
 }
};

const status = root.querySelector('[data-day-status]');
const save = async next => {
 if (ro) return;
 status && (status.textContent = 'Saving…');
 try {
  const r = await fetch('/api/day/log', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({value: JSON.stringify(next)})});
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Could not save');
  log = next; render(); status && (status.textContent = 'Saved for everyone ' + l12(sgNow()));
 } catch (e) {status && (status.textContent = 'Not saved: ' + e.message + '. Check the connection and try again.');}
};
const clone = () => ({a: {...log.a}, l: {...log.l}, x: [...(log.x ?? [])], d: {...log.d}});

let editing = null;
const form = root.querySelector('[data-day-form]'), err = root.querySelector('[data-day-err]');
root.querySelectorAll('[data-stop]').forEach(li => {
 const id = li.dataset.stop, s = S.find(x => x.id === id);
 li.querySelector('[data-act=a]')?.addEventListener('click', () => {const n = clone(); n.a[id] = sgNow(); save(n);});
 li.querySelector('[data-act=l]')?.addEventListener('click', () => {const n = clone(); n.l[id] = sgNow(); if (!n.a[id]) n.a[id] = toHM(toMin(n.l[id]) - (n.d[id] ?? s.stay)); save(n);});
 li.querySelector('[data-act=skip]')?.addEventListener('click', () => {const n = clone(); n.x = n.x.includes(id) ? n.x.filter(x => x !== id) : [...n.x, id]; save(n);});
 li.querySelector('[data-act=edit]')?.addEventListener('click', () => {
  editing = s; form.hidden = false; err.hidden = true;
  form.querySelector('[data-form-title]').textContent = s.n;
  form.elements.a.value = log.a?.[id] ?? ''; form.elements.l.value = log.l?.[id] ?? ''; form.elements.d.value = String(log.d?.[id] ?? s.stay);
  li.after(form); form.scrollIntoView({behavior: 'smooth', block: 'center'});
 });
});
if (form) {
 form.querySelector('[data-cancel]').onclick = () => {form.hidden = true; editing = null;};
 form.onsubmit = ev => {
  ev.preventDefault();
  const f = form.elements, d = f.d.value.trim();
  if (!/^\d{1,3}$/.test(d) || Number(d) > 240) {err.textContent = 'Type the stay in minutes, 0 to 240.'; err.hidden = false; return;}
  if (f.a.value && f.l.value && f.l.value < f.a.value) {err.textContent = 'The leaving time is before the arriving time.'; err.hidden = false; return;}
  const n = clone(), id = editing.id;
  if (f.a.value) n.a[id] = f.a.value; else delete n.a[id];
  if (f.l.value) n.l[id] = f.l.value; else delete n.l[id];
  if (Number(d) === editing.stay) delete n.d[id]; else n.d[id] = Number(d);
  form.hidden = true; save(n);
 };
}
const reset = root.querySelector('[data-reset]');
if (reset) reset.onclick = () => {
 if (reset.dataset.armed) {delete reset.dataset.armed; reset.textContent = 'Clear all times'; save({a: {}, l: {}, x: [], d: {}}); return;}
 reset.dataset.armed = '1'; reset.textContent = 'Tap again to clear for everyone';
 setTimeout(() => {if (reset.dataset.armed) {delete reset.dataset.armed; reset.textContent = 'Clear all times';}}, 4000);
};
// Pick up the others' taps.
const poll = async () => {
 if (document.hidden) return;
 try {
  const r = await fetch('/api/day/log', {cache: 'no-store'});
  if (!r.ok) return;
  const {value} = await r.json(), next = value ? JSON.parse(value) : {};
  const n = {a: next.a ?? {}, l: next.l ?? {}, x: next.x ?? [], d: next.d ?? {}};
  if (JSON.stringify(n) !== JSON.stringify(log)) {log = n; render();}
 } catch {}
};
setInterval(poll, 20000);
document.addEventListener('visibilitychange', poll);
setInterval(render, 60000);
render();
})();
