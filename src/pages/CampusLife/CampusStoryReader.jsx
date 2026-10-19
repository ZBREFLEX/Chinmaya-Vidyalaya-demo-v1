import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PhotoViewerContent } from '../../components/media/PhotoLightbox';
import { readableLifeText } from '../../content/archiveText';

export default function CampusStoryReader({ story, onClose, returnTo, recordType = 'story' }) {
  const dialog = useRef(null);
  const close = useRef(null);
  const back = useRef(null);
  const articleScroll = useRef(0);
  const [photoIndex, setPhotoIndex] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const copyInput = useRef(null);
  const previousPhoto = useRef(null);
  const [copyFallback, setCopyFallback] = useState(false);
  const [loadedVideo, setLoadedVideo] = useState('');

  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    const position = { x: window.scrollX, y: window.scrollY };
    element.showModal(); document.body.style.overflow = 'hidden'; close.current.focus();
    return () => {
      element.close(); document.body.style.overflow = overflow;
      const target = returnTo?.isConnected ? returnTo : document.querySelector(recordType === 'achievement' ? '.achievement-opening h1' : '.life-opening h1');
      // History traversal may restore a fragment after React removes the dialog.
      // Restore the exact reading position and trigger after that browser step.
      const restore = () => {
        if (document.querySelector('.campus-reader[open]')) return;
        target?.focus({ preventScroll: true });
        window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
      };
      restore(); requestAnimationFrame(() => requestAnimationFrame(restore));
    };
  }, [returnTo, recordType]);

  useLayoutEffect(() => {
    if (photoIndex !== null) { dialog.current.scrollTop = 0; back.current?.focus(); }
    else if (previousPhoto.current !== null) {
      dialog.current.scrollTop = articleScroll.current;
      dialog.current.querySelector(`[data-story-photo="${previousPhoto.current}"]`)?.focus({ preventScroll: true });
    }
    previousPhoto.current = photoIndex;
  }, [photoIndex]);

  useEffect(() => { if (copyFallback) { copyInput.current?.focus(); copyInput.current?.select(); } }, [copyFallback]);

  const openPhoto = index => { articleScroll.current = dialog.current.scrollTop; setPhotoIndex(index); };
  const handleKeys = event => {
    if (photoIndex !== null && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); setPhotoIndex((photoIndex + (event.key === 'ArrowRight' ? 1 : -1) + story.images.length) % story.images.length); }
    if (event.key === 'Tab') {
      const controls = [...dialog.current.querySelectorAll('a[href], button, input, iframe')].filter(el => el.getClientRects().length && !el.disabled);
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopyStatus(`${recordType === 'achievement' ? 'Achievement' : 'Story'} link copied.`); }
    catch { setCopyFallback(true); setCopyStatus(`Select and copy the ${recordType} link below.`); }
  };

  return <dialog ref={dialog} className={`campus-reader${photoIndex !== null ? ' campus-reader--gallery' : ''}`} aria-labelledby="campus-reader-title" onKeyDown={handleKeys} onCancel={e => { e.preventDefault(); if (photoIndex !== null) setPhotoIndex(null); else onClose(); }}>
    <div className="campus-reader__bar"><span>From the school archives</span><button ref={close} className="campus-reader__close" onClick={onClose}>Close {recordType} <span aria-hidden="true">×</span></button></div>
    <article className="campus-reader__article" hidden={photoIndex !== null}>
      <header><p className="eyebrow">{story.categories.join(' / ')}</p><h2 id="campus-reader-title">{story.title}</h2><p className="campus-reader__date">{story.dateText}</p></header>
      <div className="campus-reader__body">{story.publicNote && <aside className="reader-source-note">{story.publicNote}</aside>}{story.body.map((paragraph, i) => <p key={i}>{readableLifeText(paragraph)}</p>)}{!story.body.length && !story.publicNote && <p>{story.videos?.length ? 'A video from the school’s archive.' : story.images.length ? 'Images from the school archives.' : 'This archive entry contains a title only. A full report and photographs were not supplied.'}</p>}</div>
      {story.videos?.length > 0 && <section className="reader-videos" aria-label="Event videos">{story.videos.map(video => <figure key={video.id}><div className="reader-video-frame">{loadedVideo === video.id ? <iframe title={video.title} src={`https://www.youtube-nocookie.com/embed/${video.id}`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button onClick={() => setLoadedVideo(video.id)} aria-label={`Load video player: ${video.title}`}><img src={video.thumbnail} width="480" height="360" alt="" loading="lazy" /><span>▶ Load video player</span></button>}</div><figcaption>{video.title}</figcaption><a className="life-text-link" href={video.url} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗<span className="sr-only">: {video.title} (opens in a new tab)</span></a><p className="reader-video-help">If the player is unavailable, open the original video on YouTube.</p><a className="reader-video-url" href={video.url}>{video.url}</a></figure>)}</section>}
      {story.images.length > 0 && <section className="campus-reader__photos" aria-label="Story photographs"><h3>{story.images.length} archive {story.images.length === 1 ? 'image' : 'images'}</h3><div>{story.images.map((photo, i) => <figure className={photo.poster ? "reader-poster" : undefined} key={photo.id}><button data-story-photo={i} onClick={() => openPhoto(i)} aria-label={`Enlarge image ${i + 1}: ${story.title}`}><img src={photo.preview} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" /><span aria-hidden="true">Enlarge ↗</span></button><figcaption>{photo.caption}</figcaption></figure>)}</div></section>}
      {story.images.some(photo => photo.originalSrc) && <p className="reader-original-note">Open any image to view it at its natural proportions or access the original file.</p>}
      {story.related?.length > 0 && <nav className="reader-related" aria-label="Related reports"><h3>Related reports</h3>{story.related.map(item => <a key={item.href} className="life-text-link" href={item.href}>{item.title} ↗</a>)}</nav>}
      <div className="campus-reader__tools"><button className="button button--outline" onClick={copyLink}>Copy {recordType} link</button><button className="life-text-link" onClick={() => window.print()}>Print {recordType}</button><p role="status">{copyStatus}</p>{copyFallback && <label>Record link<input ref={copyInput} readOnly value={window.location.href} /></label>}</div>
    </article>
    {photoIndex !== null && <div className="campus-reader__gallery photo-lightbox"><PhotoViewerContent title={story.title} photos={story.images} index={photoIndex} onChange={setPhotoIndex} onClose={() => setPhotoIndex(null)} closeRef={back} closeLabel={`Back to ${recordType}`} idPrefix="campus-gallery" /></div>}
  </dialog>;
}
