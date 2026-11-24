// /pay: add, edit, mark paid and delete payments. The whole list is saved as one value (PUT /api/pay/log), then the page reloads.
(() => {
const root = document.querySelector('[data-pay-page]');
if (!root || root.hasAttribute('data-ro')) return;
const D = JSON.parse(root.querySelector('#pay-data').textContent), list = D.list.map(e => ({...e}));
const form = root.querySelector('[data-pay-form]'), status = root.querySelector('[data-pay-status]'), err = root.querySelector('[data-pay-err]');
const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
let editing = null;
const save = async next => {
 status.textContent = 'Saving…';
 try {
  const r = await fetch('/api/pay/log', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({value: JSON.stringify(next)})});
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Could not save');
  location.reload();
 } catch (e) {status.textContent = 'Not saved: ' + e.message + '. Check the connection and try again.'; return false;}
 return true;
};
const open = e => {
 editing = e;
 form.hidden = false;
 form.querySelector('[data-form-title]').textContent = e ? 'Change this payment' : 'Add a payment';
 form.querySelector('[data-del]').hidden = !e;
 const v = e ?? {status: 'paid', to: '', what: '', amt: '', cur: 'SGD', date: today, by: '', how: '', back: false, note: ''};
 form.querySelector(`[name=status][value=${v.status}]`).checked = true;
 for (const k of ['to', 'what', 'cur', 'date', 'by', 'how', 'note']) form.elements[k].value = v[k] ?? '';
 form.elements.amt.value = v.amt === '' ? '' : String(v.amt);
 form.elements.back.checked = !!v.back;
 err.hidden = true;
 form.scrollIntoView({behavior: 'smooth', block: 'start'});
 form.elements.to.focus({preventScroll: true});
};
root.querySelector('[data-add]').onclick = () => open(null);
form.querySelector('[data-cancel]').onclick = () => {form.hidden = true; editing = null;};
form.elements.amt.addEventListener('blur', () => {const ok = /^\d{1,7}(\.\d{1,2})?$/.test(form.elements.amt.value.trim()); err.hidden = ok; if (!ok) err.textContent = 'Type the amount as a number, like 1000 or 4355.50.';});
form.elements.amt.addEventListener('input', () => {err.hidden = true;});
form.onsubmit = async ev => {
 ev.preventDefault();
 const f = form.elements, amt = f.amt.value.trim();
 if (!f.to.value.trim()) {err.textContent = 'Type who the payment is to.'; err.hidden = false; return;}
 if (!/^\d{1,7}(\.\d{1,2})?$/.test(amt)) {err.textContent = 'Type the amount as a number, like 1000 or 4355.50.'; err.hidden = false; return;}
 const e = {id: editing?.id ?? 'p' + Date.now().toString(36), date: f.date.value, status: form.querySelector('[name=status]:checked').value, to: f.to.value.trim(), what: f.what.value.trim(), amt: Number(amt), cur: f.cur.value, by: f.by.value, how: f.how.value, back: f.back.checked, note: f.note.value.trim()};
 const next = editing ? list.map(x => x.id === editing.id ? e : x) : [...list, e];
 form.querySelector('[type=submit]').disabled = true;
 if (!(await save(next))) form.querySelector('[type=submit]').disabled = false;
};
form.querySelector('[data-del]').onclick = async () => {
 if (!editing || !confirm(`Delete the payment "${editing.to}: ${editing.what || editing.amt}"? This removes it for everyone.`)) return;
 await save(list.filter(x => x.id !== editing.id));
};
root.querySelectorAll('.pay-row').forEach(li => {
 const e = list.find(x => x.id === li.dataset.id);
 li.querySelector('[data-act=edit]')?.addEventListener('click', () => open(e));
 li.querySelector('[data-act=paid]')?.addEventListener('click', ev => {ev.currentTarget.disabled = true; save(list.map(x => x.id === e.id ? {...x, status: 'paid', date: !x.date || x.date > today ? today : x.date} : x));});
});
})();
