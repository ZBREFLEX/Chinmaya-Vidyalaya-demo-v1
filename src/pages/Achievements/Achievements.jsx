import { useEffect, useRef, useState } from 'react';
import { achievements, achievementCategories, achievementYears, achievementById, achievementDefaults, readAchievementState, achievementUrl, findAchievements, featuredAchievements } from '../../content/achievementsModel';
import CampusStoryReader from '../CampusLife/CampusStoryReader';
import useLifeMotion from '../CampusLife/useLifeMotion';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import '../CampusLife/CampusLife.css';
import './Achievements.css';

function RecognitionImage({ photo, eager = false }) {
  return <img src={photo.thumbnail} srcSet={`${photo.thumbnail} ${photo.thumbnailWidth}w, ${photo.preview} ${photo.previewWidth}w`} sizes="(max-width:700px) 90vw, 380px" width={photo.width} height={photo.height} loading={eager ? 'eager' : 'lazy'} alt={photo.alt} />;
}
export default function Achievements() {
  const root = useRef(null), grid = useRef(null), active = useRef('');
  const [state, setState] = useState(() => readAchievementState(location.search));
  const [returnTo, setReturnTo] = useState(null), [announcement, setAnnouncement] = useState('');
  useEffect(() => { active.current = state.achievement; }, [state.achievement]);
  useLifeMotion(root);
  const results = findAchievements(state), selected = achievementById[state.achievement];
  const href = achievement => achievementUrl({ ...state, achievement: achievement.slug });
  const update = (patch, replace = false) => {
    const next = { ...state, ...patch }; history[replace ? 'replaceState' : 'pushState'](null, '', achievementUrl(next)); setState(next);
  };
  const close = () => { if (history.state?.achievementReader) history.back(); else update({ achievement: '' }, true); };
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(`${results.length} matching achievements. Showing ${Math.min(state.limit, results.length)}.`), 250);
    return () => clearTimeout(timer);
  }, [results.length, state.limit]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !grid.current?.animate) return;
    let animation;
    try { animation = grid.current.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 170 }); } catch { /* Content stays visible. */ }
    return () => animation?.cancel();
  }, [state.category, state.year]);
  useEffect(() => {
    const previous = history.scrollRestoration; history.scrollRestoration = 'manual';
    let frame;
    const scroll = (hash, focus = false) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { const target = document.getElementById(hash.replace('#', ''));
        if (target) { if (focus) target.focus({ preventScroll: true }); target.scrollIntoView({ behavior: focus && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' }); }
      });
    };
    const entry = readAchievementState(location.search);
    if (entry.achievement && !history.state?.achievementReader) {
      const destination = location.href;
      history.replaceState(null, '', achievementUrl({ ...entry, achievement: '' }, location.hash)); history.pushState({ achievementReader: true }, '', destination);
    }
    const restore = () => {
      const next = readAchievementState(location.search), closing = active.current && !next.achievement;
      setState(next); if (!next.achievement && !closing) scroll(location.hash);
    };
    const follow = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]'); if (!anchor || anchor.target) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/^\/achievements\/?$/.test(url.pathname)) return;
      event.preventDefault(); const next = readAchievementState(url.search);
      if (next.achievement) setReturnTo(anchor);
      if (url.href !== location.href) history.pushState(next.achievement ? { achievementReader: true } : null, '', url);
      setState(next); if (!next.achievement) { if (url.hash) scroll(url.hash, true); else window.scrollTo({ top: 0, behavior: 'instant' }); }
    };
    restore(); document.addEventListener('click', follow, true); window.addEventListener('popstate', restore); window.addEventListener('hashchange', restore);
    return () => { cancelAnimationFrame(frame); history.scrollRestoration = previous; document.removeEventListener('click', follow, true); window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore); };
  }, []);
  return <><main id="main" className="achievements-page" ref={root} tabIndex={-1}>
    <header className="achievement-opening life-shell"><nav className="life-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Achievements</span></nav><p className="eyebrow" data-life-reveal>Achievements</p><h1 tabIndex={-1} data-life-reveal>Effort recognised.<br /><em>Possibilities expanded.</em></h1><div className="achievement-opening__bottom"><p>From academic milestones to the playing field and the stage, discover the students, teams and teachers recognised in our school archives.</p><a className="life-text-link" href="#browse-achievements">Browse the collection ↓</a></div></header>
    <section id="featured-recognition" className="recognition-featured life-shell" tabIndex={-1} aria-labelledby="recognition-title"><div className="recognition-section-title"><p className="eyebrow">A wall of recognition</p><h2 id="recognition-title">Dedication, in many forms.</h2></div><div className="recognition-featured__grid">{featuredAchievements.map((a, i) => {
      const photo = a.images.find(im => !im.poster) || a.images[0];
      return <article key={a.id} data-life-reveal data-life-delay={i * 65}><a className={`recognition-image${photo.poster ? ' recognition-image--poster' : ''}`} href={href(a)} tabIndex={-1} aria-hidden="true"><RecognitionImage photo={photo} eager={i === 0} /></a><p className="recognition-date">{a.dateText}</p><h3><a href={href(a)}>{a.title}</a></h3><p>{a.excerpt}</p><a className="life-text-link" href={href(a)}>View achievement ↗<span className="sr-only">: {a.title}</span></a></article>;
    })}</div></section>
    <section id="browse-achievements" className="recognition-browse" tabIndex={-1} aria-labelledby="browse-title"><div className="life-shell"><div className="recognition-section-title"><p className="eyebrow">Explore the archives</p><h2 id="browse-title">Every effort has a story.</h2><p>Search a name, competition or award. Dates and outcomes reflect the supplied records.</p></div>
      <div className="life-filters"><label htmlFor="achievement-search">Search achievements<input id="achievement-search" type="search" placeholder="Name, competition, award…" value={state.q} onChange={e => update({ q: e.target.value, limit: 6 }, true)} /></label><div><label htmlFor="achievement-category">Category</label><select id="achievement-category" value={state.category} onChange={e => update({ category: e.target.value, limit: 6 })}><option value="">All categories</option>{achievementCategories.map(c => <option key={c}>{c}</option>)}</select></div><div><label htmlFor="achievement-year">Year</label><select id="achievement-year" value={state.year} onChange={e => update({ year: e.target.value, limit: 6 })}><option value="">All years</option>{achievementYears.map(y => <option key={y}>{y}</option>)}<option value="unknown">Year not recorded</option></select></div><button className="life-reset" onClick={() => update({ ...achievementDefaults })}>Clear filters</button></div>
      <div className="life-results-bar"><p>{results.length} {results.length === 1 ? 'achievement' : 'achievements'} <span>· Showing {Math.min(state.limit, results.length)}</span></p><span role="status" className="sr-only">{announcement}</span></div>
      <div className="recognition-grid" ref={grid}>{results.slice(0, state.limit).map(a => <article className={`recognition-card${!a.images.length ? ' recognition-card--text' : ''}`} key={a.id}>{a.images.length > 0 && <a className={`recognition-image${a.images[0].poster ? ' recognition-image--poster' : ''}`} href={href(a)} tabIndex={-1} aria-hidden="true"><RecognitionImage photo={a.images[0]} /></a>}<div className="recognition-card__copy"><p className="recognition-category">{a.categories.join(' / ')}</p><p className="recognition-date">{a.dateText}</p><h3><a href={href(a)}>{a.title}</a></h3><p className="recognition-excerpt">{a.excerpt}</p><a className="life-text-link" href={href(a)}>View achievement ↗<span className="sr-only">: {a.title}</span></a></div></article>)}</div>
      {!results.length && <div className="life-empty"><h3>No achievements match these choices.</h3><p>Try a shorter search or another category or year.</p><button className="button button--outline" onClick={() => update({ ...achievementDefaults })}>Show all achievements</button></div>}
      {results.length > state.limit && <button className="button button--outline life-show-more" onClick={() => update({ limit: state.limit + 6 })}>Show more achievements ↓</button>}
      <p className="recognition-archive-note">This is a historical collection. Where a date or individual name cannot be confirmed, the original poster remains available without an inferred detail.</p><p className="recognition-print-summary">{achievements.length} achievement records. Browse the complete collection at /achievements.</p>
    </div></section>
    <aside className="life-closing life-shell"><div><p className="eyebrow">Growing with purpose</p><h2>Room to discover.<br />Confidence to grow.</h2><p>Explore learning and life at Chinmaya Vidyalaya.</p></div><EnquiryButton className="button button--primary">Enquire about admission ↗</EnquiryButton></aside>
  </main>{selected && <CampusStoryReader key={selected.id} story={selected} onClose={close} returnTo={returnTo} recordType="achievement" />}</>;
}
