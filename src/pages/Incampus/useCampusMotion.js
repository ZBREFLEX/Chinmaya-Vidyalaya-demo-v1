import { useEffect } from 'react';

// One entrance controller for the combined page. Base content is always visible.
const revealSelectors = [
  '.incampus-opening > .eyebrow', '.incampus-heading-line',
  '.incampus-opening > p:not(.eyebrow)', '.incampus-sections a',
  '.infra-intro__copy', '.infra-intro__photo', '.infra-section-heading',
  '.infra-tile', '.infra-explorer__heading', '.infra-explorer__composition',
  '.verdant-opening__copy', '.verdant-opening__image', '.verdant-garden-links a',
  '.verdant-story__copy', '.verdant-story .verdant-photo',
  '.fac-opening > div:first-child', '.fac-opening__photos .fac-photo',
  '.fac-finder', '.fac-chapter-heading', '.fac-lab-stage',
  '[data-facility-reveal]', '.fac-closing',
].join(',');

export default function useCampusMotion(pageRef) {
  useEffect(() => {
    const root = pageRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new WeakSet();
    const watched = new WeakSet();
    const active = new Map();
    const entranceKeys = new Set();
    let observer;
    let printing = false;

    function settle() {
      active.forEach(animation => animation.cancel());
      active.clear();
    }

    function enter(element) {
      watched.delete(element);
      if (!element.isConnected || seen.has(element) || preference.matches || printing) return;
      seen.add(element);
      // Explorer selection already has its own coordinated photo/text transition.
      if (element.matches('.infra-explorer__composition')) {
        if (entranceKeys.has('explorer')) return;
        entranceKeys.add('explorer');
      }
      if (!element.animate) return;
      const mobile = window.matchMedia('(max-width: 700px)').matches;
      const photo = element.matches('figure, .infra-explorer__composition, .fac-lab-stage, .verdant-opening__image');
      const care = Boolean(element.closest('.fac-care'));
      let delay = 0;
      if (element.matches('.incampus-heading-line')) delay = [...root.querySelectorAll('.incampus-heading-line')].indexOf(element) * 85;
      else if (element.matches('.infra-tile')) delay = [...root.querySelectorAll('.infra-tile')].indexOf(element) % (mobile ? 2 : 4) * 55;
      else if (element.matches('.incampus-sections a, .verdant-garden-links a')) delay = [...element.parentElement.children].indexOf(element) * 45;
      else if (element.matches('.verdant-photo--supporting, .fac-photo--supporting')) delay = 90;
      const distance = care ? 8 : mobile ? 12 : 22;
      try {
        const animation = element.animate([
          { opacity: .08, transform: `translate3d(0, ${distance}px, 0)${photo ? ' scale(.985)' : ''}` },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
        ], { duration: mobile ? 550 : 720, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
        active.set(element, animation);
        animation.finished.catch(() => {}).finally(() => {
          if (active.get(element) === animation) active.delete(element);
        });
      } catch { /* A failed animation leaves the ordinary, visible page in place. */ }
    }

    function watch() {
      if (preference.matches || printing || typeof IntersectionObserver !== 'function') return;
      if (!observer) {
        try {
          observer = new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) { observer.unobserve(entry.target); enter(entry.target); }
          }), { threshold: .08 });
        } catch { return; }
      }
      root.querySelectorAll(revealSelectors).forEach(element => {
        if (seen.has(element) || watched.has(element) || element.closest('[hidden], .infra-print')) return;
        if (element.matches('[data-facility-reveal]') && element.closest('.fac-lab-stage')) return;
        watched.add(element);
        observer.observe(element);
      });
    }

    // Keep keyboard destinations and focused controls stationary during their use.
    function focusChanged(event) {
      active.forEach((animation, element) => {
        if (element.contains(event.target)) { animation.cancel(); active.delete(element); }
      });
    }
    function changedPreference() {
      if (preference.matches) settle();
      else watch();
    }
    const beforePrint = () => { printing = true; settle(); };
    const afterPrint = () => { printing = false; watch(); };
    watch();
    const mutations = new MutationObserver(() => {
      active.forEach((animation, element) => {
        if (!element.isConnected) { animation.cancel(); active.delete(element); }
      });
      watch();
    });
    mutations.observe(root, { childList: true, subtree: true });
    root.addEventListener('focusin', focusChanged);
    preference.addEventListener('change', changedPreference);
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      settle(); observer?.disconnect(); mutations.disconnect();
      root.removeEventListener('focusin', focusChanged);
      preference.removeEventListener('change', changedPreference);
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, [pageRef]);
}
