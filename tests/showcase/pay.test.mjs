import test from 'node:test';
import assert from 'node:assert/strict';
import {validPayLog, payList, payTotals, payPage, PAY_SEED, PAY_KEY} from '../../showcase/pay.mjs';

test('payments: seed list is valid and used until the family saves', () => {
 assert.ok(validPayLog(JSON.stringify(PAY_SEED)));
 assert.deepEqual(payList({}), PAY_SEED);
 const mine = [{id: 'p1', date: '2026-11-25', status: 'paid', to: 'MCST', what: 'Deposit', amt: 1000, cur: 'SGD', by: 'KY', how: 'Cash', back: true, note: ''}];
 assert.deepEqual(payList({[PAY_KEY]: JSON.stringify(mine)}), mine);
 assert.equal(Math.round(payTotals(mine).paid), 1000);
 assert.equal(Math.round(payTotals(mine).back), 1000);
});
test('payments: bad lists are rejected', () => {
 assert.ok(!validPayLog('not json'));
 assert.ok(!validPayLog(JSON.stringify([{id: 'a', date: '', status: 'paid', to: '', what: '', amt: 1, cur: 'SGD'}])));
 assert.ok(!validPayLog(JSON.stringify([{id: 'a', date: '', status: 'maybe', to: 'X', what: '', amt: 1, cur: 'SGD'}])));
 assert.ok(!validPayLog(JSON.stringify([{id: 'a', date: '', status: 'paid', to: 'X', what: '', amt: -5, cur: 'SGD'}])));
 assert.ok(!validPayLog(JSON.stringify([{id: 'a', date: '', status: 'paid', to: 'X', what: '', amt: 5, cur: 'USD'}])));
 assert.ok(validPayLog(''));
});
test('payments page: totals, lists and no address', () => {
 const html = payPage({}, false, '2026-11-24');
 assert.match(html, /Paid so far/);
 assert.match(html, /La Casa management \(MCST\)/);
 assert.match(html, /\+ Add a payment/);
 assert.doesNotMatch(html, /#\d{2}-\d{2}/);
 assert.doesNotMatch(payPage({}, true), /Add a payment/);
});
