import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { stories, lifeCategories, lifeYears, lifeById, lifeThemes, lifeDefaults, readLifeState, lifeUrl, findLifeStories, munWebsite, readableLifeText } from '../../content/campusLifeModel';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import CampusStoryReader from './CampusStoryReader';
import useLifeMotion from './useLifeMotion';
import EventGallery from './EventGallery';
import './CampusLife.css';

function ArchiveImage({ photo, eager = false, className = '' }) {
  return <img className={className} src={photo.preview} srcSet={`${photo.thumbnail} ${photo.thumbnailWidth}w, ${photo.preview} ${photo.previewWidth}w`} sizes="(max-width: 700px) 92vw, (max-width: 1000px) 45vw, 540px" width={photo.width} height={photo.height} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} />;
}

export default function CampusLife() {
  const [state, setState] = useState(() => readLifeState(window.location.search));
  const root = useRef(null);
  const [returnTarget, setReturnTarget] = useState(null);
  const activeStory = useRef(state.story);
  useEffect(() => { activeStory.current = state.story; }, [state.story]);
  const frames = useRef([]);
  const grid = useRef(null);
  const previousFilter = useRef(`${state.category}|${state.year}|${state.theme}`);
  useLifeMotion(root);
  const selectedStory = lifeById[state.story];
  const results = findLifeStories(state);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => setAnnouncement(`${results.length} matching ${results.length === 1 ? 'story' : 'stories'}. Showing ${Math.min(state.limit, results.length)}.`), 250);
    return () => clearTimeout(timeout);
  }, [results.length, state.limit]);

  const scrollSection = (hash, explicit = false) => {
    frames.current.forEach(cancelAnimationFrame);
    frames.current = [requestAnimationFrame(() => frames.current.push(requestAnimationFrame(() => {
      const target = hash ? document.getElementById(hash.replace(/^#/, '')) : root.current;
      if (!target) return;
      if (explicit) target.focus({ preventScroll: true });
      const behavior = explicit && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant';
      if (hash) target.scrollIntoView({ block: 'start', behavior });
      else window.scrollTo({ top: 0, behavior });
    })))];
  };

  const update = (patch, replace = false, hash = '#campus-stories') => {
    const next = { ...state, ...patch };
    const url = lifeUrl(next, hash);
    if (url !== `${location.pathname}${location.search}${location.hash}`) history[replace ? 'replaceState' : 'pushState'](null, '', url);
    setState(next);
  };
  const closeReader = () => {
    if (history.state?.campusLifeReader) history.back();
    else update({ story: '' }, true);
  };

  useLayoutEffect(() => {
    const header = document.querySelector('.navbar__inner');
    const updateOffset = () => root.current?.style.setProperty('--life-offset', `${Math.max(115, header.getBoundingClientRect().height + 28)}px`);
    updateOffset();
    if (typeof ResizeObserver !== 'function') { window.addEventListener('resize', updateOffset); return () => window.removeEventListener('resize', updateOffset); }
    const observer = new ResizeObserver(updateOffset); observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    // A directly shared reader gets a local overview entry so Back closes it.
    const entry = readLifeState(location.search);
    if (entry.story && !history.state?.campusLifeReader) {
      const destination = `${location.pathname}${location.search}${location.hash}`;
      history.replaceState(null, '', lifeUrl({ ...entry, story: '' }, location.hash));
      history.pushState({ campusLifeReader: true }, '', destination);
    }
    const restore = () => {
      const next = readLifeState(location.search);
      const closingStory = activeStory.current && !next.story;
      setState(next);
      if (!next.story && !closingStory) scrollSection(location.hash);
    };
    const follow = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/^\/campus-life\/?$/.test(url.pathname)) return;
      event.preventDefault();
      const next = readLifeState(url.search);
      if (next.story && !anchor.closest('.campus-reader')) setReturnTarget(anchor);
      const destination = `${url.pathname}${url.search}${url.hash}`;
      if (destination !== `${location.pathname}${location.search}${location.hash}`) history.pushState(next.story ? { campusLifeReader: true } : null, '', destination);
      setState(next);
      if (!next.story) scrollSection(url.hash, true);
    };
    restore();
    document.addEventListener('click', follow, true); window.addEventListener('popstate', restore); window.addEventListener('hashchange', restore);
    return () => { history.scrollRestoration = oldRestoration; frames.current.forEach(cancelAnimationFrame); document.removeEventListener('click', follow, true); window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore); };
  }, []);

  const filterKey = `${state.category}|${state.year}|${state.theme}`;
  useEffect(() => {
    let animation;
    if (previousFilter.current !== filterKey && !matchMedia('(prefers-reduced-motion: reduce)').matches && grid.current?.animate) {
      try { animation = grid.current.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 170 }); } catch { /* Filtering is immediate without animation. */ }
    }
    previousFilter.current = filterKey;
    const cancel = () => animation?.cancel();
    const preference = matchMedia('(prefers-reduced-motion: reduce)'); preference.addEventListener('change', cancel); window.addEventListener('beforeprint', cancel);
    return () => { cancel(); preference.removeEventListener('change', cancel); window.removeEventListener('beforeprint', cancel); };
  }, [filterKey]);

  const storyHref = story => lifeUrl({ ...state, story: story.slug });
  const themeHref = theme => lifeUrl({ ...lifeDefaults, theme });
  const groupStories = ['6-01', '7-01'].map(id => lifeById[id]);
  const heroPhotos = [lifeById['1-03'].images[0], lifeById['5-05'].images[0], lifeById['0-03'].images[1]];
  const activeFilters = [state.q && `Search: ${state.q}`, state.category, state.year === 'unknown' ? 'Year not recorded' : state.year, lifeThemes.find(t => t.id === state.theme)?.label].filter(Boolean);

  return <>
    <main id="main" className="campus-life-page" ref={root} tabIndex={-1}>
      <header className="life-opening life-shell">
        <nav className="life-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Campus Life</span></nav>
        <div className="life-opening__grid"><div className="life-opening__copy"><p className="eyebrow">Campus Life</p><h1 tabIndex={-1}><span data-life-reveal>More than lessons.</span><span data-life-reveal data-life-delay="70"><em>Moments that<br />shape us.</em></span></h1><p>Celebrating together. Finding a voice. Reaching out to others. Discover the experiences recorded in Chinmaya Vidyalaya’s school archives.</p><div className="life-opening__actions"><a className="life-text-link" href="#event-gallery">Explore the event gallery</a><a className="button button--primary" href="#campus-stories">Explore campus stories <span aria-hidden="true">↓</span></a><a className="life-text-link" href="#student-groups">Discover student groups ↘</a></div></div>
          <div className="life-opening__photos">{heroPhotos.map((photo, i) => <figure key={photo.id} data-life-reveal data-life-delay={100 + i * 70}><ArchiveImage photo={photo} eager /><figcaption>{['Culture & celebration', 'Learning by doing', 'Sharing with the community'][i]}</figcaption></figure>)}<p>From the school archives · photographs from different occasions</p></div>
        </div>
      </header>

      <section id="life-themes" className="life-themes life-shell" tabIndex={-1} aria-label="Discover campus life">
        {lifeThemes.map((theme, i) => { const story = lifeById[theme.story]; return <article className={`life-theme life-theme--${theme.id}`} key={theme.id}>
          <div className="life-theme__copy" data-life-reveal><p className="eyebrow">0{i + 1} / {theme.label}</p><h2>{theme.title}</h2><p>{theme.description}</p><a className="life-text-link" href={themeHref(theme.id)}>Explore {theme.label.toLowerCase()} stories <span aria-hidden="true">↗</span></a></div>
          <figure className="life-theme__photo" data-life-reveal data-life-delay="70"><a href={storyHref(story)} aria-label={`Read story: ${story.title}`}><ArchiveImage photo={story.images[theme.photo]} /><span className="life-photo-action" aria-hidden="true">Read story ↗</span></a><figcaption><span>{story.dateText}</span><a href={storyHref(story)}>{story.title}</a></figcaption></figure>
        </article>; })}
      </section>

      <section id="student-groups" className="life-groups" tabIndex={-1} aria-labelledby="life-groups-title"><div className="life-shell">
        <div className="life-section-heading"><p className="eyebrow">Belonging & participation</p><h2 id="life-groups-title">Learning to lead.<br />Learning together.</h2><p>Meet the student groups described in the school archives, and explore the activities they recorded.</p></div>
        <div className="life-group-grid">{groupStories.map(story => <article className="life-group" key={story.id}><a href={storyHref(story)} className="life-group__photo" data-life-reveal><ArchiveImage photo={story.images[0]} /><span className="life-photo-action">View all {story.images.length} photographs ↗</span></a><h3>{story.title}</h3><p>{story.body[0]}</p><a className="life-text-link" href={storyHref(story)}>Explore {story.title} <span aria-hidden="true">↗</span></a></article>)}</div>
        <div className="life-clubs-note"><div><p className="eyebrow">Houses & Clubs</p><h3>Ideas that turn into action.</h3><p>Seed chocolates, an Honest Shop, reading, food and gardening: explore the projects recorded under Houses & Clubs.</p></div><a className="button button--outline" href={lifeUrl({ ...lifeDefaults, category: 'Houses & Clubs' })}>Explore club projects <span aria-hidden="true">↗</span></a></div>
      </div></section>

      <section id="cvmun" className="life-mun life-shell" tabIndex={-1} aria-labelledby="life-mun-title">
        <figure className="life-mun__photo" data-life-reveal><a href={storyHref(lifeById['4-08'])} aria-label="Read the historical MUN story"><ArchiveImage photo={lifeById['4-08'].images[0]} /></a><figcaption>From the 2017 MUN report · school archives</figcaption></figure>
        <div><p className="eyebrow">Think beyond borders</p><h2 id="life-mun-title">CV Model<br />United Nations</h2><p>Step into international affairs through diplomacy, public speaking and teamwork. CVMUN introduces students to the perspectives of countries and the work of simulated United Nations committees.</p><a className="button button--primary" href={munWebsite} target="_blank" rel="noopener noreferrer">Visit the CVMUN website <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><a className="life-text-link life-mun__archive" href={storyHref(lifeById['4-08'])}>Read the 12–13 November 2017 MUN report ↗</a></div>
      </section>

      <section id="campus-stories" className="life-archive" tabIndex={-1} aria-labelledby="life-archive-title"><div className="life-shell">
        <div className="life-section-heading"><p className="eyebrow">From the school archives</p><h2 id="life-archive-title">Explore campus stories</h2><p>A collection of recorded activities from different years. Open a story for its complete report and all supplied photographs.</p></div>
        <div className="life-filters"><label htmlFor="life-search">Search the archives<input id="life-search" type="search" placeholder="Try Onam, Oru Pidi Ari, MUN…" value={state.q} onChange={e => update({ q: e.target.value, limit: 6 }, true)} /></label><div><label htmlFor="life-category">Category</label><select id="life-category" value={state.category} onChange={e => update({ category: e.target.value, limit: 6 })}><option value="">All categories</option>{lifeCategories.map(c => <option key={c}>{c}</option>)}</select></div><div><label htmlFor="life-year">Year</label><select id="life-year" value={state.year} onChange={e => update({ year: e.target.value, limit: 6 })}><option value="">All years</option>{lifeYears.map(y => <option key={y}>{y}</option>)}<option value="unknown">Year not recorded</option></select></div><button className="life-reset" onClick={() => update({ ...lifeDefaults })}>Clear filters</button></div>
        <div className="life-results-bar"><p>{results.length} {results.length === 1 ? 'story' : 'stories'} <span>· Showing {Math.min(state.limit, results.length)}</span></p><span className="sr-only" role="status">{announcement}</span>{activeFilters.length > 0 && <div aria-label="Active filters">{activeFilters.map(filter => <span key={filter}>{filter}</span>)}{state.theme && <button onClick={() => update({ theme: '', limit: 6 })}>Remove theme filter ×</button>}</div>}</div>
        <div className="life-story-grid" ref={grid}>{results.slice(0, state.limit).map(story => <article key={story.id} className={`life-story${!story.images.length ? ' life-story--text' : ''}`}>
          {story.images.length > 0 && <a className="life-story__photo" href={storyHref(story)} tabIndex={-1} aria-hidden="true"><ArchiveImage photo={story.images[0]} /></a>}
          <div className="life-story__copy"><p className="life-story__category">{story.categories.join(' / ')}</p><p className="life-story__date">{story.dateText}</p><h3><a href={storyHref(story)}>{story.title}</a></h3><p className="life-story__excerpt">{readableLifeText(story.excerpt)}</p><a className="life-text-link" href={storyHref(story)}>Read story <span aria-hidden="true">↗</span><span className="sr-only">: {story.title}</span></a></div>
        </article>)}</div>
        {!results.length && <div className="life-empty"><h3>No stories match these choices.</h3><p>Try a broader search, choose another year or clear the filters to explore the full collection.</p><button className="button button--outline" onClick={() => update({ ...lifeDefaults })}>Show all stories</button></div>}
        {results.length > state.limit && <button className="button button--outline life-show-more" onClick={() => update({ limit: Math.min(stories.length, state.limit + 6) })}>Show more stories <span aria-hidden="true">↓</span></button>}
        <p className="life-archive__note">Dates are shown as recorded. Some reports have no year, and some archived entries contain photographs or a heading only.</p>
        <div className="life-print-overview"><p>The complete collection contains {stories.length} stories, including Event Gallery. Visit /campus-life to search the archive and open full reports.</p><ul>{lifeCategories.map(category => { const count = stories.filter(s => s.categories.includes(category)).length; return <li key={category}>{category}: {count} {count === 1 ? 'record' : 'records'}</li>; })}</ul></div>
      </div></section>
      <EventGallery state={state} update={update} />
      <aside className="life-closing life-shell"><div><p className="eyebrow">A place to grow</p><h2>Every child brings<br />a new possibility.</h2><p>Discover more about learning and life at Chinmaya Vidyalaya.</p></div><EnquiryButton className="button button--primary">Enquire about admission <span aria-hidden="true">↗</span></EnquiryButton></aside>
    </main>
    {selectedStory && <CampusStoryReader key={selectedStory.id} story={selectedStory} onClose={closeReader} returnTo={returnTarget} />}
  </>;
}
