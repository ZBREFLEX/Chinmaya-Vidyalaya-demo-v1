import { useEffect, useLayoutEffect } from 'react';

const disclosureAnimations = new WeakMap();
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export function disclosureIsOpen(element) { return disclosureAnimations.get(element)?.open ?? element.open; }

// Keep native details semantics; height is released back to auto after each interaction.
export function setDisclosureOpen(element, open, { immediate = false } = {}) {
  if (!element) return;
  const previous = disclosureAnimations.get(element);
  const from = element.getBoundingClientRect().height;
  previous?.animation.cancel();
  previous?.fade?.cancel();
  disclosureAnimations.delete(element);
  element.style.overflow = '';
  delete element.dataset.disclosureClosing;
  if (immediate || prefersReducedMotion() || !element.animate || !element.getClientRects().length) {
    element.open = open;
    return;
  }
  if (element.open === open && !previous) return;
  const summary = element.querySelector('summary');
  element.open = true;
  const full = element.getBoundingClientRect().height;
  const borders = parseFloat(getComputedStyle(element).borderTopWidth) + parseFloat(getComputedStyle(element).borderBottomWidth);
  const to = open ? full : summary.getBoundingClientRect().height + borders;
  // Only the animated viewport is clipped. Full content returns to normal flow on completion.
  element.style.overflow = 'clip';
  element.dataset.disclosureClosing = String(!open);
  const animation = element.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 260, easing: 'cubic-bezier(.2,.65,.3,1)' });
  const fade = open ? element.querySelector('.details-content').animate([{ opacity: .5 }, { opacity: 1 }], { duration: 220 }) : null;
  disclosureAnimations.set(element, { animation, fade, open });
  animation.onfinish = () => {
    if (disclosureAnimations.get(element)?.animation !== animation) return;
    element.open = open;
    element.style.overflow = '';
    delete element.dataset.disclosureClosing;
    disclosureAnimations.delete(element);
    if (!open && element.contains(document.activeElement) && document.activeElement !== summary) summary.focus({ preventScroll: true });
  };
}

export function useStoryMotion(pageRef, pillar) {
  useEffect(() => {
    const page = pageRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    let frame;
    const watchReveals = () => {
      observer?.disconnect();
      if (preference.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('story-entered');
          observer.unobserve(entry.target);
        }
      }), { threshold: .12 });
      page.querySelectorAll('[data-story-reveal]:not(.story-entered)').forEach(element => observer.observe(element));
    };
    const updateTimeline = () => {
      const explorer = page.querySelector('.timeline-explorer');
      const rect = explorer.getBoundingClientRect();
      const progress = preference.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .8 - rect.top) / (rect.height + innerHeight * .25)));
      explorer.style.setProperty('--timeline-progress', String(progress));
      const selected = explorer.querySelector('.timeline-panel:not([hidden])');
      const bounds = selected.getBoundingClientRect();
      const inView = bounds.top < innerHeight * .85 && bounds.bottom > Math.max(100, innerHeight * .15);
      explorer.querySelectorAll('.year-controls button').forEach(button => button.classList.toggle('milestone-in-view', inView && button.dataset.milestone === selected.id));
    };
    const queueUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateTimeline); };
    watchReveals(); queueUpdate();
    const resize = new ResizeObserver(queueUpdate);
    resize.observe(page.querySelector('.timeline-explorer'));
    const changes = new MutationObserver(queueUpdate);
    changes.observe(page.querySelector('.timeline-panels'), { attributes: true, subtree: true, attributeFilter: ['hidden'] });
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate);
    const preferenceChanged = () => {
      watchReveals(); queueUpdate();
      if (preference.matches) {
        page.getAnimations({ subtree: true }).forEach(animation => animation.finish());
      }
    };
    preference.addEventListener('change', preferenceChanged);
    return () => { observer?.disconnect(); resize.disconnect(); changes.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', queueUpdate); window.removeEventListener('resize', queueUpdate); preference.removeEventListener('change', preferenceChanged); };
  }, [pageRef]);

  useLayoutEffect(() => {
    const controls = pageRef.current.querySelector('.pillar-controls');
    const updateIndicator = () => {
      const selected = controls.querySelector('[aria-pressed="true"]');
      controls.style.setProperty('--pillar-x', `${selected.offsetLeft}px`);
      controls.style.setProperty('--pillar-y', `${selected.offsetTop + 12}px`);
      controls.style.setProperty('--pillar-height', `${selected.offsetHeight - 24}px`);
    };
    updateIndicator();
    const resize = new ResizeObserver(updateIndicator);
    resize.observe(controls);
    return () => resize.disconnect();
  }, [pageRef, pillar]);
}
