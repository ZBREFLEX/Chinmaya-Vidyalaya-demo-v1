import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { campusLocations, findCampusSpaces, locationFromHash } from '../src/content/infrastructure.js';

test('all original campus passages, including page continuations and the auditorium, are retained', () => {
  // Independently extracted from all nine supplied PDFs, with line wrapping removed.
  const passages = JSON.parse(readFileSync(new URL('../reference/infrastructure/source-passages.json', import.meta.url), 'utf8'));
  assert.equal(campusLocations.length, 9);
  assert.equal(new Set(campusLocations.map(place => place.id)).size, 9);
  for (const place of campusLocations) {
    assert.deepEqual([...place.description, ...place.sublocations.flatMap(item => item.description)], passages[place.id], place.name);
  }
  assert.equal(locationFromHash('#tapovan-maharaj-auditorium').id, 'main-block');
  for (const place of campusLocations) assert.equal(locationFromHash(`#${place.slug}`), place);
  assert.equal(locationFromHash('#unknown'), undefined);
});

test('campus search discovers useful aliases and handles clear and empty results', () => {
  for (const [query, id] of [['KG', 'kg-block'], ['kindergarten', 'kg-block'], ['nursery', 'kg-block'], ['hostel', 'chinmaya-balaniketan'], [' GUEST house ', 'chinmaya-vishram'], ['auditorium', 'main-block'], ['temple', 'saraswathy-temple'], ['parking', 'parking-area'], ['exhibition', 'chinmaya-darshan']]) {
    assert.ok(findCampusSpaces(query).some(place => place.id === id), query);
  }
  assert.equal(findCampusSpaces('   ').length, 9);
  assert.equal(findCampusSpaces('no matching building').length, 0);
});

test('all ten authentic photographs and their source PDFs exist; Saket has no invented image', () => {
  const photos = campusLocations.flatMap(place => place.photos);
  assert.equal(photos.length, 10);
  assert.equal(new Set(photos.map(item => item.src)).size, 10);
  for (const photo of photos) {
    assert.ok(existsSync(new URL(`../public${photo.src}`, import.meta.url)), photo.src);
    assert.ok(existsSync(new URL(`../reference/infrastructure/${photo.source}`, import.meta.url)), photo.source);
    assert.ok(photo.width > 0 && photo.height > 0 && photo.alt && photo.caption);
  }
  assert.deepEqual(campusLocations.find(place => place.id === 'chinmaya-saket').photos, []);
});
