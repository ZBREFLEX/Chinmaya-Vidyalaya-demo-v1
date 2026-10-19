import achievements from './achievements.json' with { type: 'json' };
export { achievements };
export const achievementCategories = ['Academic', 'Sports', 'Arts & Culture', 'Quiz & Competitions', 'School & Staff Recognition'];
export const achievementYears = [...new Set(achievements.flatMap(a => a.years))].sort((a, b) => b.localeCompare(a));
export const achievementById = Object.fromEntries(achievements.flatMap(a => [a.id, a.slug].map(id => [id, a])));
export const achievementDefaults = { q: '', category: '', year: '', limit: 6, achievement: '' };
export function readAchievementState(search) {
  const params = new URLSearchParams(search), state = { ...achievementDefaults };
  for (const key of Object.keys(state)) if (params.has(key)) state[key] = params.get(key);
  if (!achievementCategories.includes(state.category)) state.category = '';
  if (![...achievementYears, 'unknown'].includes(state.year)) state.year = '';
  state.limit = Math.min(achievements.length, Math.max(6, parseInt(state.limit, 10) || 6));
  state.achievement = achievementById[state.achievement]?.slug || '';
  return state;
}
export function achievementUrl(state, hash = '#browse-achievements') {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) if (value !== '' && value !== achievementDefaults[key]) params.set(key, value);
  return `/achievements${params.size ? `?${params}` : ''}${hash}`;
}
export function findAchievements(state) {
  const words = state.q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return achievements.filter(a => (!state.category || a.categories.includes(state.category)) && (!state.year || (state.year === 'unknown' ? !a.years.length : a.years.includes(state.year))) && words.every(w => [a.title, a.originalTitle, a.publicNote || '', ...a.body, a.dateText, ...a.categories].join(' ').toLowerCase().includes(w)));
}
export const featuredAchievements = ['a-15', 'a-37', 'a-49'].map(id => achievementById[id]);
