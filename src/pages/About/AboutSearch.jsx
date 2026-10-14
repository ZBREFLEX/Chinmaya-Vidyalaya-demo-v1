import { useEffect, useId, useState } from 'react';
import { findInformation, matchingExcerpt, normalize, queryWords } from '../../content/aboutModel';

const suggestions = [['Class VI uniform', 'class 6 uniform'], ['Principal’s message', 'principal message'], ['Transfer certificate', 'TC'], ['School hours', 'school hours'], ['Find a staff member', 'staff']];
export function Highlight({ text, query }) {
  const words = queryWords(query);
  return text.split(/([\p{L}\p{N}]+)/gu).map((part, index) => words.some(word => /^\d+$/.test(word) ? normalize(part) === word : normalize(part).includes(word)) ? <mark key={index}>{part}</mark> : part);
}
export default function AboutSearch({ onNavigate, autoFocus = false, dialog = false }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(8);
  const id = useId();
  const results = findInformation(query);
  const [announcement, setAnnouncement] = useState('Search across our story, people and parent essentials.');
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(query.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query}”` : 'Search across our story, people and parent essentials.'), 200);
    return () => window.clearTimeout(timer);
  }, [query, results.length]);
  const updateQuery = value => { setQuery(value); setLimit(8); };
  return <div className="about-search">
    <form role="search" onSubmit={event => event.preventDefault()}>
      <label htmlFor={id}>{dialog ? 'Search the school story' : 'What would you like to know?'}</label>
      <div className="search-input-row"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input id={id} type="search" value={query} onChange={event => updateQuery(event.target.value)} autoFocus={autoFocus} placeholder="Search names, uniform, school hours, rules…" /><button type="button" onClick={() => updateQuery('')} disabled={!query}>Clear search</button></div>
    </form>
    <div className="search-suggestions" aria-label="Suggested searches">{suggestions.map(([label, value]) => <button key={label} type="button" onClick={() => updateQuery(value)}>{label}<span aria-hidden="true">↗</span></button>)}</div>
    <p className="search-announcement" role="status">{announcement}</p>
    {query.trim() && <div className="search-results">{results.length ? <><ul>{results.slice(0, limit).map(result => <li key={result.id}><span className="result-category">{result.category}</span><h3><Highlight text={result.title} query={query} /></h3><p><Highlight text={matchingExcerpt(result.text, query)} query={query} /></p><button type="button" className="about-link-button" onClick={() => onNavigate(result.id)}>{result.state.uniform !== undefined ? 'View instructions' : 'View information'}<span aria-hidden="true">→</span><span className="sr-only">: {result.title}</span></button></li>)}</ul>{results.length > limit && <button className="button button--outline search-more" type="button" onClick={() => setLimit(current => current + 8)}>Show more results</button>}</> : <p className="search-empty">No matching information. Try a name, “uniform”, “school hours” or “transfer certificate”, or clear your search.</p>}</div>}
  </div>;
}
