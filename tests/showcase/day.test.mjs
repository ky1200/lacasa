import test from 'node:test';
import assert from 'node:assert/strict';
import {validDayLog, dayLog, dayTimes, dayPage, DAY_KEY, DAY_STOPS} from '../../showcase/day.mjs';

test('day: plan without taps keeps KX pickup at 2pm and KX leaving before 6:30pm', () => {
 const t = Object.fromEntries(dayTimes().map(x => [x.id, x]));
 assert.equal(t.cp.start, '09:00');
 assert.equal(t.nus.start, '14:00');
 assert.ok(t.nus.wait > 0);
 assert.ok(t.kx.start <= '18:30');
 assert.ok(t.rigel.end <= '17:30');
 assert.deepEqual(dayTimes().flatMap(x => x.warn), []);
});
test('day: a late arrival moves every later stop and warns at closing times', () => {
 const log = {a: {cp: '09:15', uob: '12:30'}, l: {}, x: [], d: {}};
 const t = Object.fromEntries(dayTimes(log).map(x => [x.id, x]));
 assert.equal(t.cp.start, '09:15');
 assert.equal(t.atm.start, '09:45');
 assert.equal(t.uob.late, 103);
 assert.ok(t.rigel.start > '15:00');
 const late = dayTimes({a: {rigel: '17:20'}, l: {}, x: [], d: {}}).find(x => x.id === 'rigel');
 assert.match(late.warn.join(), /Closes at 5:30pm/);
});
test('day: skipping the optional stop and changing a stay', () => {
 const base = dayTimes().find(x => x.id === 'home').start;
 const t = dayTimes({a: {}, l: {}, x: ['extra'], d: {heritage: 15}});
 assert.ok(t.find(x => x.id === 'extra').skip);
 assert.ok(t.find(x => x.id === 'home').start < base);
});
test('day: saved values are checked', () => {
 assert.ok(validDayLog(''));
 assert.ok(validDayLog(JSON.stringify({a: {cp: '09:10'}, l: {cp: '09:30'}, x: ['extra'], d: {rigel: 90}})));
 assert.ok(!validDayLog('nope'));
 assert.ok(!validDayLog(JSON.stringify({a: {cp: '9:10'}})));
 assert.ok(!validDayLog(JSON.stringify({a: {nowhere: '09:10'}})));
 assert.ok(!validDayLog(JSON.stringify({x: ['rigel']})));
 assert.ok(!validDayLog(JSON.stringify({d: {rigel: 999}})));
 assert.ok(!validDayLog(JSON.stringify({z: 1})));
 assert.deepEqual(dayLog({[DAY_KEY]: 'bad'}), {a: {}, l: {}, x: [], d: {}});
});
test('day page: stops, guide, no unit number, neutral wording', () => {
 const html = dayPage({});
 for (const s of DAY_STOPS) assert.ok(html.includes(`data-stop="${s.id}"`));
 assert.match(html, /href="\/bathrooms"/);
 assert.match(html, /Arrived now/);
 assert.doesNotMatch(html, /#\d{2}-\d{3}\b/);
 const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
 assert.doesNotMatch(text, /\byou\b|\byour\b|perfect|amazing/i);
 assert.doesNotMatch(dayPage({}, true), /data-act="a"/);
});

test('bathrooms page: split plan, price check, guide, neutral wording', async () => {
 const {bathroomsPage, BATH_SG, bathSum} = await import('../../showcase/bathrooms.mjs');
 const html = bathroomsPage({});
 assert.match(html, /id="price-check"/);
 assert.match(html, /id="bathroom-guide"/);
 assert.match(html, /id="split"/);
 assert.equal(bathSum(BATH_SG), 2961);
 const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
 assert.doesNotMatch(text, /\byou\b|\byour\b|perfect|amazing/i);
 assert.doesNotMatch(bathroomsPage({}, true), /Add a shop price/);
});
