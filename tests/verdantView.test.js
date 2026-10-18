import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { gardens } from '../src/content/verdantView.js';

const normalise = text => text.replace(/[‘’]/g, "'").replace(/\s+\./g, '.').replace(/\s+/g, ' ').trim();

test('all three garden descriptions retain the supplied passages, including the Herbal Garden continuation', () => {
  const source = JSON.parse(readFileSync(new URL('../reference/verdant-view/source-passages.json', import.meta.url), 'utf8'));
  assert.equal(gardens.length, 3);
  assert.equal(new Set(gardens.map(garden => garden.id)).size, 3);
  for (const garden of gardens) assert.equal(normalise(garden.description), normalise(source[garden.id]), garden.title);
  assert.match(gardens[0].description, /organic manure and pesticides/);
  assert.equal(gardens[2].title, 'Nakshathravanam');
  assert.deepEqual(gardens[2].highlights, ['Birth-star plants', 'Dasapushpangal']);
});

test('four distinct original garden photographs and responsive previews have source records', () => {
  const photos = gardens.flatMap(garden => garden.images);
  assert.equal(photos.length, 4);
  assert.equal(new Set(photos.map(photo => photo.src)).size, 4);
  assert.deepEqual(gardens[0].images.map(photo => photo.source.page).sort(), [1, 2]);
  for (const photo of photos) {
    for (const path of [photo.src, photo.preview]) assert.ok(existsSync(new URL(`../public${path}`, import.meta.url)), path);
    assert.ok(existsSync(new URL(`../reference/verdant-view/${photo.source.file}`, import.meta.url)));
    assert.ok(photo.width > 0 && photo.height > 0 && photo.alt && photo.caption && photo.source.object);
  }
});
