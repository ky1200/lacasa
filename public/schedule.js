// /schedule: filter by who, and add / change / delete entries. The whole list is saved as one value (PUT /api/schedule/log).
(() => {
const root = document.querySelector('[data-sch-page]');
if (!root) return;
// Filter: show one party at a time (works in read-only views too)
const btns = root.querySelectorAll('[data-show]');
btns.forEach(b => b.addEventListener('click', () => {
 const id = b.dataset.show;
 btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
 root.querySelectorAll('.sch-chip').forEach(c => {c.hidden = id !== 'all' && c.dataset.who !== id;});
 root.querySelectorAll('.sch-day').forEach(d => d.classList.toggle('is-filtered-empty', id !== 'all' && !d.querySelector('.sch-chip:not([hidden])')));
}));
if (root.hasAttribute('data-ro')) return;
const list = JSON.parse(root.querySelector('#sch-data').textContent).list.map(e => ({...e}));
const form = root.querySelector('[data-sch-form]'), status = root.querySelector('[data-sch-status]'), err = root.querySelector('[data-sch-err]');
let editing = null;
const save = async next => {
 status.textContent = 'Saving…';
 try {
  const r = await fetch('/api/schedule/log', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({value: JSON.stringify(next)})});
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Could not save');
  location.reload();
 } catch (e) {status.textContent = 'Not saved: ' + e.message + '. Check the connection and try again.'; return false;}
 return true;
};
const open = e => {
 editing = e;
 form.hidden = false;
 form.querySelector('[data-form-title]').textContent = e ? 'Change this entry' : 'Add to the schedule';
 form.querySelector('[data-del]').hidden = !e;
 const v = e ?? {who: 'family', kind: 'work', date: '', end: '', t: '', note: ''};
 for (const k of ['who', 'kind', 'date', 'end', 't', 'note']) form.elements[k].value = v[k] ?? '';
 err.hidden = true;
 form.scrollIntoView({behavior: 'smooth', block: 'start'});
 form.elements.t.focus({preventScroll: true});
};
root.querySelector('[data-add]').onclick = () => open(null);
form.querySelector('[data-cancel]').onclick = () => {form.hidden = true; editing = null;};
const checkEnd = () => {
 const f = form.elements, bad = f.end.value && (!f.date.value || f.end.value < f.date.value);
 err.hidden = !bad;
 if (bad) err.textContent = 'The "To" date must be on or after the "From" date.';
 return !bad;
};
form.elements.end.addEventListener('blur', checkEnd);
form.elements.end.addEventListener('input', () => {err.hidden = true;});
form.onsubmit = async ev => {
 ev.preventDefault();
 const f = form.elements;
 if (!f.t.value.trim()) {err.textContent = 'Type what is happening.'; err.hidden = false; return;}
 if (!checkEnd()) return;
 const e = {id: editing?.id ?? 'e' + Date.now().toString(36), who: f.who.value, kind: f.kind.value, date: f.date.value, end: f.end.value && f.end.value !== f.date.value ? f.end.value : '', t: f.t.value.trim(), note: f.note.value.trim()};
 const next = editing ? list.map(x => x.id === editing.id ? e : x) : [...list, e];
 form.querySelector('[type=submit]').disabled = true;
 if (!(await save(next))) form.querySelector('[type=submit]').disabled = false;
};
form.querySelector('[data-del]').onclick = async () => {
 if (!editing || !confirm(`Delete "${editing.t}" from the schedule? This removes it for everyone.`)) return;
 await save(list.filter(x => x.id !== editing.id));
};
root.querySelectorAll('.sch-chip [data-act=edit]').forEach(b => b.addEventListener('click', () => open(list.find(x => x.id === b.closest('.sch-chip').dataset.id))));
})();
