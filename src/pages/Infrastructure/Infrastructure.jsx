import PhotoLightbox from '../../components/media/PhotoLightbox';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { campusLocations, findCampusSpaces, locationFromHash } from '../../content/infrastructure';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import campus from '../../assets/images/hero/campus.jpeg';
import './Infrastructure.css';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function SpaceIcon() {
  return <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 65h56M18 65V32l22-15 22 15v33M12 32l28-19 28 19M31 65V46h18v19M26 34h5v5h-5zm23 0h5v5h-5z" /></svg>;
}

function MissingPhoto({ compact = false }) {
  return <span className={`infra-missing${compact ? ' infra-missing--compact' : ''}`}><SpaceIcon /><span>{compact ? 'Residence & welfare' : 'Chinmaya Saket'}</span>{!compact && <small>Photograph not available in the school archive.</small>}</span>;
}

function Description({ place, onAuditorium, print = false }) {
  return <>
    {place.description.map((text, index) => <p key={index}>{text}</p>)}
    {place.highlights.length > 0 && <ul className="infra-highlights" aria-label="Building highlights">{place.highlights.map((text, index) => <li key={text} style={{ '--highlight-delay': `${index * 35}ms` }}>{text}</li>)}</ul>}
    {place.sublocations.map(item => <section className="infra-sublocation" key={item.id} aria-labelledby={print ? undefined : item.id}>
      <p className="infra-kicker">Within Main Block</p>
      <h3 id={print ? undefined : item.id} tabIndex={print ? undefined : -1}>{item.name}</h3>
      {item.description.map(text => <p key={text}>{text}</p>)}
      {onAuditorium && <button type="button" className="infra-text-button" onClick={() => onAuditorium(item.photoIndex)}>View auditorium photograph <span aria-hidden="true">↗</span></button>}
    </section>)}
  </>;
}


export default function Infrastructure() {
  const initial = locationFromHash(window.location.hash) || campusLocations.find(place => place.id === 'main-block');
  const [selectedId, setSelectedId] = useState(initial.id);
  const [photoIndex, setPhotoIndex] = useState(initial.sublocations.some(item => `#${item.id}` === window.location.hash) ? 1 : 0);
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const page = useRef(null);
  const transition = useRef(null);
  const requestedSelection = useRef(initial.id);
  const selectionVersion = useRef(0);
  const selected = campusLocations.find(place => place.id === selectedId);
  const selectedIndex = campusLocations.indexOf(selected);
  const currentPhoto = selected.photos[photoIndex];
  const filtered = findCampusSpaces(query);

  const selectPlace = useCallback((place, { updateUrl = true, focus = true, hash = place.slug, animate = true } = {}) => {
    transition.current?.skipTransition();
    requestedSelection.current = place.id;
    const version = ++selectionVersion.current;
    const commit = () => {
      if (version !== selectionVersion.current) return;
      setSelectedId(place.id);
      setPhotoIndex(place.sublocations.some(item => item.id === hash) ? 1 : 0);
      setPending({ target: hash === 'tapovan-maharaj-auditorium' ? hash : 'infra-detail-title', focus, smooth: animate });
      if (updateUrl && window.location.hash !== `#${hash}`) window.history.pushState(null, '', `#${hash}`);
    };
    if (document.startViewTransition && animate && !prefersReducedMotion()) {
      transition.current = document.startViewTransition(() => flushSync(commit));
      // Repeated selections intentionally cancel snapshots; the latest content still commits.
      transition.current.ready.catch(() => {});
    } else commit();
  }, [setSelectedId, setPhotoIndex, setPending]);

  useEffect(() => {
    const syncHash = () => {
      const place = locationFromHash(window.location.hash);
      if (place) selectPlace(place, { updateUrl: false, hash: window.location.hash.slice(1), animate: false, focus: false });
      else if (!window.location.hash) {
        transition.current?.skipTransition();
        selectionVersion.current += 1;
        requestedSelection.current = 'main-block';
        setSelectedId('main-block');
        setPhotoIndex(0);
        setPending({ target: 'main', focus: false, smooth: false });
      }
    };
    if (locationFromHash(window.location.hash)) syncHash();
    window.addEventListener('popstate', syncHash);
    window.addEventListener('hashchange', syncHash);
    return () => { window.removeEventListener('popstate', syncHash); window.removeEventListener('hashchange', syncHash); transition.current?.skipTransition(); };
  }, [selectPlace]);

  useLayoutEffect(() => {
    const inner = document.querySelector('.navbar__inner');
    const root = page.current;
    const updateOffset = () => root.style.setProperty('--infra-header-offset', `${Math.max(110, inner.getBoundingClientRect().height + 28)}px`);
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!pending) return;
    let second;
    const frame = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      const target = document.getElementById(pending.target);
      if (!target) return;
      if (pending.focus) target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'start', behavior: pending.smooth && !prefersReducedMotion() ? 'smooth' : 'instant' });
    }); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(second); };
  }, [pending]);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;
    const elements = page.current.querySelectorAll('[data-infra-reveal]');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('infra-awaiting');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.05 });
    elements.forEach(element => { element.classList.add('infra-awaiting'); observer.observe(element); });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('infra-awaiting')); };
  }, [query]);

  function returnToOverview() {
    setPending({ target: 'campus-overview-title', focus: true, smooth: true });
  }

  function stepPlace(direction) {
    const index = campusLocations.findIndex(place => place.id === requestedSelection.current);
    selectPlace(campusLocations[(index + direction + campusLocations.length) % campusLocations.length]);
  }

  return <main id="main" className="infra-page" ref={page}>
    <div className="infra-shell">
      <nav className="infra-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Incampus</span><span aria-hidden="true">/</span><span aria-current="page">Infrastructure</span></nav>
      <section className="infra-intro" aria-labelledby="infra-title">
        <div className="infra-intro__copy"><p className="eyebrow">Our campus</p><h1 id="infra-title"><span>Spaces for learning.</span><span>Room to <em>grow.</em></span></h1><p>From a tortoise-shaped nursery to spaces for learning, reflection and a home away from home, explore the places that make up Chinmaya Vidyalaya, Kolazhy.</p><a className="button button--primary" href="#campus-overview">Explore the campus <span aria-hidden="true">↓</span></a></div>
        <figure className="infra-intro__photo"><img src={campus} width="1280" height="963" alt="Tree-lined courtyard and school buildings at Chinmaya Vidyalaya, Kolazhy" fetchPriority="high" /><figcaption>Chinmaya Gardens · Kolazhy, Thrissur</figcaption><span className="infra-intro__label" aria-hidden="true">A place to<br /><em>belong.</em></span></figure>
      </section>
      <section className="infra-overview" id="campus-overview" aria-labelledby="campus-overview-title">
        <div className="infra-section-heading"><div><p className="eyebrow">Nine places. One Vidyalaya.</p><h2 id="campus-overview-title" tabIndex={-1}>Explore our campus.</h2></div><p>Choose a place to take a closer look.</p></div>
        <div className="infra-search"><div className="infra-search__input"><label htmlFor="campus-space-search">Find a campus space</label><div><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg><input id="campus-space-search" type="search" value={query} placeholder="Try KG, hostel or auditorium" onChange={event => setQuery(event.target.value)} autoComplete="off" />{query && <button type="button" onClick={() => { setQuery(''); document.getElementById('campus-space-search').focus(); }}>Clear</button>}</div></div><p role="status" aria-live="polite" aria-atomic="true">{filtered.length} of {campusLocations.length} places</p></div>
        <div className={`infra-grid${query.trim() ? ' infra-grid--filtered' : ''}`}>
          {filtered.map((place, index) => <button type="button" key={place.id} className={`infra-tile${['kg-block', 'main-block'].includes(place.id) ? ' infra-tile--featured' : ''}${selectedId === place.id ? ' is-selected' : ''}`} aria-pressed={selectedId === place.id} aria-controls="campus-explorer" onClick={() => selectPlace(place)} data-infra-reveal style={{ '--tile-delay': `${index % 4 * 55}ms` }}>
            <span className="infra-tile__image">{place.photos.length ? <img src={place.photos[0].src} width={place.photos[0].width} height={place.photos[0].height} alt={place.photos[0].alt} loading="lazy" /> : <MissingPhoto compact />}{selectedId === place.id && <span className="infra-tile__selected">Selected</span>}</span>
            <span className="infra-tile__text"><span className="infra-kicker">{place.subtitle}</span><span className="infra-tile__name">{place.name}</span><span className="infra-tile__arrow" aria-hidden="true">↗</span></span>
          </button>)}
        </div>
        {filtered.length === 0 && <div className="infra-empty"><SpaceIcon /><h3>No matching campus spaces</h3><p>Try a building name, “guest house” or “temple”.</p><button className="infra-text-button" type="button" onClick={() => { setQuery(''); document.getElementById('campus-space-search').focus(); }}>Show all nine places</button></div>}
      </section>
      <section className="infra-explorer" id="campus-explorer" aria-labelledby="infra-explorer-label">
        <div className="infra-explorer__heading"><p className="eyebrow" id="infra-explorer-label">A closer look</p><button type="button" className="infra-text-button" onClick={returnToOverview}>Choose another place <span aria-hidden="true">↑</span></button></div>
        <div className="infra-explorer__composition" key={selected.id}>
          <div className="infra-explorer__visual">
            {currentPhoto ? <><figure className="infra-detail-photo"><button type="button" className="infra-enlarge" aria-label={`Enlarge photograph: ${currentPhoto.caption}`} aria-haspopup="dialog" onClick={event => setLightbox({ returnTo: event.currentTarget })}><img key={currentPhoto.src} src={currentPhoto.src} width={currentPhoto.width} height={currentPhoto.height} alt={currentPhoto.alt} loading={selected.id === 'main-block' ? 'eager' : 'lazy'} /><span className="infra-enlarge__label" aria-hidden="true">Enlarge photograph <span>↗</span></span></button><figcaption>{currentPhoto.caption}</figcaption></figure>{selected.photos.length > 1 && <div className="infra-thumbnails" aria-label="Choose a photograph">{selected.photos.map((item, index) => <button type="button" key={item.src} aria-label={item.caption} aria-pressed={index === photoIndex} onClick={() => setPhotoIndex(index)}><img src={item.src} width={item.width} height={item.height} alt="" loading="lazy" /><span>{index === 0 ? 'Building' : selected.id === 'main-block' ? 'Auditorium' : 'Car parking'}</span></button>)}</div>}</> : <MissingPhoto />}
          </div>
          <article className="infra-explorer__copy"><p className="infra-kicker">{selected.category} <span aria-hidden="true">/</span> {selected.subtitle}</p><h2 id="infra-detail-title" tabIndex={-1}>{selected.name}{selected.id === 'kg-block' && <span>KG Block</span>}</h2><Description place={selected} onAuditorium={index => setPhotoIndex(index)} /></article>
        </div>
        <div className="infra-explorer__nav"><button type="button" onClick={() => stepPlace(-1)} aria-label="Previous campus location"><span aria-hidden="true">←</span> Previous place</button><p aria-live="polite" aria-atomic="true"><strong>{String(selectedIndex + 1).padStart(2, '0')}</strong><span aria-hidden="true"> / </span><span className="infra-sr-only">of </span>09<span className="infra-sr-only">: {selected.name} selected</span></p><button type="button" onClick={() => stepPlace(1)} aria-label="Next campus location">Next place <span aria-hidden="true">→</span></button></div>
        <p className="infra-source-note">Descriptions and photographs are from the school’s published campus material. Please contact the school for current details.</p>
      </section>
      <section className="infra-invitation" aria-labelledby="infra-invitation-title"><div><p className="eyebrow">Your next chapter</p><h2 id="infra-invitation-title">Make room for<br /><em>a brighter beginning.</em></h2><p>Speak to us about admissions at Chinmaya Vidyalaya.</p></div><EnquiryButton className="button button--primary">Enquire Now <span aria-hidden="true">↗</span></EnquiryButton></section>
      <section className="infra-print" aria-label="Complete campus infrastructure"><h2>Campus infrastructure</h2><p>Descriptions and photographs are from the school’s published campus material. Please contact the school for current details.</p>{campusLocations.map(place => <article key={place.id}><h3>{place.name} — {place.subtitle}</h3><Description place={place} print />{place.photos.map(item => <figure key={item.src}><img src={item.src} width={item.width} height={item.height} alt={item.alt} /><figcaption>{item.caption}</figcaption></figure>)}</article>)}</section>
    </div>
    {lightbox && <PhotoLightbox title={selected.name} photos={selected.photos} index={photoIndex} onChange={setPhotoIndex} onClose={() => setLightbox(null)} returnTo={lightbox.returnTo} />}
  </main>;
}
