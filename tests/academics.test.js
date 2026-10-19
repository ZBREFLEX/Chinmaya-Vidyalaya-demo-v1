import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { content, streams, defaultState, readAcademicState, academicQuery, matchingResults } from '../src/content/academicsModel.js';

const source = JSON.parse(readFileSync(new URL('../reference/academics/extracted.json', import.meta.url), 'utf8'));
const normalise = text => text.replace(/\s+/g, ' ').trim();

test('all 27 complete subject combinations retain source wording and order', () => {
  assert.deepEqual(streams.map(s => content.combinations.filter(c => c.stream === s).length), [14, 6, 7]);
  const text = source[1].pages.map(p => normalise(p.text)).join(' ');
  for (const combination of content.combinations) {
    assert.ok(text.includes(combination.raw), combination.id);
    assert.equal(combination.subjects.join(', '), combination.raw);
    assert.equal(combination.subjects.length, combination.ambiguous ? 4 : 5);
  }
  assert.deepEqual(content.combinations[1].subjects, ['English', 'Physics', 'Chemistry', 'Introductory Computer Science (Python)', 'Mathematics']);
  assert.equal(content.combinations.filter(c => c.ambiguous).length, 3);
  assert.equal(content.combinations.at(-1).subjects.at(-1), 'Physical Education');
});

test('all 95 names and exact percentage strings survive every results page', () => {
  const resultSource = source[5].pages;
  const sourceMarks = resultSource.flatMap(p => p.text.split('\n').filter(line => /^\d{2}(?:\.\d+)?$/.test(line)));
  assert.equal(content.results.length, 95);
  assert.equal(new Set(content.results.map(r => r.id)).size, 95);
  assert.deepEqual(content.results.map(r => r.percentage), sourceMarks);
  assert.deepEqual(['class-x', 'science', 'commerce', 'humanities'].map(c => content.results.filter(r => r.category === c).length), [31, 34, 28, 2]);
  for (const record of content.results) {
    assert.ok(normalise(resultSource[record.source.page - 1].text).includes(record.name), record.name);
    assert.equal(record.sourceYear.replace(/\s/g, ''), record.year);
    assert.match(record.year, /^\d{4}-\d{4}$/);
  }
});

test('merged year cells and the duplicate Science year retain distinct students', () => {
  for (const [name, year] of [['ANAIKA AFSAL', '2018-2019'], ['V. P. S. RITWIKA', '2007-2008'], ['MRIDULA. N.', '1998-1999'], ['POORNIMA. Y.', '1996-1997'], ['KEERTHI SAGAR', '2009-2010'], ['PARVATHI MOHAN', '2017-2018']]) assert.equal(content.results.find(r => r.name === name).year, year);
  assert.deepEqual(content.results.filter(r => r.category === 'science' && r.year === '2023-2024').map(r => [r.name, r.percentage]), [['SIDHARTH PRADEEP', '96.6'], ['SIDHARTH V JAIN', '97.4']]);
});

test('all distinct resource controls map to their annotated source destinations', () => {
  const links = new Set(source[3].pages.flatMap(p => p.links.filter(l => l.uri.includes('drive.google.com')).map(l => l.uri)));
  assert.equal(content.resources.length, 16);
  assert.deepEqual(new Set(content.resources.map(r => r.url)), links);
  assert.equal(content.resources.filter(r => r.kind === 'folder').length, 7);
  assert.equal(content.resources.filter(r => r.kind === 'document').length, 9);
  for (const r of content.resources) {
    assert.equal(r.year, '2021-2022');
    assert.match(r.source.label, new RegExp(`STD ${r.class}(?:\\s|$)`));
    if (r.stream) assert.ok(r.source.label.includes(r.stream));
  }
  assert.ok(source[4].pages[0].links.some(l => l.uri === content.training.url));
});

test('shareable state round-trips, validates inputs and filters tied archive records', () => {
  const state = { ...defaultState, stream: 'Humanities', class: '12', paperStream: 'Commerce', category: 'science', year: '2023-2024', limit: 16 };
  assert.deepEqual(readAcademicState(academicQuery(state)), state);
  assert.equal(matchingResults(state).length, 2);
  assert.equal(matchingResults({ ...state, name: 'v jain' })[0].name, 'SIDHARTH V JAIN');
  assert.equal(matchingResults({ ...state, name: 'does not exist' }).length, 0);
  assert.equal(readAcademicState('?category=unknown&stream=invalid&class=99&limit=-1').category, 'class-x');
  assert.equal(readAcademicState('?year=broken').year, '');
  assert.equal(readAcademicState('?subject=Economics%20Psychology').subject, '');
});
