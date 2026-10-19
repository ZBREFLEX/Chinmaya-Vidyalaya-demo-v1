import content from './academics.json' with { type: 'json' };

export { content };
export const streams = ['Science', 'Commerce', 'Humanities'];
export const categories = [
  { id: 'class-x', label: 'AISSE · Class X' },
  { id: 'science', label: 'AISSCE · Class XII Science' },
  { id: 'commerce', label: 'Class XII Commerce' },
  { id: 'humanities', label: 'Class XII Humanities' },
];
export const academicSections = [
  ['curriculum', 'Curriculum'], ['subject-combinations', 'Subject Combinations - Senior Secondary'],
  ['question-papers', 'Previous Year Question Papers'], ['assessment', 'Uniform System of Assessment'],
  ['training-programmes', 'Training Programmes'], ['results', 'Results Archive'],
];
export const defaultState = { stream: 'Science', subject: '', class: '', paperStream: '', paperYear: '2021-2022', category: 'class-x', year: '', name: '', limit: 8 };
export function readAcademicState(search) {
  const params = new URLSearchParams(search);
  const state = { ...defaultState };
  for (const key of Object.keys(state)) if (params.has(key)) state[key] = params.get(key);
  if (!streams.includes(state.stream)) state.stream = defaultState.stream;
  if (state.subject === 'Economics Psychology' || !content.combinations.some(c => c.subjects.includes(state.subject))) state.subject = '';
  if (!content.resources.some(r => r.class === state.class)) state.class = '';
  if (!['', 'Science', 'Commerce'].includes(state.paperStream)) state.paperStream = '';
  state.paperYear = '2021-2022';
  if (!categories.some(c => c.id === state.category)) state.category = defaultState.category;
  if (!content.results.some(r => r.category === state.category && r.year === state.year)) state.year = '';
  state.limit = Math.min(content.results.length, Math.max(8, Number.parseInt(state.limit, 10) || 8));
  return state;
}
export function academicQuery(state) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) if (value !== defaultState[key] && value !== '') params.set(key, value);
  return params.size ? `?${params}` : '';
}
export function matchingResults(state) {
  return content.results.filter(r => r.category === state.category && (!state.year || r.year === state.year) && r.name.toLowerCase().includes(state.name.trim().toLowerCase()));
}
