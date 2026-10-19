import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { achievements, achievementById, achievementDefaults, achievementUrl, readAchievementState, findAchievements, featuredAchievements } from '../src/content/achievementsModel.js';
import { stories, lifeById, lifeDefaults, galleryStories, findGalleryStories, readLifeState, lifeUrl } from '../src/content/campusLifeModel.js';
const json = name => JSON.parse(readFileSync(new URL(`../reference/highlights/${name}`, import.meta.url), 'utf8'));
const all = [...achievements, ...galleryStories];
const normalise = text => text.replace(/\s+/g, ' ').trim();
test('61 pages, every report line and all 60 source images are accounted for', () => {
  const source = json('extracted.json');
  assert.deepEqual(source.map(d => d.pages.length), [42, 19]);
  assert.equal(achievements.length, 49); assert.equal(galleryStories.length, 24); assert.equal(stories.filter(s => !s.gallery).length, 158);
  assert.equal(new Set(all.map(r => r.slug)).size, all.length);
  for (const line of json('text-audit.json')) {
    const record = achievementById[line.record] || lifeById[line.record];
    const text = normalise([record.originalTitle, ...record.body, ...(record.sourceBody || []), ...record.sources.flatMap(s => [s.originalTitle, ...s.body])].join(' '));
    assert.ok(text.includes(normalise(line.text)), `${line.record} p${line.page}: ${line.text}`);
  }
  const expected = [];
  for (const d of source) {
    const footer = d.pages.flatMap(p => p.blocks.flatMap(b => b.lines.filter(l => l.text === 'Chinmaya Vidyalaya - Kolazhy.').map(l => p.page * 1000 + l.bbox[1])))[0];
    for (const p of d.pages) for (const im of p.images) if (im.width >= 100 && im.height >= 80 && im.rects.some(r => p.page * 1000 + r[1] < footer && !(p.page === 1 && r[1] < 400))) expected.push(im.digest);
    for (const p of d.pages) for (const b of p.blocks) for (const l of b.lines) {
      if (Math.abs(l.size - 11.25) > .1 || !(110 < l.bbox[0] && l.bbox[0] < 500) || p.page * 1000 + l.bbox[1] >= footer) continue;
      assert.ok(all.some(r => r.sources.some(s => s.file === d.file && s.body.join(' ').includes(l.text.trim()))), `unassigned report p${p.page}: ${l.text}`);
    }
  }
  assert.deepEqual(all.flatMap(r => r.images.map(im => im.id)).sort(), expected.sort());
  for (const r of all) for (const im of r.images) for (const path of [im.src, im.preview, im.thumbnail, im.originalSrc]) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
});
test('poster-only entries, qualifications and original academic figures remain faithful', () => {
  for (let n = 1; n <= 14; n++) { const a = achievementById[`a-${String(n).padStart(2, '0')}`]; assert.ok(a.verifiedTranscription.length); assert.ok(a.images.length); }
  assert.equal(achievementById['a-01'].images.length, 2);
  assert.match(achievementById['a-19'].excerpt, /qualified for the second round/i);
  assert.match(achievementById['a-22'].excerpt, /selected/i);
  const results = achievementById['a-32'].body.join(' ');
  for (const number of ['171', '54', '133', '12', '151', '55', '99', '11', '10,000']) assert.ok(results.includes(number), number);
  assert.ok(achievementById['a-28'].sourceBody.length); assert.ok(achievementById['a-42'].sourceBody.length);
  assert.ok(achievementById['a-05'].notes.length); assert.equal(achievementById['a-46'].years.length, 0);
  assert.ok(featuredAchievements.every(a => a.years.length && a.images.length));
});
test('videos map to coordinate references, deduplicate repeated players and retain real thumbnails', () => {
  const videos = galleryStories.flatMap(s => s.videos);
  assert.equal(videos.length, 8); assert.equal(new Set(videos.map(v => v.id)).size, 8);
  assert.equal(videos.reduce((sum, v) => sum + v.sources.length, 0), 18);
  const council = videos.find(v => v.id === 'XRMB6tqV1W8'); assert.equal(council.sources.length, 4); assert.match(council.title, /Student Council Election/);
  for (const v of videos) { assert.ok(v.sources.every(s => s.rect.length === 4)); assert.ok(existsSync(new URL(`../public${v.thumbnail}`, import.meta.url))); }
  assert.equal(galleryStories.filter(s => s.images.length).length, 17);
  assert.equal(lifeById['g-12'].years.length, 0); assert.equal(lifeById['g-12'].images.length, 2);
  assert.notEqual(lifeById['g-12'].slug, lifeById['4-08'].slug);
});
test('filtered record links round-trip and search reaches verified poster names and full reports', () => {
  const state = { ...achievementDefaults, q: 'Vasuki', category: 'Arts & Culture', year: 'unknown', limit: 12, achievement: achievementById['a-19'].slug };
  assert.deepEqual(readAchievementState(new URL(achievementUrl(state), 'https://example.test').search), state);
  assert.equal(findAchievements(state)[0].id, 'a-19');
  assert.ok(findAchievements({ ...achievementDefaults, q: '99.4%' }).some(a => a.id === 'a-04'));
  const gallery = { ...lifeDefaults, gq: 'MUN', media: 'photos', gyear: 'unknown', glimit: 12, story: lifeById['g-12'].slug };
  assert.deepEqual(readLifeState(new URL(lifeUrl(gallery, '#event-gallery'), 'https://example.test').search), gallery);
  assert.equal(findGalleryStories(gallery).length, 1);
  assert.equal(findGalleryStories({ ...lifeDefaults, media: 'videos' }).length, 8);
});
