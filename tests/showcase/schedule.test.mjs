import test from 'node:test';
import assert from 'node:assert/strict';
import {validSchLog, schList, schedulePage, daysOf, weeksFor, SCH_SEED, SCH_KEY, PARTIES} from '../../showcase/schedule.mjs';

test('schedule: seed is valid and used until the family saves', () => {
 assert.ok(validSchLog(JSON.stringify(SCH_SEED)));
 assert.deepEqual(schList({}), SCH_SEED);
 const mine = [{id: 'x1', who: 'family', kind: 'due', date: '2026-12-01', end: '', t: 'Buy lights', note: ''}];
 assert.deepEqual(schList({[SCH_KEY]: JSON.stringify(mine)}), mine);
 assert.ok(SCH_SEED.some(e => e.who === 'vhaus' && e.date === '2026-12-08'), 'V Haus measures on 8 Dec');
});
test('schedule: bad lists are rejected', () => {
 const ok = {id: 'x1', who: 'iniche', kind: 'work', date: '2026-12-04', end: '2026-12-05', t: 'Hacking', note: ''};
 assert.ok(validSchLog(JSON.stringify([ok])));
 for (const bad of [{...ok, who: 'nobody'}, {...ok, kind: 'party'}, {...ok, date: '4 Dec'}, {...ok, end: '2026-12-01'}, {...ok, t: ' '}, {...ok, end: '2026-12-05', date: ''}]) assert.equal(validSchLog(JSON.stringify([bad])), false);
 assert.equal(validSchLog(JSON.stringify([ok, ok])), false, 'duplicate ids');
 assert.equal(validSchLog('not json'), false);
});
test('schedule: multi-day entries and weeks', () => {
 assert.deepEqual(daysOf({date: '2026-12-04', end: '2026-12-05'}), ['2026-12-04', '2026-12-05']);
 assert.deepEqual(daysOf({date: '', end: ''}), []);
 const w = weeksFor(SCH_SEED, '2026-11-26');
 assert.equal(w[0], '2026-11-30');
 assert.ok(w.every(d => new Date(d + 'T00:00:00Z').getUTCDay() === 1), 'weeks start on Monday');
});
test('schedule page: weeks, parties, form and no address', () => {
 const html = schedulePage({}, false, '2026-11-26');
 assert.match(html, /30 Nov – 6 Dec/);
 assert.match(html, /\+ Add to the schedule/);
 assert.match(html, /Date to confirm/);
 for (const p of PARTIES) assert.ok(html.includes(p.full.replace(/&/g, '&amp;')), p.id);
 assert.doesNotMatch(html, /woodlands|#07-31/i);
 assert.doesNotMatch(schedulePage({}, true, '2026-11-26'), /Add to the schedule/);
});
