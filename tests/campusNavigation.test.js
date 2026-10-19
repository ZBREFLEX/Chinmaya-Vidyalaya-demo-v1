import test from 'node:test';
import assert from 'node:assert/strict';
import { campusSections, canonicalCampusUrl, campusSectionHref } from '../src/content/campusNavigation.js';

test('previous campus page links retain the section, detailed hash and query at the combined page', () => {
  for (const section of campusSections) {
    assert.equal(canonicalCampusUrl({ pathname: `/incampus/${section.id}` }), `/incampus#${section.id}`);
    assert.equal(canonicalCampusUrl({ pathname: `/incampus/${section.id}/`, search: '?from=parent', hash: '#detail' }), '/incampus?from=parent#detail');
  }
  assert.equal(canonicalCampusUrl({ pathname: '/incampus/', hash: '#physics-lab' }), '/incampus#physics-lab');
  assert.equal(canonicalCampusUrl({ pathname: '/incampus' }), null);
  assert.equal(canonicalCampusUrl({ pathname: '/about', hash: '#staff' }), null);
});

test('shared section links use the combined page and local anchors within Incampus', () => {
  for (const section of campusSections) {
    assert.equal(campusSectionHref(section.id), `/incampus#${section.id}`);
    assert.equal(campusSectionHref(section.id, 'incampus'), `#${section.id}`);
  }
});
