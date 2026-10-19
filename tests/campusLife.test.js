import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { stories as allStories, lifeById, lifeCategories as allCategories, lifeDefaults, findLifeStories, readLifeState, lifeQuery, munWebsite } from '../src/content/campusLifeModel.js';

const stories = allStories.filter(s => !s.gallery);
const lifeCategories = allCategories.filter(c => c !== 'Event Gallery');
const json = file => JSON.parse(readFileSync(new URL(`../reference/campus-life/${file}`, import.meta.url), 'utf8'));
const source = json('extracted.json');
const normalise = text => text.replace(/\s+/g, ' ').trim();

test('all 132 source pages and 161 report headings are represented by 158 complete stories', () => {
  assert.deepEqual(source.map(s => s.pages.length), [15, 39, 33, 12, 18, 8, 4, 3]);
  assert.equal(stories.length, 158);
  assert.equal(new Set(stories.map(s => s.id)).size, 158);
  assert.equal(new Set(stories.map(s => s.slug)).size, 158);
  assert.deepEqual(lifeCategories.map(c => stories.filter(s => s.categories.includes(c)).length), [17, 51, 40, 21, 21, 7, 1, 1]);
  for (const line of json('text-audit.json')) {
    if (!line.record) continue;
    const story = lifeById[line.record];
    assert.ok(story, line.record);
    const original = normalise([story.originalTitle, ...story.body, ...story.sources.flatMap(s => [s.originalTitle, ...s.body])].join(' '));
    assert.ok(original.includes(normalise(line.text)), `${line.record}, ${line.file} p${line.page}: ${line.text}`);
  }
  assert.equal(stories.reduce((count, s) => count + s.sources.length, 0), 161);
});

test('every authentic image occurrence is accounted for, with shared duplicate references preserved', () => {
  const audit = json('photo-audit.json');
  assert.equal(audit.length, 165);
  assert.equal(new Set(audit.map(p => p.digest)).size, 163);
  const expected = [];
  for (const document of source) {
    const footer = document.pages.flatMap(page => page.blocks.filter(b => b.text.includes('Chinmaya Vidyalaya - Kolazhy.')).map(b => page.page * 1000 + b.bbox[1]))[0];
    for (const page of document.pages) for (const image of page.images) {
      if (image.width < 100 || image.height < 80) continue;
      if (!image.rects.some(r => page.page * 1000 + r[1] < footer && !(page.page === 1 && r[1] < 400))) continue;
      expected.push(`${document.file}:${page.page}:${image.digest}`);
    }
  }
  assert.deepEqual(audit.map(p => `${p.file}:${p.page}:${p.digest}`).sort(), expected.sort());
  for (const story of stories) for (const photo of story.images) {
    for (const path of [photo.src, photo.preview, photo.thumbnail]) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
    assert.ok(photo.width > 0 && photo.height > 0 && photo.alt && photo.caption);
    assert.ok(photo.sources.every(p => story.sources.some(s => s.file === p.file && s.pages.includes(p.page))));
  }
  assert.equal(lifeById['6-01'].images.length, 5);
  assert.equal(lifeById['7-01'].images.length, 4);
});

test('repeated occasions, source ambiguities and historical MUN content remain distinct', () => {
  const rice = stories.filter(s => s.category === 'Service to Society' && s.title === 'Oru Pidi Ari');
  assert.equal(rice.length, 3);
  for (const amount of ['140 kg', '70 Kg', '50Kgs']) assert.ok(rice.some(s => s.body.join(' ').includes(amount)));
  assert.ok(lifeById['1-13'].body.join(' ').includes("Children's day Celebration"));
  assert.ok(lifeById['1-13'].notes.some(note => note.includes('Kerala Piravi')));
  assert.ok(lifeById['2-05'].body.join(' ').includes('philately club'));
  assert.equal(lifeById['2-05'].dateText, 'Date not recorded');
  assert.equal(lifeById['4-08'].dateText, '12th and 13th November 2017');
  assert.ok(lifeById['4-08'].body.join(' ').includes('delegates'));
  assert.equal(munWebsite, 'https://chinmayavidyalaya.org/cvmun/index.html');
  assert.equal(lifeById['6-01'].body[0], 'The Vidyalaya has a strong team of Scouts and Guides from Std. V onwards.');
  assert.equal(lifeById['7-01'].body[0], 'The Vidyalaya has an enthusiastic team of Cubs and Bulbuls.');
  assert.equal(lifeById['1-01'].images.length, 0);
  assert.ok(stories.filter(s => s.title === 'Annual Day').length > 1);
});

test('search reaches complete reports, names, original categories, aliases and supplied dates', () => {
  for (const [q, id] of [['Onam', '1-39'], ['Oru Pidi Ari', '0-10'], ['Investiture', '1-07'], ['Reading Club', '5-04'], ['science exhibition', '3-02'], ['MUN', '4-08'], ['Ramavarmapuram', '0-10'], ['Olvex Michal Noronha', '2-04'], ['13.11.2017', '0-07']]) assert.ok(findLifeStories({ ...lifeDefaults, q }).some(s => s.id === id), q);
  for (const category of lifeCategories) assert.ok(findLifeStories({ ...lifeDefaults, category }).length > 0);
  assert.equal(findLifeStories({ ...lifeDefaults, q: 'there is no such story here' }).length, 0);
  assert.ok(findLifeStories({ ...lifeDefaults, theme: 'service' }).some(s => s.id === '5-05'));
  assert.ok(findLifeStories({ ...lifeDefaults, year: 'unknown' }).every(s => !s.years.length));
});

test('shareable selections and stories outside the first page round-trip without date inference', () => {
  const state = { ...lifeDefaults, q: 'KILA', category: 'Co-Scholastic', year: '2016', limit: 12, story: lifeById['4-16'].slug };
  assert.deepEqual(readLifeState(lifeQuery(state)), state);
  assert.equal(readLifeState('?category=madeup&year=2026&story=unknown&limit=-9').limit, 6);
  assert.equal(readLifeState('?story=2-01').story, lifeById['1-07'].slug);
  assert.deepEqual(lifeById['1-04'].years, []); // 77th Independence Day is not an explicit year.
  assert.deepEqual(lifeById['2-25'].years, []); // A batch/award year in an additional account is not the event date.
});
