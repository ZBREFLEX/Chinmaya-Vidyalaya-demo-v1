import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { facilityById, facilityChapters, facilityTarget, laboratoryEntries } from '../../content/facilities';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import PhotoLightbox from '../../components/media/PhotoLightbox';
import { disclosureIsOpen, setDisclosureOpen } from '../About/aboutMotion';
import FacilityFinder from './FacilityFinder';
import './Facilities.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Prose({ facility }) { return facility.description.map(text => <p key={text}>{text}</p>); }

function FacilityPhoto({ photo, onOpen, eager = false, className = '', sizes = '(max-width: 700px) 90vw, (max-width: 1000px) 50vw, 680px' }) {
  return <figure className={`fac-photo ${className}`} data-facility-reveal="photo"><button type="button" aria-label={`Enlarge photograph: ${photo.caption}`} aria-haspopup="dialog" onClick={onOpen}><img src={photo.src} srcSet={`${photo.preview} 400w, ${photo.src} ${photo.width}w`} sizes={sizes} width={photo.width} height={photo.height} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} /><span className="fac-photo__enlarge" aria-hidden="true">Enlarge photograph <span>↗</span></span></button><figcaption>{photo.caption}</figcaption></figure>;
}

function ChapterHeading({ index }) {
  const chapter = facilityChapters[index];
  return <div className="fac-chapter-heading" data-facility-reveal="copy"><div><p className="eyebrow">{String(index + 1).padStart(2, '0')} / A school day, supported</p><h2 id={`${chapter.id}-title`}>{chapter.name}</h2></div><p>{chapter.introduction}</p></div>;
}

function FacilityHeading({ facility }) {
  return <h3 id={`${facility.id}-title`} tabIndex={-1}>{facility.name}</h3>;
}

export default function Facilities() {
  const initial = facilityTarget(window.location.hash.slice(1));
  const [labId, setLabId] = useState(initial?.lab?.id || laboratoryEntries[0].id);
  const [pending, setPending] = useState(null);
  const [viewer, setViewer] = useState(null);
  const page = useRef(null);
  const digitalDetails = useRef(null);
  const previousPrintOpen = useRef(false);
  const transition = useRef(null);
  const labVersion = useRef(0);
  const selectedLab = laboratoryEntries.find(lab => lab.id === labId);
  const { library, laboratories, 'digital-classrooms': digital, 'audio-visual-room': audio, playground, 'basketball-court': basketball, 'badminton-court': badminton, 'sick-bay': sickBay, 'apan-mithra': firstAid, transport } = facilityById;

  const reveal = useCallback((id, { focus = true, updateUrl = true, smooth = true } = {}) => {
    const target = facilityTarget(id);
    if (!target) return;
    transition.current?.skipTransition();
    labVersion.current += 1;
    if (target.lab) setLabId(target.lab.id);
    if (target.facility.id === 'digital-classrooms') setDisclosureOpen(digitalDetails.current, true, { immediate: true });
    if (updateUrl && window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    setPending({ id, focus, smooth });
  }, [setLabId, setPending]);

  useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.slice(1);
      if (facilityTarget(id)) reveal(id, { focus: false, updateUrl: false, smooth: false });
      else if (!id) {
        transition.current?.skipTransition(); labVersion.current += 1;
        setLabId(laboratoryEntries[0].id);
        setPending({ id: 'main', focus: false, smooth: false });
      }
    };
    if (facilityTarget(window.location.hash.slice(1))) syncHash();
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => { transition.current?.skipTransition(); window.removeEventListener('hashchange', syncHash); window.removeEventListener('popstate', syncHash); };
  }, [reveal]);

  useLayoutEffect(() => {
    const root = page.current;
    const header = document.querySelector('.navbar__inner');
    const update = () => root.style.setProperty('--fac-header-offset', `${Math.max(114, header.getBoundingClientRect().height + 30)}px`);
    update();
    const resize = new ResizeObserver(update);
    resize.observe(header);
    return () => resize.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!pending) return;
    let second;
    let highlightTimer;
    const frame = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      const target = document.getElementById(pending.id);
      if (!target) return;
      const heading = pending.id.endsWith('-lab') ? target : target.querySelector('h3');
      if (pending.focus) {
        heading?.focus({ preventScroll: true });
        target.classList.add('fac-destination');
        highlightTimer = window.setTimeout(() => target.classList.remove('fac-destination'), 1800);
      }
      target.scrollIntoView({ block: 'start', behavior: pending.smooth && !reducedMotion() ? 'smooth' : 'instant' });
    }); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(second); clearTimeout(highlightTimer); document.querySelectorAll('.fac-destination').forEach(element => element.classList.remove('fac-destination')); };
  }, [pending]);

  useEffect(() => {
    const root = page.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let observer;
    function settle() { animations.forEach(animation => animation.cancel()); animations.clear(); }
    if (!media.matches && 'IntersectionObserver' in window) {
      try {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          if (media.matches || !entry.target.animate) return;
          const care = Boolean(entry.target.closest('.fac-care'));
          const isPhoto = entry.target.dataset.facilityReveal === 'photo';
          try {
            const animation = entry.target.animate([
              { opacity: .2, transform: care ? 'none' : isPhoto ? 'scale(.99)' : 'translateY(10px)' },
              { opacity: 1, transform: 'none' },
            ], { duration: 500, delay: isPhoto ? 0 : 80, easing: 'ease-out' });
            animations.add(animation);
            animation.finished.catch(() => {}).finally(() => animations.delete(animation));
          } catch { /* Content remains visible without animation. */ }
        }), { threshold: .08 });
        root.querySelectorAll('[data-facility-reveal]').forEach(element => observer.observe(element));
      } catch { observer?.disconnect(); }
    }
    const beforePrint = () => {
      settle();
      previousPrintOpen.current = disclosureIsOpen(digitalDetails.current);
      setDisclosureOpen(digitalDetails.current, true, { immediate: true });
      root.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
    };
    const afterPrint = () => setDisclosureOpen(digitalDetails.current, previousPrintOpen.current, { immediate: true });
    const changePreference = () => {
      if (!media.matches) return;
      settle(); observer?.disconnect(); transition.current?.skipTransition();
      setDisclosureOpen(digitalDetails.current, disclosureIsOpen(digitalDetails.current), { immediate: true });
    };
    media.addEventListener('change', changePreference);
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => { settle(); observer?.disconnect(); media.removeEventListener('change', changePreference); window.removeEventListener('beforeprint', beforePrint); window.removeEventListener('afterprint', afterPrint); };
  }, []);

  function openPhoto(facility, index, event, photos = facility.photos) {
    setViewer({ title: facility.name, photos, index, returnTo: event.currentTarget });
  }

  function selectLab(lab) {
    transition.current?.skipTransition();
    const version = ++labVersion.current;
    const commit = () => {
      if (version !== labVersion.current) return;
      setLabId(lab.id);
      if (window.location.hash !== `#${lab.id}`) window.history.pushState(null, '', `#${lab.id}`);
    };
    if (document.startViewTransition && !reducedMotion()) {
      transition.current = document.startViewTransition(() => flushSync(commit));
      transition.current.ready.catch(() => {});
    } else commit();
  }

  function photograph(facility, index = 0, extra = {}) {
    return <FacilityPhoto photo={facility.photos[index]} onOpen={event => openPhoto(facility, index, event)} {...extra} />;
  }

  function toggleDigital() {
    const open = !disclosureIsOpen(digitalDetails.current);
    try { setDisclosureOpen(digitalDetails.current, open); }
    catch { setDisclosureOpen(digitalDetails.current, open, { immediate: true }); }
  }

  return <main id="main" className="fac-page" ref={page}>
    <div className="fac-shell">
      <nav className="fac-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Incampus</span><span aria-hidden="true">/</span><span aria-current="page">Facilities</span></nav>
      <section className="fac-opening" aria-labelledby="fac-title"><div><p className="eyebrow">Facilities</p><h1 id="fac-title"><span>Space to discover.</span><span>Support to <em>thrive.</em></span></h1><p>From books and experiments to a game on the court, discover the facilities that support learning, play and everyday life at Chinmaya Vidyalaya.</p></div><div className="fac-opening__photos">{photograph(library, 0, { eager: true, sizes: '(max-width: 700px) 55vw, 370px' })}{photograph(badminton, 0, { eager: true, sizes: '(max-width: 700px) 35vw, 230px' })}</div></section>
      <FacilityFinder onSelect={id => reveal(id)} />

      <section className="fac-chapter fac-learning" aria-labelledby="learning-discovery-title"><ChapterHeading index={0} />
        <article id="library" className="fac-library fac-target" aria-labelledby="library-title">{photograph(library)}<div data-facility-reveal="copy"><p className="fac-label">A world of reading</p><FacilityHeading facility={library} /><p className="fac-library__quantity"><span>approximately</span>15,000 <small>books</small></p><Prose facility={library} /></div></article>
        <article id="laboratories" className="fac-laboratories fac-target" aria-labelledby="laboratories-title"><div className="fac-laboratories__copy" data-facility-reveal="copy"><p className="fac-label">Learning through discovery</p><FacilityHeading facility={laboratories} /><Prose facility={laboratories} /><div className="fac-lab-controls" role="group" aria-label="Choose a laboratory">{laboratoryEntries.map(lab => <button key={lab.id} type="button" aria-pressed={lab.id === labId} aria-controls={`${lab.id}-panel`} onClick={() => selectLab(lab)}>{lab.name}<span aria-hidden="true">↗</span></button>)}</div></div><div className="fac-lab-stage">{laboratoryEntries.map(lab => <section id={`${lab.id}-panel`} className="fac-lab-panel" hidden={lab.id !== labId} key={lab.id} aria-labelledby={lab.id}><h4 id={lab.id} tabIndex={-1}>{lab.name} Lab</h4><FacilityPhoto photo={lab.photo} onOpen={event => openPhoto({ name: 'Laboratories', photos: laboratoryEntries.map(item => item.photo) }, laboratoryEntries.indexOf(lab), event)} /></section>)}<p className="fac-lab-status" role="status" aria-live="polite">{selectedLab.name} · {laboratoryEntries.indexOf(selectedLab) + 1} / {laboratoryEntries.length}</p></div></article>
        <div className="fac-digital-pair"><article id="digital-classrooms" className="fac-digital fac-target" aria-labelledby="digital-classrooms-title">{photograph(digital)}<div data-facility-reveal="copy"><FacilityHeading facility={digital} /><p>{digital.introduction}</p><details ref={digitalDetails} className="fac-details"><summary onClick={event => { event.preventDefault(); toggleDigital(); }}>Read about digital learning <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></summary><div className="details-content"><Prose facility={digital} /></div></details></div></article><article id="audio-visual-room" className="fac-audio fac-target" aria-labelledby="audio-visual-room-title" data-facility-reveal="copy"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 12h40v29H12zM8 8h48M32 41v11m-10 6 10-6 10 6" /></svg><p className="fac-label">Shared learning</p><FacilityHeading facility={audio} /><Prose facility={audio} /></article></div>
      </section>

      <section className="fac-chapter fac-sports" aria-labelledby="sports-play-title"><ChapterHeading index={1} />
        <article id="playground" className="fac-playground fac-target" aria-labelledby="playground-title"><div data-facility-reveal="copy"><p className="fac-label">Room to play</p><FacilityHeading facility={playground} /><Prose facility={playground} /></div><div className="fac-playground__photos">{photograph(playground)}{photograph(playground, 1, { className: 'fac-photo--supporting', sizes: '(max-width: 700px) 65vw, 250px' })}</div></article>
        <div className="fac-courts">{[basketball, badminton].map(facility => <article id={facility.id} key={facility.id} className="fac-target" aria-labelledby={`${facility.id}-title`}><FacilityHeading facility={facility} /><div className="fac-court-photos">{facility.photos.map((photo, index) => <FacilityPhoto key={photo.src} photo={photo} onOpen={event => openPhoto(facility, index, event)} sizes="(max-width: 700px) 43vw, 290px" />)}</div></article>)}</div>
      </section>

      <section className="fac-chapter fac-care" aria-labelledby="care-support-title"><ChapterHeading index={2} />
        <article id="sick-bay" className="fac-sick-bay fac-target" aria-labelledby="sick-bay-title">{photograph(sickBay)}<div data-facility-reveal="copy"><p className="fac-label">A comfortable space</p><FacilityHeading facility={sickBay} /><Prose facility={sickBay} /></div></article>
        <div className="fac-support-grid"><article id="apan-mithra" className="fac-first-aid fac-target" aria-labelledby="apan-mithra-title" data-facility-reveal="copy"><p className="fac-label">Help during the school day</p><FacilityHeading facility={firstAid} /><Prose facility={firstAid} /></article><article id="transport" className="fac-transport fac-target" aria-labelledby="transport-title">{photograph(transport)}<FacilityHeading facility={transport} /><Prose facility={transport} /><a className="fac-text-link" href="#contact">Enquire about transport <span aria-hidden="true">↗</span></a></article></div>
      </section>
      <p className="fac-source-note">Information and photographs are from the school’s published material. Please contact the school for current details.</p>
      <section className="fac-closing" aria-labelledby="fac-closing-title"><div><p className="eyebrow">A brighter beginning</p><h2 id="fac-closing-title">A school day<br /><em>full of possibility.</em></h2><p>Speak to us about becoming part of the Chinmaya Vidyalaya community.</p></div><div><EnquiryButton className="button button--primary">Enquire Now <span aria-hidden="true">↗</span></EnquiryButton><div className="fac-related"><a href="/incampus/infrastructure">Infrastructure</a><a href="/incampus/verdant-view">Verdant View</a></div></div></section>
    </div>
    {viewer && <PhotoLightbox title={viewer.title} photos={viewer.photos} index={viewer.index} onChange={index => setViewer(current => ({ ...current, index }))} onClose={() => setViewer(null)} returnTo={viewer.returnTo} />}
  </main>;
}
