import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gardens } from '../../content/verdantView';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import PhotoLightbox from '../../components/media/PhotoLightbox';
import './VerdantView.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function GardenPhoto({ photo, onOpen, className = '', eager = false, sizes = '(max-width: 700px) 90vw, (max-width: 1000px) 50vw, 620px' }) {
  return <figure className={`verdant-photo ${className}`} data-garden-reveal="photo">
    <button type="button" aria-label={`Enlarge photograph: ${photo.caption}`} aria-haspopup="dialog" onClick={onOpen}>
      <img src={photo.src} srcSet={`${photo.preview} 360w, ${photo.src} ${photo.width}w`} sizes={sizes} width={photo.width} height={photo.height} alt={photo.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} />
      <span className="verdant-photo__enlarge" aria-hidden="true">View photograph <span>↗</span></span>
    </button>
    <figcaption>{photo.caption}</figcaption>
  </figure>;
}

export default function VerdantView({ embedded = false }) {
  const Container = embedded ? 'section' : 'main';
  const OpeningTitle = embedded ? 'h2' : 'h1';
  const SectionHeading = embedded ? 'h3' : 'h2';
  const page = useRef(null);
  const [viewer, setViewer] = useState(null);
  const openingGarden = gardens[2];

  const revealGarden = useCallback((id, { focus = false, smooth = false } = {}) => {
    const section = document.getElementById(id);
    if (!section) return;
    const heading = section.querySelector('[id$="-title"]');
    if (focus) heading?.focus({ preventScroll: true });
    section.scrollIntoView({ block: 'start', behavior: smooth && !reducedMotion() ? 'smooth' : 'instant' });
  }, []);

  useLayoutEffect(() => {
    const root = page.current;
    const header = document.querySelector('.navbar__inner');
    const updateOffset = () => root.style.setProperty('--verdant-header-offset', `${Math.max(112, header.getBoundingClientRect().height + 28)}px`);
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame;
    const restore = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const garden = gardens.find(item => `#${item.id}` === window.location.hash);
        if (garden) revealGarden(garden.id);
        else if (!window.location.hash && !embedded) window.scrollTo({ top: 0, behavior: 'instant' });
      });
    };
    restore();
    window.addEventListener('hashchange', restore);
    window.addEventListener('popstate', restore);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', restore); window.removeEventListener('popstate', restore); };
  }, [revealGarden, embedded]);

  useEffect(() => {
    const root = page.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (embedded || !('IntersectionObserver' in window) || media.matches) return;
    const animations = new Set();
    let observer;
    function enter(element) {
      if (media.matches || !element.animate) return;
      const photo = element.dataset.gardenReveal === 'photo';
      const targets = photo ? [element] : element.querySelectorAll('h2, h3, .verdant-story__label');
      targets.forEach(target => {
        try {
          const animation = target.animate(photo
            ? [{ opacity: .2, transform: 'scale(.99)' }, { opacity: 1, transform: 'none' }]
            : [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: photo ? 600 : 500, delay: element.classList.contains('verdant-photo--supporting') ? 100 : 0, easing: 'ease-out' });
          animations.add(animation);
          animation.finished.catch(() => {}).finally(() => animations.delete(animation));
        } catch { /* Base styles stay visible if animation is unavailable. */ }
      });
    }
    try {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { enter(entry.target); observer.unobserve(entry.target); }
      }), { threshold: 0.08 });
      root.querySelectorAll('.verdant-story [data-garden-reveal]').forEach(element => observer.observe(element));
    } catch { observer?.disconnect(); }
    const settle = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
    const handlePreference = () => { if (media.matches) { settle(); observer?.disconnect(); } };
    media.addEventListener('change', handlePreference);
    window.addEventListener('beforeprint', settle);
    return () => { settle(); observer?.disconnect(); media.removeEventListener('change', handlePreference); window.removeEventListener('beforeprint', settle); };
  }, [embedded]);

  function openPhoto(garden, index, event) {
    setViewer({ garden, index, returnTo: event.currentTarget });
  }

  function jumpToGarden(event, id) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    revealGarden(id, { focus: true, smooth: true });
  }

  return <Container id={embedded ? 'verdant-view' : 'main'} className="verdant-page" ref={page} tabIndex={embedded ? -1 : undefined} aria-labelledby={embedded ? 'verdant-title' : undefined}>
    <div className="verdant-shell">
      {!embedded && <nav className="verdant-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Incampus</span><span aria-hidden="true">/</span><span aria-current="page">Verdant View</span></nav>}
      <section className="verdant-opening" aria-labelledby="verdant-title">
        <div className="verdant-opening__copy"><p className="eyebrow">Verdant View</p><OpeningTitle id="verdant-title"><span>Where learning</span><span>takes <em>root.</em></span></OpeningTitle><p>Growing vegetables, getting to know traditional herbs, and discovering plants connected to Kerala tradition. Three gardens bring another dimension to learning at Chinmaya Vidyalaya.</p></div>
        <div className="verdant-opening__image"><span className="verdant-opening__line" aria-hidden="true" /><GardenPhoto photo={openingGarden.images[0]} eager onOpen={event => openPhoto(openingGarden, 0, event)} sizes="(max-width: 700px) 90vw, 480px" /><span className="verdant-opening__note" aria-hidden="true">Learning, in bloom.</span></div>
      </section>
      <nav className="verdant-garden-links" aria-label="The three gardens">{gardens.map((garden, index) => <a key={garden.id} href={`#${garden.id}`} onClick={event => jumpToGarden(event, garden.id)}><span>{String(index + 1).padStart(2, '0')}</span>{garden.title}<span aria-hidden="true">↓</span></a>)}</nav>
      <div className="verdant-stories">{gardens.map((garden, index) => <section key={garden.id} id={garden.id} className={`verdant-story verdant-story--${garden.id}`} aria-labelledby={`${garden.id}-title`}>
        <div className="verdant-story__copy" data-garden-reveal="copy"><p className="verdant-story__label"><span>{String(index + 1).padStart(2, '0')}</span>{garden.introduction}</p><SectionHeading id={`${garden.id}-title`} tabIndex={-1}>{garden.title}</SectionHeading>{garden.id === 'herbal-garden' && <p className="verdant-source-label">From the school’s garden description</p>}<p className="verdant-story__description">{garden.description}</p>{garden.highlights.length > 0 && <ul className="verdant-highlights" aria-label="Garden highlights">{garden.highlights.map(text => <li key={text}>{text}</li>)}</ul>}</div>
        <div className="verdant-story__photos">{garden.images.map((photo, photoIndex) => <GardenPhoto key={photo.src} photo={photo} className={photoIndex ? 'verdant-photo--supporting' : ''} onOpen={event => openPhoto(garden, photoIndex, event)} sizes={photoIndex ? '(max-width: 700px) 65vw, 260px' : undefined} />)}</div>
      </section>)}</div>
      <p className="verdant-source-note">Garden descriptions and photographs are from the school’s published campus material.</p>
      {!embedded && <section className="verdant-closing" aria-labelledby="verdant-closing-title"><div><p className="eyebrow">Room to learn. Space to grow.</p><SectionHeading id="verdant-closing-title">Discover more of<br /><em>life at Chinmaya.</em></SectionHeading><p>Get in touch to learn about joining our school community.</p></div><div className="verdant-closing__actions"><EnquiryButton className="button button--primary">Enquire Now <span aria-hidden="true">↗</span></EnquiryButton><a href="/incampus/infrastructure">Explore Infrastructure <span aria-hidden="true">→</span></a></div></section>}
    </div>
    {viewer && <PhotoLightbox title={viewer.garden.title} photos={viewer.garden.images} index={viewer.index} onChange={index => setViewer(current => ({ ...current, index }))} onClose={() => setViewer(null)} returnTo={viewer.returnTo} />}
  </Container>;
}
