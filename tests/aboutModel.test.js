import test from 'node:test';
import assert from 'node:assert/strict';
import content from '../src/content/about.json' with { type: 'json' };
import { findInformation, peopleGroups, ruleTopics, searchIndex, uniformGroups } from '../src/content/aboutModel.js';

test('class aliases reveal the same verified uniform categories', () => {
  for (const query of ['class 6 uniform', 'Grade 6 uniform', ' VI, uniform! ']) {
    assert.deepEqual(findInformation(query).filter(item => item.state.uniform !== undefined).map(item => item.id), ['uniform-2', 'uniform-4']);
  }
  assert.ok(findInformation('boys class 12 uniform').some(item => item.id === 'uniform-5'));
  assert.ok(findInformation('girls LKG uniform').some(item => item.id === 'uniform-1'));
  assert.deepEqual(findInformation('class 1 uniform').filter(item => item.state.uniform !== undefined).map(item => item.id).sort(), ['uniform-1', 'uniform-4']);
});
test('TC, names, departments and hidden spiritual text are discoverable', () => {
  assert.ok(findInformation('TC').some(item => item.id === 'admission-rule-03'));
  assert.ok(findInformation('T.C.').some(item => item.id === 'admission-rule-03'));
  assert.equal(findInformation('Smt. Bini M')[0].id, 'administration-person-01');
  assert.ok(findInformation('librarian').some(item => item.state.group === 'administration'));
  assert.equal(findInformation('Spiritual Development')[0].id, 'pillar-1-part-4');
  assert.deepEqual(findInformation('zzzzqqqq'), []);
});
test('every policy source identifier is covered exactly once, with repeated wording combined', () => {
  const rules = ruleTopics.flatMap(topic => topic.rules);
  const ids = rules.flatMap(rule => rule.sourceIds);
  assert.equal(ids.length, content.rules[0].items.length + content.rules[1].items.length);
  assert.equal(new Set(ids).size, ids.length);
  content.rules[0].items.forEach((text, index) => {
    const mapped = rules.find(rule => rule.sourceIds.includes(`discipline:${index + 1}`));
    assert.equal(mapped.text, text);
  });
  content.rules[1].items.forEach((text, index) => assert.equal(rules.find(rule => rule.sourceIds.includes(`admissions:${index + 1}`)).text, text));
});
test('all source directories, uniform instructions and prose remain indexed', () => {
  assert.equal(peopleGroups.flatMap(group => group.records).length, content.committee.length + content.leaders.length + content.departments.length + content.staff.length);
  uniformGroups.forEach(group => assert.ok(searchIndex.find(item => item.id === group.id).text.includes(group.items.at(-1))));
  content.story.forEach((section, index) => assert.equal(searchIndex.find(item => item.id === `story-detail-${index + 1}`).text, section.paragraphs.join(' ')));
  assert.equal(searchIndex.find(item => item.id === 'principal-letter').text, content.principal.join(' '));
  assert.equal(new Set(searchIndex.map(item => item.id)).size, searchIndex.length);
});
