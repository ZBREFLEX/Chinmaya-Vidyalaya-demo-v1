import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { facilities, facilityById, laboratoryEntries, allFacilityPhotos, findFacilities, facilityTarget } from '../src/content/facilities.js';

test('all ten facilities and every complete source paragraph are retained', () => {
  const passages = JSON.parse(readFileSync(new URL('../reference/facilities/source-passages.json', import.meta.url), 'utf8'));
  assert.equal(facilities.length, 10);
  assert.equal(new Set(facilities.map(item => item.id)).size, 10);
  for (const item of facilities) assert.deepEqual(item.description, passages[item.id], item.name);
  assert.match(facilityById.library.description[0], /approximately 15,000/);
  assert.match(facilityById.playground.description[0], /800 mt\. Track/);
  assert.match(facilityById['digital-classrooms'].description[0], /KG to Plus Two/);
  assert.match(facilityById['sick-bay'].description[0], /"Cleanliness is next to Godliness"/);
});

test('finder aliases select the intended facility or specific laboratory', () => {
  assert.equal(findFacilities('').length, 10);
  for (const [query, target] of [['books', 'library'], ['computer', 'computer-science-lab'], ['AI lab', 'artificial-intelligence-lab'], ['physics', 'physics-lab'], ['chemistry', 'chemistry-lab'], ['biology', 'biology-lab'], ['maths', 'mathematics-lab'], ['smart class', 'digital-classrooms'], ['bus', 'transport'], ['health', 'sick-bay'], ['rest', 'sick-bay'], ['accident', 'apan-mithra'], ['first aid', 'apan-mithra']]) {
    assert.equal(findFacilities(query)[0]?.id, target, query);
  }
  assert.equal(findFacilities('AI').some(item => item.id === 'apan-mithra'), false);
  assert.equal(findFacilities('no matching facility').length, 0);
  assert.equal(facilityTarget('artificial-intelligence-lab').lab.name, 'Artificial Intelligence');
  assert.equal(facilityTarget('unknown'), undefined);
});

test('six labs and sixteen distinct photographs have original sources and responsive previews', () => {
  assert.deepEqual(laboratoryEntries.map(item => item.name), ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'Artificial Intelligence']);
  assert.equal(allFacilityPhotos.length, 16);
  assert.equal(new Set(allFacilityPhotos.map(item => item.src)).size, 16);
  for (const item of allFacilityPhotos) {
    for (const path of [item.src, item.preview]) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
    assert.ok(item.width > 0 && item.height > 0 && item.caption && item.alt);
    for (const source of item.sources) assert.ok(existsSync(new URL(`../reference/facilities/${source.file}`, import.meta.url)), source.file);
  }
  assert.equal(facilityById.playground.relatedPhotoSources[0], facilityById['basketball-court'].photos[1]);
  assert.equal(facilityById['audio-visual-room'].photos.length, 0);
  assert.equal(facilityById['apan-mithra'].photos.length, 0);
  assert.equal(facilityById['digital-classrooms'].video, null);
});
