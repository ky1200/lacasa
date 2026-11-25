import test from 'node:test';
import assert from 'node:assert/strict';
import {STAGES, stepState, progressSummary, progressPage, progressCard, validUpdate, addUpdate, progLog, PROG_KEY} from '../../showcase/progress.mjs';
import {BUY} from '../../showcase/buy-plan.mjs';
import {homePage} from '../../showcase/home.mjs';

test('progress: every step links to a real to-do or is fixed/dated', () => {
 const ids = new Set(BUY.todo.map(t => t.id));
 for (const g of STAGES) for (const s of g.steps) {
  if (s.todo) assert.ok(ids.has(s.todo), s.todo);
  else assert.ok(s.done || s.tbc || s.auto || s.date, s.t);
 }
});
test('progress: step states from ticks and dates', () => {
 assert.equal(stepState({todo: 'sign', date: '2026-11-28'}, {}, '2026-11-25'), 'next');
 assert.equal(stepState({todo: 'sign', date: '2026-11-28'}, {'t:sign': '1'}, '2026-11-25'), 'done');
 assert.equal(stepState({todo: 'quote2', date: '2026-11-24'}, {}, '2026-11-25'), 'late');
 assert.equal(stepState({date: '2026-12-05', auto: true}, {}, '2026-12-06'), 'done');
 const a = progressSummary({}, '2026-11-25'), b = progressSummary({'t:quote2': '1'}, '2026-11-25');
 assert.equal(b.done, a.done + 1);
 assert.equal(b.upcoming[0].st, 'next');
});
test('progress: updates are checked and newest first', () => {
 assert.ok(validUpdate({w: 'KY', t: 'Deposit paid'}));
 assert.ok(!validUpdate({w: 'Bob', t: 'Deposit paid'}));
 assert.ok(!validUpdate({w: 'KY', t: 'x'}));
 assert.ok(!validUpdate({w: 'KY', t: 'x'.repeat(281)}));
 const l = addUpdate(addUpdate([], {w: 'KY', t: 'first'}, new Date('2026-11-25T02:00:00Z')), {w: 'Mum', t: '  second   one '}, new Date('2026-11-25T03:30:00Z'));
 assert.equal(l[0].t, 'second one'); assert.equal(l[0].at, '2026-11-25 11:30'); assert.equal(l[1].w, 'KY');
 assert.deepEqual(progLog({[PROG_KEY]: 'nope'}), []);
 assert.equal(progLog({[PROG_KEY]: JSON.stringify(l)}).length, 2);
});
test('progress page and home card', () => {
 const html = progressPage({}, false, '2026-11-25');
 assert.match(html, /What's next/); assert.match(html, /Post update/); assert.match(html, /data-todo-id="sign"/);
 const text = html.replace(/<[^>]+>/g, ' ');
 assert.doesNotMatch(text, /\byou\b|\byour\b|perfect|amazing/i);
 assert.doesNotMatch(progressPage({}, true, '2026-11-25'), /Post update|<button/);
 assert.match(progressCard({}, '2026-11-25'), /href="\/progress"/);
 assert.match(homePage({}, '2026-11-25'), /class="hq-progress" href="\/progress"/);
});
