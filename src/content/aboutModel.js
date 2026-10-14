import content from './about.json' with { type: 'json' };

// Presentation metadata references the original source arrays; policy text is never copied.
const ruleLabels = {
  discipline: ['School uniform at school functions', 'Punctuality & attendance records', 'Leave applications & medical certificates', 'Visitors & permission to leave school', 'Jewellery, articles & money transactions', 'Responsibility for personal belongings', 'Care of classrooms & school property', 'Money & food purchases', 'Participation in games & activities', 'Parents’ cooperation with school work', 'Speaking to the Principal', 'Appointments with class teachers', 'Open house & progress reports', 'Following school rules', 'Politeness, courtesy & conduct', 'Collecting children by 3.30 p.m.', 'English on school premises', 'Contagious & infectious diseases', 'Personal grooming & hair', 'Trouser waist level', 'Grounds for dismissal', 'Checking homework & the diary', 'Bringing the diary daily', 'Collecting children in emergencies'],
  admissions: ['Transfer certificates from a previous school', 'Introducing new pupils', 'Transfer certificate: fees & dues', 'Transfer certificate: written application', 'Withdrawal: one month’s notice', 'Agreement to school regulations'],
};
export const ruleTopics = [
  { id: 'attendance', title: 'Attendance & leave', source: [1, 2, 17] },
  { id: 'discipline', title: 'School discipline', source: [0, 6, 8, 14, 20] },
  { id: 'families', title: 'Meeting teachers & collecting children', source: [3, 10, 11, 12, 15, 23] },
  { id: 'withdrawal', title: 'Admissions & withdrawal', admissions: true },
  { id: 'guidelines', title: 'Other guidelines', source: [4, 5, 7, 9, 13, 16, 18, 19, 21, 22] },
].map(topic => ({ ...topic, rules: (topic.admissions ? content.rules[1].items : topic.source.map(i => content.rules[0].items[i])).map((text, i) => ({
  id: `${topic.admissions ? 'admission' : 'discipline'}-rule-${String((topic.admissions ? i : topic.source[i]) + 1).padStart(2, '0')}`,
  text,
  title: topic.admissions ? ruleLabels.admissions[i] : ruleLabels.discipline[topic.source[i]],
  sourceIds: topic.admissions ? [`admissions:${i + 1}`] : topic.source[i] === 19 ? ['discipline:20', 'discipline:25'] : [`discipline:${topic.source[i] + 1}`],
})) }));

export const uniformGroups = content.rules.slice(2).map((group, index) => ({ ...group, id: `uniform-${index + 1}`, index, gender: index < 3 ? 'girls' : 'boys', classes: [
  ['lkg', 'ukg', '1', '2', '3', '4', '5'], ['6', '7'], ['8', '9', '10', '11', '12'], ['lkg', 'ukg', '1', '2', '3', '4', '5', '6', '7'], ['8', '9', '10', '11', '12'],
][index] }));

export const peopleGroups = [
  { id: 'management', title: 'Management', label: 'School Management Committee · 2023–2024', records: content.committee },
  { id: 'administration', title: 'Administration', label: 'School leadership, departments & specialist roles', records: [...content.leaders, ...content.departments] },
  { id: 'non-teaching', title: 'Non-teaching staff', label: 'Our non-teaching team', records: content.staff },
].map(group => ({ ...group, records: group.records.map((record, index) => ({ ...record, id: `${group.id}-person-${String(index + 1).padStart(2, '0')}` })) }));

const roman = { i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6', vii: '7', viii: '8', ix: '9', x: '10', xi: '11', xii: '12' };
export function normalize(text) {
  return text.toLowerCase().normalize('NFKD').replace(/\bt\s*\.\s*c\.?/g, 'tc').replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().split(/\s+/).map(word => roman[word] || ({ classes: 'class', grade: 'class', grades: 'class', principals: 'principal', timings: 'hours', timing: 'hours' }[word]) || word).join(' ').replace(/\btc\b/g, 'transfer certificate');
}
export function queryWords(query) { return normalize(query).split(' ').filter(word => word && !['a', 'an', 'the', 'find', 'member', 'would', 'like', 'know'].includes(word)); }

export const searchIndex = [];
function entry(id, title, category, text, targetSection, state = {}, aliases = '') {
  searchIndex.push({ id, title, category, text, targetSection, state, aliases, searchable: normalize(`${title} ${category} ${text} ${aliases}`), normalizedTitle: normalize(title) });
}
content.milestones.forEach(([year, title, text], i) => entry(`milestone-${i + 1}`, `${year} · ${title}`, 'Our story', text, 'story', { timeline: i }));
content.story.forEach((section, i) => entry(`story-detail-${i + 1}`, section.title, 'Full school story', section.paragraphs.join(' '), 'story', { disclosure: 'full-story' }, i === 5 ? 'school hours school time opening closing 8:30 3:00 Science Commerce' : ''));
entry('motto', 'Keep Smiling', 'Motto', 'Keep Smiling', 'vision');
const visionMaterial = [
  ['vision-school', 'School With A Difference', content.vision.introduction.slice(0, 2)],
  ['vision-environment', 'School environment, gardening & culture', content.vision.introduction.slice(2)],
  ['vision-aims', 'Chinmaya Education Movement: aims & objectives', content.vision.aims],
  ['vision-programme', 'The Chinmaya Vision Programme', content.vision.programme],
];
export { visionMaterial };
visionMaterial.forEach(([id, title, paragraphs]) => entry(`${id}-text`, title, 'Our vision', paragraphs.join(' '), 'vision', { disclosure: id }));
content.vision.pillars.forEach((pillar, i) => {
  entry(`pillar-${i + 1}`, pillar.title, 'Chinmaya Vision Programme', pillar.intro, 'vision', { pillar: i });
  pillar.parts.forEach((part, j) => entry(`pillar-${i + 1}-part-${j + 1}`, part.title, pillar.title, part.text, 'vision', { pillar: i, disclosure: `pillar-more-${i + 1}` }));
});
entry('principal-letter', 'Principal’s message · Bini M', 'Principal', content.principal.join(' '), 'principal', { disclosure: 'principal-message' }, 'principal letter message Hari Om');
entry('school-day-text', 'School hours & senior secondary streams', 'Parent essentials', content.story[5].paragraphs.join(' '), 'rules', { disclosure: 'school-day' }, 'school hours opening closing school time timings');
entry('management-introduction', 'Trust & managing committee', 'Management', content.story[0].paragraphs[0], 'staff', { group: 'management', disclosure: 'people-directory' });
peopleGroups.forEach(group => group.records.forEach(record => entry(record.id, record.name, group.label, record.role, 'staff', { group: group.id, disclosure: 'people-directory' }, `${group.title} staff person department`)));
ruleTopics.forEach(topic => topic.rules.forEach(rule => entry(rule.id, rule.title, `Parent essentials · ${topic.title}`, rule.text, 'rules', { disclosure: `rules-${topic.id}` }, topic.admissions ? 'TC transfer certificate admissions withdrawal' : 'school rules guidelines')));
uniformGroups.forEach(group => entry(group.id, group.title.replace(':', '’ uniform —'), 'Uniform guide', group.items.join(' '), 'rules', { uniform: group.index }, group.classes.map(c => `class ${c} uniform ${group.gender}`).join(' ')));

export function findInformation(query) {
  const words = queryWords(query);
  if (!words.length) return [];
  const phrase = words.join(' ');
  return searchIndex.map((item, order) => {
    if (!words.every(word => /^\d+$/.test(word) ? item.searchable.split(' ').includes(word) : item.searchable.includes(word))) return null;
    const score = (item.normalizedTitle === phrase ? 100 : 0) + (item.normalizedTitle.includes(phrase) ? 40 : 0) + words.filter(word => item.normalizedTitle.includes(word)).length * 10 + (normalize(item.text).includes(phrase) ? 5 : 0);
    return { ...item, score, order };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.order - b.order);
}
export function matchingExcerpt(text, query) {
  const words = queryWords(query);
  const segments = text.split(/(?<=[.!?])\s+/);
  const segment = segments.find(s => words.some(word => normalize(s).includes(word))) || text;
  const term = words.find(word => segment.toLowerCase().includes(word));
  const at = term ? segment.toLowerCase().indexOf(term) : 0;
  let start = Math.max(0, at - 60);
  if (start > 0) start = segment.indexOf(' ', start) + 1;
  return `${start ? '…' : ''}${segment.slice(start, start + 190)}${segment.length > start + 190 ? '…' : ''}`;
}

export const detailTargets = Object.fromEntries(searchIndex.map(item => [item.id, item]));
// Existing navbar URLs remain valid after combining the people chapters.
Object.assign(detailTargets, {
  management: { id: 'management', state: { group: 'management', disclosure: 'people-directory' } },
  administration: { id: 'administration', state: { group: 'administration', disclosure: 'people-directory' } },
  'non-teaching': { id: 'non-teaching', state: { group: 'non-teaching', disclosure: 'people-directory' } },
});
content.vision.pillars.forEach((_, index) => {
  detailTargets[`pillar-more-${index + 1}`] = { id: `pillar-more-${index + 1}`, state: { pillar: index } };
});
uniformGroups.forEach(selection => selection.items.forEach((_, index) => {
  const id = `${selection.id}-instruction-${index + 1}`;
  detailTargets[id] = { id, state: { uniform: selection.index } };
}));
