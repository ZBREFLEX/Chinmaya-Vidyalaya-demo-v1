import { useCallback, useEffect, useRef } from 'react';
import './PhotoLightbox.css';

export default function PhotoLightbox({ title, photos, index, onChange, onClose, returnTo }) {
  const dialog = useRef(null);
  const close = useRef(null);
  const photo = photos[index];
  const step = useCallback(direction => onChange((index + direction + photos.length) % photos.length), [index, onChange, photos.length]);

  useEffect(() => {
    const element = dialog.current;
    const oldOverflow = document.body.style.overflow;
    const oldScroll = { x: window.scrollX, y: window.scrollY };
    element.showModal();
    document.body.style.overflow = 'hidden';
    close.current.focus();
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      returnTo?.focus({ preventScroll: true });
      window.scrollTo({ left: oldScroll.x, top: oldScroll.y, behavior: 'instant' });
    };
  }, [returnTo]);

  function handleKeys(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Tab') {
      const controls = [...dialog.current.querySelectorAll('button')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  return <dialog ref={dialog} className="photo-lightbox" aria-labelledby="photo-lightbox-title" aria-describedby="photo-lightbox-caption" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={handleKeys}>
    <div className="photo-lightbox__bar"><h2 id="photo-lightbox-title">{title}</h2><button ref={close} type="button" aria-label="Close enlarged photograph" onClick={onClose}>Close <span aria-hidden="true">×</span></button></div>
    <figure><img key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} /><figcaption id="photo-lightbox-caption" aria-live="polite">{photo.caption}</figcaption></figure>
    {photos.length > 1 && <div className="photo-lightbox__controls"><button type="button" onClick={() => step(-1)} aria-label="Previous photograph">← Previous</button><span>{index + 1} / {photos.length}</span><button type="button" onClick={() => step(1)} aria-label="Next photograph">Next →</button></div>}
  </dialog>;
}

