import { useEffect, useLayoutEffect, useRef } from 'react';
import { campusSections } from '../../content/campusNavigation';
import Infrastructure from '../Infrastructure/Infrastructure';
import VerdantView from '../VerdantView/VerdantView';
import Facilities from '../Facilities/Facilities';
import useCampusMotion from './useCampusMotion';
import './Incampus.css';

export default function Incampus() {
  const page = useRef(null);
  useCampusMotion(page);

  useLayoutEffect(() => {
    const root = page.current;
    const header = document.querySelector('.navbar__inner');
    const update = () => root.style.setProperty('--campus-header-offset', `${Math.max(115, header.getBoundingClientRect().height + 30)}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let first;
    let second;
    const restoreSection = (id = window.location.hash.slice(1), explicit = false) => {
      cancelAnimationFrame(first); cancelAnimationFrame(second);
      if (id && !campusSections.some(section => section.id === id)) return;
      first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
        const behavior = explicit && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant';
        const target = id ? document.getElementById(id) : page.current;
        if (explicit) target?.focus({ preventScroll: true });
        if (!id) window.scrollTo({ top: 0, behavior });
        else target?.scrollIntoView({ block: 'start', behavior });
      }); });
    };
    const restoreHistory = () => restoreSection();
    const followSection = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== '/incampus') return;
      const id = url.hash.slice(1);
      if (id && !campusSections.some(section => section.id === id)) return;
      event.preventDefault();
      const destination = `${url.pathname}${url.search}${url.hash}`;
      if (destination !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.pushState(null, '', destination);
      restoreSection(id, true);
    };
    restoreSection();
    document.addEventListener('click', followSection, true);
    window.addEventListener('hashchange', restoreHistory);
    window.addEventListener('popstate', restoreHistory);
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); document.removeEventListener('click', followSection, true); window.removeEventListener('hashchange', restoreHistory); window.removeEventListener('popstate', restoreHistory); };
  }, []);

  return <main id="main" className="incampus-page" ref={page} tabIndex={-1}>
    <header className="incampus-opening">
      <nav aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Incampus</span></nav>
      <p className="eyebrow">Incampus</p>
      <h1><span className="incampus-heading-line">A place to learn,</span><span className="incampus-heading-line"><em>grow and belong.</em></span></h1>
      <p>Explore the spaces, gardens and everyday support that make up life at Chinmaya Vidyalaya.</p>
      <nav className="incampus-sections" aria-label="Incampus sections">{campusSections.map(section => <a href={`#${section.id}`} key={section.id}>{section.name}<span aria-hidden="true">↓</span></a>)}</nav>
    </header>
    <Infrastructure embedded />
    <VerdantView embedded />
    <Facilities embedded />
  </main>;
}
