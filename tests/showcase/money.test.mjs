import test from 'node:test';
import assert from 'node:assert/strict';
import {BUY,buyKeys,validBuyValue,moneyPlan,payOf} from '../../showcase/buy-plan.mjs';
import {buyPage} from '../../showcase/buy.mjs';

test('pay key: every item has one, only listed values pass', () => {
 const k = buyKeys(), spec = k.get('b:washer:pay');
 assert.equal(spec.kind, 'pay');
 for (const ok of ['', 'now', 'dec', 'later', 'i6', 'i12', 'i24']) assert.ok(validBuyValue(spec, ok), ok);
 for (const bad of ['i3', '12', 'NOW', 'x']) assert.ok(!validBuyValue(spec, bad), bad);
});

test('money plan: auto by date, instalments and splits add up', () => {
 const base = moneyPlan(), all = s => s.now + s.dec + s.later + s.inst;
 assert.equal(payOf(BUY.rooms.flatMap(r => r.items).find(i => i.id === 'washer')).use, 'now');
 const v = {'b:washer:pay': 'i12'}, m = moneyPlan(BUY, v), w = m.inst.find(x => x.id === 'washer');
 assert.ok(w && w.months === 12 && Math.abs(w.monthly * 12 - w.amount) < 1e-6);
 assert.ok(Math.abs(all(m.sums) - all(base.sums)) < 1e-6, 'moving an item does not change the total');
 const dep = base.now.find(x => x.id === 'contractor-i-niche-renovation-quote');
 assert.ok(dep && Math.abs(dep.amount - 1903.5) < 0.01, 'I-Niche: only the 10% deposit is due now');
 assert.ok(base.paid.some(x => x.id === 'contractor-mcst-renovation-deposit-refundable'));
 assert.ok(!moneyPlan(BUY, {'b:washer:tag': 'maybe'}).now.some(x => x.id === 'washer'), 'maybe items are left out');
});

test('buy page shows the money plan and a Pay choice', () => {
 const html = buyPage({'b:washer:pay': 'i12'});
 assert.match(html, /id="buy-money"/);
 assert.match(html, /data-b="pay"/);
 assert.match(html, /<option value="i12" selected>12-month instalments/);
});
