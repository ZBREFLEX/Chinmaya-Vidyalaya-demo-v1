import { useEffect } from 'react';

export default function useLifeMotion(rootRef) {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Map();
    let observer;
    const settle = () => { active.forEach(a => a.cancel()); active.clear(); };
    const enter = element => {
      if (preference.matches || typeof element.animate !== 'function') return;
      try {
        const animation = element.animate([{ opacity: .2, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 620, delay: Number(element.dataset.lifeDelay || 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        active.set(element, animation); animation.finished.catch(() => {}).finally(() => active.delete(element));
      } catch { /* Ordinary content remains visible. */ }
    };
    if (typeof IntersectionObserver === 'function') {
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { observer.unobserve(entry.target); enter(entry.target); } }), { threshold: .12 });
      rootRef.current.querySelectorAll('[data-life-reveal]').forEach(el => observer.observe(el));
    }
    const stopFocused = event => active.forEach((animation, element) => { if (element.contains(event.target)) animation.cancel(); });
    const root = rootRef.current;
    root.addEventListener('focusin', stopFocused); preference.addEventListener('change', settle); window.addEventListener('beforeprint', settle);
    return () => { observer?.disconnect(); settle(); root.removeEventListener('focusin', stopFocused); preference.removeEventListener('change', settle); window.removeEventListener('beforeprint', settle); };
  }, [rootRef]);
}
