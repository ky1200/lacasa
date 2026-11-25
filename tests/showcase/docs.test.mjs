import test from 'node:test';
import assert from 'node:assert/strict';
import {DOCS, docsPage} from '../../showcase/docs.mjs';
test('docs: every entry has a link and summaries hold no personal numbers', () => {
 const html = docsPage();
 for (const g of DOCS) for (const d of g.items) {assert.match(d.href, /^(https:\/\/drive\.google\.com\/|\/files\/)/); assert.match(d.date, /^\d{4}-\d{2}-\d{2}$/);}
 const text = html.replace(/<[^>]+>/g, ' ');
 assert.doesNotMatch(text, /\d{6}-\d{2}-\d{4}|#\d{2}-\d{2}\b|Woodlands Drive|\b\d{3}-\d{6}-\d{3}\b|8903/);
 assert.doesNotMatch(text, /\byou\b|\byour\b/i);
});
