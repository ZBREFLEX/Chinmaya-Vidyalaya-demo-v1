import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { facilityChapters, findFacilities } from '../../content/facilities';

export default function FacilityFinder({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [placement, setPlacement] = useState({ side: 'below', height: 350 });
  const root = useRef(null);
  const input = useRef(null);
  // The visual order is also the keyboard order, including nested laboratory results.
  const results = useMemo(() => {
    const matches = findFacilities(query);
    return facilityChapters.flatMap(chapter => matches.filter(item => item.chapter === chapter.id));
  }, [query]);

  useEffect(() => {
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const position = () => {
      const rect = root.current.querySelector('.fac-finder__field').getBoundingClientRect();
      const headerBottom = document.querySelector('.navbar__inner').getBoundingClientRect().bottom;
      const above = rect.top - Math.max(16, headerBottom + 12);
      const below = window.innerHeight - rect.bottom - 20;
      const side = below < 260 && above > below ? 'above' : 'below';
      setPlacement({ side, height: Math.max(110, Math.min(430, (side === 'above' ? above : below) - 48)) });
    };
    position();
    window.addEventListener('resize', position);
    return () => window.removeEventListener('resize', position);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(`facility-option-${results[active]?.id}`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [open, active, results]);

  function select(item) {
    if (!item) return;
    setOpen(false);
    setActive(-1);
    setQuery('');
    onSelect(item.id);
  }

  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); setActive(-1); }
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActive(current => results.length ? (current < 0 ? (direction > 0 ? 0 : results.length - 1) : (current + direction + results.length) % results.length) : -1);
    } else if (open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault(); setActive(results.length ? event.key === 'Home' ? 0 : results.length - 1 : -1);
    } else if (open && event.key === 'Enter') {
      event.preventDefault(); select(results[active >= 0 ? active : 0]);
    } else if (event.key === 'Tab') { setOpen(false); setActive(-1); }
  }

  return <div className="fac-finder" ref={root}>
    <div className="fac-finder__intro"><label htmlFor="facility-finder-input">Find a facility</label><p>Choose a space, or try “AI lab”, “bus” or “first aid”.</p></div>
    <div className="fac-finder__control">
      <div className="fac-finder__field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg><input ref={input} id="facility-finder-input" role="combobox" type="text" value={query} autoComplete="off" aria-expanded={open} aria-controls="facility-options" aria-autocomplete="list" aria-activedescendant={open && active >= 0 && results[active] ? `facility-option-${results[active].id}` : undefined} placeholder="Search or choose a facility" onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); setActive(0); }} onKeyDown={keys} />{query && <button type="button" aria-label="Clear facility search" onClick={() => { setQuery(''); setActive(-1); setOpen(true); input.current.focus(); }}>×</button>}<button type="button" aria-label={open ? 'Close facility options' : 'Show all facilities'} aria-expanded={open} aria-controls="facility-options" onMouseDown={event => event.preventDefault()} onClick={() => { if (open) setOpen(false); else { setQuery(''); setActive(-1); input.current.focus(); setOpen(true); } }}>⌄</button></div>
      <div className="fac-finder__popup" hidden={!open} data-placement={placement.side} style={{ '--fac-options-height': `${placement.height}px` }}>
        <div id="facility-options" role="listbox" aria-label="Facilities by chapter">{facilityChapters.map(chapter => {
          const items = results.filter(item => item.chapter === chapter.id);
          return items.length > 0 && <div key={chapter.id} role="group" aria-labelledby={`facility-options-${chapter.id}`}><p id={`facility-options-${chapter.id}`} className="fac-finder__group">{chapter.name}</p>{items.map(item => <div id={`facility-option-${item.id}`} key={item.id} role="option" aria-selected={results[active]?.id === item.id} className={results[active]?.id === item.id ? 'is-active' : ''} onMouseDown={event => event.preventDefault()} onClick={() => select(item)}>{item.name}{item.parentId && <span>Laboratories</span>}<span aria-hidden="true">↗</span></div>)}</div>;
        })}</div>
        {!results.length && <div className="fac-finder__empty"><p>No matching facility. Try “books”, “computer” or “rest”.</p><button type="button" onClick={() => { setQuery(''); setActive(-1); input.current.focus(); }}>Show all facilities</button></div>}
        <p className="fac-finder__count" role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? 'destination' : 'destinations'}</p>
      </div>
    </div>
  </div>;
}
