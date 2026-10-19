import stories from './campusLife.json' with { type: 'json' };
export { lifeSections } from './lifeNavigation.js';

export { stories };
export const lifeCategories = ['Service to Society', 'Celebrations', 'Observations', 'Competitions', 'Co-Scholastic', 'Houses & Clubs', 'Scouts & Guides', 'Cubs & Bulbuls', 'Event Gallery'];
export const lifeYears = [...new Set(stories.flatMap(s => s.years))].sort((a, b) => b.localeCompare(a));
export const lifeById = Object.fromEntries(stories.flatMap(s => [s.id, s.slug, ...s.aliases].map(id => [id, s])));
export const munWebsite = 'https://chinmayavidyalaya.org/cvmun/index.html';
export const lifeThemes = [
  { id: 'culture', label: 'Culture & Participation', title: 'A shared stage. A thousand expressions.', description: 'Celebrations, observances, performances and competitions bring students together through creative expression.', story: '1-03', photo: 0 },
  { id: 'leadership', label: 'Clubs & Leadership', title: 'Small beginnings. Growing confidence.', description: 'Reading, club projects and student-led activities make room for curiosity, initiative and learning together.', story: '5-04', photo: 1 },
  { id: 'service', label: 'Service & Community', title: 'Learning to care, by taking part.', description: 'The school archives record sharing initiatives, outreach and environmental projects that connect learning with the wider community.', story: '0-03', photo: 1 },
];
export const lifeDefaults = { q: '', category: '', year: '', theme: '', limit: 6, story: '', gq: '', media: '', gyear: '', glimit: 6 };
export function readLifeState(search) {
  const params = new URLSearchParams(search);
  const state = { ...lifeDefaults };
  for (const key of Object.keys(state)) if (params.has(key)) state[key] = params.get(key);
  if (!lifeCategories.includes(state.category)) state.category = '';
  if (![...lifeYears, 'unknown'].includes(state.year)) state.year = '';
  if (!lifeThemes.some(t => t.id === state.theme)) state.theme = '';
  state.limit = Math.min(stories.length, Math.max(6, Number.parseInt(state.limit, 10) || 6));
  state.story = lifeById[state.story]?.slug || '';
  if (!['', 'photos', 'videos'].includes(state.media)) state.media = '';
  if (![...lifeYears, 'unknown'].includes(state.gyear)) state.gyear = '';
  state.glimit = Math.min(stories.length, Math.max(6, parseInt(state.glimit, 10) || 6));
  return state;
}
export const galleryStories = stories.filter(s => s.gallery && (s.images.length || s.videos?.length));
export function findGalleryStories(state) {
  const words = state.gq.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return galleryStories.filter(s => (!state.media || (state.media === 'photos' ? s.images.length : s.videos?.length)) && (!state.gyear || (state.gyear === 'unknown' ? !s.years.length : s.years.includes(state.gyear))) && words.every(w => searchable.get(s.id).includes(w)));
}
export function lifeQuery(state) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) if (value !== '' && value !== lifeDefaults[key]) params.set(key, value);
  return params.size ? `?${params}` : '';
}
export function lifeUrl(state, hash = '#campus-stories') { return `/campus-life${lifeQuery(state)}${hash}`; }
// Repair punctuation encoding for display only; original reports remain intact.
export { readableLifeText } from './archiveText.js';
const searchable = new Map(stories.map(s => [s.id, [s.title, s.originalTitle, ...s.body, ...s.categories, ...s.aliases, s.dateText, ...s.images.map(im => im.caption), /model united/i.test(s.title) ? 'MUN CVMUN diplomacy' : '', /sahodya|aavishkar|avishkar/i.test(s.title) ? 'science exhibition' : ''].join(' ').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()]));
const openingOrder = ['1-03', '1-07', '0-03', '5-01', '3-02', '4-08'];
export function findLifeStories(state) {
  const words = state.q.trim().normalize('NFKD').toLowerCase().split(/\s+/).filter(Boolean);
  return stories.filter(s => (!state.category || s.categories.includes(state.category)) && (!state.theme || s.themes.includes(state.theme)) && (!state.year || (state.year === 'unknown' ? !s.years.length : s.years.includes(state.year))) && words.every(word => searchable.get(s.id).includes(word))).sort((a, b) => {
    const rank = s => openingOrder.includes(s.id) ? openingOrder.indexOf(s.id) : openingOrder.length + stories.indexOf(s);
    return rank(a) - rank(b);
  });
}
