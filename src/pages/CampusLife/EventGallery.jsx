import { useEffect, useRef, useState } from 'react';
import { findGalleryStories, galleryStories, lifeUrl } from '../../content/campusLifeModel';

export default function EventGallery({ state, update }) {
  const results = findGalleryStories(state), grid = useRef(null);
  const [announcement, setAnnouncement] = useState('');
  const years = [...new Set(galleryStories.flatMap(s => s.years))].sort((a, b) => b.localeCompare(a));
  const change = (patch, replace = false) => update({ ...patch, glimit: 6 }, replace, '#event-gallery');
  const clear = () => change({ gq: '', media: '', gyear: '' });
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(`${results.length} matching albums. Showing ${Math.min(results.length, state.glimit)}.`), 250);
    return () => clearTimeout(timer);
  }, [results.length, state.glimit]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !grid.current?.animate) return;
    let animation;
    try { animation = grid.current.animate([{ opacity: .55, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 170 }); } catch { /* Content stays visible. */ }
    return () => animation?.cancel();
  }, [state.media, state.gyear]);
  return <section id="event-gallery" className="event-gallery" tabIndex={-1} aria-labelledby="event-gallery-title"><div className="life-shell">
    <div className="life-section-heading" data-life-reveal><p className="eyebrow">A closer look</p><h2 id="event-gallery-title">The moments we keep.</h2><p>Event Gallery · photographs, performances and memories from the school archives. Open an album for every supplied image and the full event report.</p></div>
    <div className="life-filters"><label htmlFor="gallery-search">Search events<input id="gallery-search" type="search" placeholder="Try Talent Time, Annual Day, MUN…" value={state.gq} onChange={e => change({ gq: e.target.value }, true)} /></label><div><label htmlFor="gallery-media">Media</label><select id="gallery-media" value={state.media} onChange={e => change({ media: e.target.value })}><option value="">All media</option><option value="photos">Photos</option><option value="videos">Videos</option></select></div><div><label htmlFor="gallery-year">Year</label><select id="gallery-year" value={state.gyear} onChange={e => change({ gyear: e.target.value })}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}<option value="unknown">Year not recorded</option></select></div><button className="life-reset" onClick={clear}>Clear gallery filters</button></div>
    <div className="life-results-bar"><p>{results.length} {results.length === 1 ? 'album' : 'albums'} <span>· Showing {Math.min(state.glimit, results.length)}</span></p><span role="status" className="sr-only">{announcement}</span></div>
    <div className="event-albums" ref={grid}>{results.slice(0, state.glimit).map(story => {
      const photo = story.images[0], video = story.videos?.[0];
      const href = lifeUrl({ ...state, story: story.slug }, '#event-gallery');
      return <article className="event-album" key={story.id} data-life-reveal><a className="event-album__cover" href={href} tabIndex={-1} aria-hidden="true">{photo ? <img src={photo.thumbnail} srcSet={`${photo.thumbnail} ${photo.thumbnailWidth}w, ${photo.preview} ${photo.previewWidth}w`} sizes="(max-width:700px) 92vw, 400px" width={photo.width} height={photo.height} loading="lazy" alt="" /> : <img src={video.thumbnail} width="480" height="360" loading="lazy" alt="" />}<span className="event-album__type">{photo ? `${story.images.length} ${story.images.length === 1 ? 'photo' : 'photos'}` : '▶ Video'}{photo && video ? ' · Video' : ''}</span></a><div className="event-album__copy"><p className="life-story__date">{story.dateText}</p><h3><a href={href}>{story.title}</a></h3><a className="life-text-link" href={href}>{photo ? 'Open album' : 'Watch video'} <span aria-hidden="true">↗</span><span className="sr-only">: {story.title}</span></a></div></article>;
    })}</div>
    {!results.length && <div className="life-empty"><h3>No albums match these choices.</h3><p>Try another search, media type or year.</p><button className="button button--outline" onClick={clear}>Show all albums</button></div>}
    {results.length > state.glimit && <button className="button button--outline life-show-more" onClick={() => update({ glimit: state.glimit + 6 }, false, '#event-gallery')}>Show more albums ↓</button>}
    <p className="life-archive__note">Dates reflect the original reports. Videos open on the school’s YouTube channel; no video plays automatically.</p>
  </div></section>;
}
