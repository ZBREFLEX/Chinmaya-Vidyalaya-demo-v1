import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import content from '../../content/about.json';
import { detailTargets, peopleGroups, ruleTopics, uniformGroups, visionMaterial } from '../../content/aboutModel';
import campus from '../../assets/images/hero/campus.jpeg';
import AboutSearch from './AboutSearch';
import { disclosureIsOpen, setDisclosureOpen, useStoryMotion } from './aboutMotion';
import './About.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function Photo({ photo }) { return <figure className="staff-group-photo"><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" /><figcaption>{photo.caption}</figcaption></figure>; }
function Prose({ paragraphs }) { return paragraphs.map((text, index) => <p key={index}>{text}</p>); }
function StoryPassage({ text }) {
  const words = text.match(/\S+\s*/g) || [];
  const length = Math.ceil(words.length / 3);
  return <p className="story-passage" data-story-reveal>{Array.from({ length: 3 }, (_, index) => <span key={index} style={{ '--phrase-delay': `${index * 100}ms` }}>{words.slice(index * length, (index + 1) * length).join('')}</span>)}</p>;
}
function Disclosure({ id, title, children, collapseLabel }) {
  const details = useRef(null);
  const collapse = () => {
    setDisclosureOpen(details.current, false);
    const control = details.current.querySelector('summary');
    control.focus({ preventScroll: true });
    control.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
  };
  return <details id={id} ref={details} className="about-details"><summary onClick={event => { event.preventDefault(); setDisclosureOpen(details.current, !disclosureIsOpen(details.current)); }}>{title}<svg className="disclosure-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></summary><div className="details-content">{children}{collapseLabel && <button type="button" className="about-link-button collapse-detail" onClick={collapse}>{collapseLabel}<span aria-hidden="true">↑</span></button>}</div></details>;
}
function Directory({ records, print = false }) { return <dl className="about-directory">{records.map(record => <div key={record.id} id={print ? undefined : record.id} tabIndex={print ? undefined : -1} className="detail-target"><dt>{record.name}</dt><dd>{record.role}</dd></div>)}</dl>; }

export default function About() {
  const [timeline, setTimeline] = useState(0);
  const [pillar, setPillar] = useState(0);
  const [group, setGroup] = useState('administration');
  const [personQuery, setPersonQuery] = useState('');
  const [gender, setGender] = useState('girls');
  const [schoolClass, setSchoolClass] = useState('6');
  const [pending, setPending] = useState(null);
  const [floating, setFloating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const page = useRef(null);
  const searchArea = useRef(null);
  const dialog = useRef(null);
  const floatingTrigger = useRef(null);
  const lastFocus = useRef(null);
  const oldOverflow = useRef('');
  const policyArea = useRef(null);
  const selectedUniform = uniformGroups.find(item => item.gender === gender && item.classes.includes(schoolClass));
  useStoryMotion(page, pillar);

  const closeSearch = useCallback((restoreFocus = true) => {
    if (!dialog.current?.open) return;
    dialog.current.close();
    document.body.style.overflow = oldOverflow.current;
    setDialogOpen(false);
    if (restoreFocus) requestAnimationFrame(() => lastFocus.current?.focus({ preventScroll: true }));
  }, []);
  const openSearch = useCallback(() => {
    if (dialog.current.open) return;
    lastFocus.current = document.activeElement;
    oldOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    setDialogOpen(true);
    dialog.current.querySelector('input')?.focus();
  }, []);

  const reveal = useCallback((id, options = {}) => {
    const { focus = true, scroll = true, updateUrl = true } = options;
    const state = detailTargets[id]?.state || {};
    closeSearch(false);
    if (state.timeline !== undefined) setTimeline(state.timeline);
    if (state.pillar !== undefined) setPillar(state.pillar);
    if (state.group) { setGroup(state.group); setPersonQuery(''); }
    if (state.uniform !== undefined) {
      const selection = uniformGroups[state.uniform];
      setGender(selection.gender);
      setSchoolClass(selection.classes.find(c => !['lkg', 'ukg'].includes(c)) || selection.classes[0]);
    }
    if (updateUrl && window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    setPending({ id, focus, scroll });
  }, [closeSearch]);

  useLayoutEffect(() => {
    if (!pending) return;
    const pageElement = page.current;
    const target = document.getElementById(pending.id);
    if (!target) return;
    if (pending.focus) pageElement.classList.add('search-revealing');
    if (target.tagName === 'DETAILS') setDisclosureOpen(target, true, { immediate: true });
    const required = detailTargets[pending.id]?.state.disclosure;
    if (required) setDisclosureOpen(document.getElementById(required), true, { immediate: true });
    // Native disclosures expose their full layout immediately; wait for panel state to commit.
    for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS') setDisclosureOpen(ancestor, true, { immediate: true });
    }
    let secondFrame;
    let highlightTimer;
    let revealTimer;
    const frame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(() => {
      if (pending.scroll) target.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' });
      if (pending.focus) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.classList.remove('destination-highlight');
        void target.offsetWidth;
        target.classList.add('destination-highlight');
        highlightTimer = window.setTimeout(() => target.classList.remove('destination-highlight'), 1800);
        revealTimer = window.setTimeout(() => pageElement.classList.remove('search-revealing'), 300);
      }
    }); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(secondFrame); window.clearTimeout(highlightTimer); window.clearTimeout(revealTimer); target.classList.remove('destination-highlight'); pageElement.classList.remove('search-revealing'); };
  }, [pending]);

  useEffect(() => {
    const searchDialog = dialog.current;
    const header = document.querySelector('.navbar');
    const updateOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      page.current.style.setProperty('--header-offset', `${height}px`);
      document.documentElement.style.setProperty('--about-header-offset', `${height}px`);
    };
    const resize = new ResizeObserver(updateOffset);
    resize.observe(header); updateOffset();
    const fromHash = () => {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (id) reveal(id, { focus: false, updateUrl: false });
      else {
        setTimeline(0); setPillar(0); setGroup('administration'); setGender('girls'); setSchoolClass('6'); setPersonQuery('');
        page.current.querySelectorAll('details').forEach(el => setDisclosureOpen(el, false, { immediate: true }));
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('popstate', fromHash);
    let frame;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const footerVisible = document.querySelector('.site-footer').getBoundingClientRect().top < window.innerHeight;
        setFloating(!footerVisible && searchArea.current.getBoundingClientRect().bottom < header.getBoundingClientRect().bottom + 20);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    const shortcut = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.target.closest('input, textarea, select, [contenteditable="true"]')) {
        event.preventDefault(); openSearch();
      }
    };
    document.addEventListener('keydown', shortcut);
    let printState = [];
    const beforePrint = () => {
      printState = [...page.current.querySelectorAll('details')].map(el => [el, disclosureIsOpen(el)]);
      printState.forEach(([el]) => setDisclosureOpen(el, true, { immediate: true }));
    };
    const afterPrint = () => printState.forEach(([el, open]) => setDisclosureOpen(el, open, { immediate: true }));
    window.addEventListener('beforeprint', beforePrint); window.addEventListener('afterprint', afterPrint);
    return () => {
      resize.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', fromHash); window.removeEventListener('popstate', fromHash);
      window.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', shortcut);
      window.removeEventListener('beforeprint', beforePrint); window.removeEventListener('afterprint', afterPrint);
      if (searchDialog.open) document.body.style.overflow = oldOverflow.current;
    };
  }, [reveal, openSearch]);

  const chooseUniform = (nextGender, nextClass) => {
    setGender(nextGender); setSchoolClass(nextClass);
    const selection = uniformGroups.find(item => item.gender === nextGender && item.classes.includes(nextClass));
    window.history.pushState(null, '', `#${selection.id}`);
  };
  const keepSearchFocus = event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button, input, select, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return <><section id="about" className="about-page" ref={page} aria-labelledby="about-title">
    <div className="about-opening-surface"><div className="about-opening container" data-story-reveal>
      <div className="about-opening-copy"><nav className="about-breadcrumb" aria-label="Breadcrumb"><a href="#home">Home</a><span aria-hidden="true">/</span><span aria-current="location">About</span></nav><p className="eyebrow">About Chinmaya</p><h2 id="about-title"><span className="opening-line">A school story.</span><span className="opening-line"><em>Rooted in values.</em></span></h2><p className="opening-introduction">Since 1979, Chinmaya Vidyalaya, Kolazhy has brought together knowledge, Indian culture and a spirit of service. Discover the people, ideas and everyday traditions that help every child grow.</p><dl className="school-facts"><div><dt>Founded</dt><dd>1979</dd></div><div><dt>Our home</dt><dd>Kolazhy, Thrissur</dd></div><div><dt>Our motto</dt><dd>Keep Smiling</dd></div></dl></div>
      <figure className="about-opening-photo"><img src={campus} alt="The tree-lined courtyard at Chinmaya Vidyalaya, Kolazhy" width="1280" height="963" /><figcaption>Chinmaya Gardens · A place to learn and belong</figcaption></figure>
    </div></div>

    <section className="find-section container" ref={searchArea} aria-label="Find school information"><AboutSearch onNavigate={reveal} /></section>

    <section id="story" className="about-scene story-scene container" aria-labelledby="story-title">
      <div className="story-layout"><div><p className="eyebrow">01 / Our story</p><h2 id="story-title">Small beginnings.<br /><em>Lasting purpose.</em></h2><p>A school founded to carry forward H.H. Swami Chinmayananda’s vision of “catching them young”, with learning that nurtures the whole child.</p><a href="#full-story" className="about-text-link" onClick={event => { event.preventDefault(); reveal('story-detail-1'); }}>Discover the full story <span aria-hidden="true">↓</span></a></div><div className="timeline-explorer" data-story-reveal><div className="year-controls" role="group" aria-label="Choose a school milestone">{content.milestones.map(([year], index) => <button type="button" key={year} data-milestone={`milestone-${index + 1}`} style={{ '--year-delay': `${index * 55}ms` }} aria-pressed={timeline === index} onClick={() => reveal(`milestone-${index + 1}`, { focus: false, scroll: false })}>{year}</button>)}</div><div className="timeline-panels">{content.milestones.map(([year, title, text], index) => <article id={`milestone-${index + 1}`} tabIndex={-1} className="timeline-panel detail-target interactive-panel" key={year} hidden={timeline !== index} aria-hidden={timeline !== index}><span className="timeline-date">{year}</span><h3>{title}</h3><p>{text}</p></article>)}</div><p className="timeline-caption">Select a year to explore a chapter of our journey.</p></div></div>
      <Disclosure id="full-story" title="Read the full school story" collapseLabel="Collapse the full story"><div className="reading-column"><p className="historical-context">Our recorded history includes an ISO 9001:2008 milestone in December 2009.</p>{content.story.map(({ title, paragraphs }, index) => <article id={`story-detail-${index + 1}`} tabIndex={-1} className="prose-group detail-target" key={title}><h3>{title}</h3><Prose paragraphs={paragraphs} /></article>)}</div></Disclosure>
      <StoryPassage text={content.vision.introduction[1].split('. ').at(-1)} />
    </section>

    <section id="vision" className="about-scene vision-scene" aria-labelledby="vision-title"><div className="container">
      <div className="motto-centrepiece" data-story-reveal><div><p className="eyebrow">02 / Our motto & vision</p><h2 id="motto" className="detail-target" tabIndex={-1}><span className="motto-mask">“Keep <em className="smiling-word">Smiling<svg className="motto-underline" viewBox="0 0 120 14" aria-hidden="true"><path d="M2 10 Q60 1 118 9" pathLength="1" /></svg></em>”</span></h2><p>A simple motto at the heart of a School With A Difference.</p></div><div className="motto-gesture" aria-hidden="true"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="15" /><path d="M40 4v12m0 48v12M4 40h12m48 0h12M14 14l9 9m34 34 9 9M14 66l9-9m34-34 9-9" /></svg><span>Learning.<br />Growing.<br />Together.</span></div></div>
      <div className="vision-heading"><h3 id="vision-title">Four pillars. One view of life.</h3><p>The Chinmaya Vision Programme brings together integrated development, Indian culture, patriotism and a universal outlook.</p></div>
      <div className="pillar-explorer" data-story-reveal><div className="pillar-controls" role="group" aria-label="Explore the vision pillars"><span className="pillar-indicator" aria-hidden="true" />{content.vision.pillars.map(({ title }, index) => <button key={title} type="button" style={{ '--pillar-delay': `${index * 65}ms` }} aria-pressed={pillar === index} onClick={() => reveal(`pillar-${index + 1}`, { focus: false, scroll: false })}><span>0{index + 1}</span><span className="pillar-title">{title}</span><span aria-hidden="true">↗</span></button>)}</div><div className="pillar-panels">{content.vision.pillars.map(({ title, intro, parts }, index) => <article id={`pillar-${index + 1}`} tabIndex={-1} key={title} hidden={pillar !== index} className="pillar-panel detail-target interactive-panel"><p className="eyebrow">Pillar 0{index + 1}</p><h3>{title}</h3><p>{intro}</p>{parts.length > 0 && <Disclosure id={`pillar-more-${index + 1}`} title="Explore physical, mental, intellectual & spiritual development">{parts.map((part, j) => <div id={`pillar-${index + 1}-part-${j + 1}`} tabIndex={-1} key={part.title} className="prose-group detail-target"><h4>{part.title}</h4><p>{part.text}</p></div>)}</Disclosure>}</article>)}</div></div>
      <div className="vision-reading">{visionMaterial.map(([id, title, paragraphs]) => <Disclosure key={id} id={id} title={title}><div id={`${id}-text`} tabIndex={-1} className="reading-column detail-target">{id === 'vision-environment' && <p className="historical-context">This recorded vision includes a garden target set for the end of 2018.</p>}{id === 'vision-aims' ? <ul className="about-list">{paragraphs.map(text => <li key={text}>{text}</li>)}</ul> : <Prose paragraphs={paragraphs} />}</div></Disclosure>)}</div>
      <StoryPassage text={content.principal[5]} />
    </div></section>

    <section id="principal" className="about-scene principal-scene container" aria-labelledby="principal-title"><div className="principal-message" data-story-reveal><figure><img src="/images/about/principal.png" alt="Bini M., Principal of Chinmaya Vidyalaya Kolazhy, in her office" width="300" height="214" loading="lazy" /><figcaption>Bini M.<span>Principal</span></figcaption></figure><div><p className="eyebrow">03 / A message from our principal</p><h2 id="principal-title">Lighting the lamp<br />in every child.</h2><div className="principal-reading"><p className="principal-excerpt">{content.principal[1]}</p><Disclosure id="principal-message" title="Read the complete message" collapseLabel="Close the complete message"><div id="principal-letter" tabIndex={-1} className="detail-target principal-letter"><Prose paragraphs={content.principal.slice(0, -1)} /><p className="principal-signoff">With warm regards,<br /><strong>Bini M</strong><br />Principal</p></div></Disclosure></div></div></div></section>

    <section id="staff" className="about-scene people-scene container" aria-labelledby="people-title"><div className="people-overview" data-story-reveal><div><p className="eyebrow">04 / Our people</p><h2 id="people-title">The people behind<br /><em>every school day.</em></h2><p>A community of educators and colleagues, working together in the everyday life of the Vidyalaya.</p></div><Photo photo={content.staffPhotos.staff} /></div><dl className="leaders-overview" data-story-reveal>{content.leaders.map(({ name, role }, index) => <div key={role} style={{ '--leader-delay': `${index * 65}ms` }}><dt>{name}</dt><dd>{role}</dd></div>)}</dl>
      <Disclosure id="people-directory" title="Explore our people" collapseLabel="Close the directory"><div className="directory-controls" role="group" aria-label="People directory groups">{peopleGroups.map(item => <button type="button" key={item.id} aria-pressed={group === item.id} onClick={() => reveal(item.id, { focus: false, scroll: false })}>{item.title}</button>)}</div><form className="directory-search" role="search" onSubmit={event => event.preventDefault()}><label htmlFor="person-search">Search by name, department or role</label><div><input id="person-search" type="search" value={personQuery} onChange={event => setPersonQuery(event.target.value)} placeholder="For example: Bini, librarian, English" /><button type="button" onClick={() => setPersonQuery('')} disabled={!personQuery}>Reset search</button></div></form>
        {peopleGroups.map(item => {
          const records = item.records.filter(record => `${record.name} ${record.role}`.toLowerCase().includes(personQuery.trim().toLowerCase()));
          return <article id={item.id} tabIndex={-1} key={item.id} className="directory-panel detail-target interactive-panel" hidden={group !== item.id}><h3>{item.label}</h3>{item.id === 'management' && <><div id="management-introduction" tabIndex={-1} className="detail-target"><p>{content.story[0].paragraphs[0]}</p><p className="historical-context">The committee below is recorded for 2023–2024.</p></div><a className="about-text-link" href={content.managementUrl} target="_blank" rel="noreferrer">View management details · 2023–24 (PDF)<span aria-hidden="true">↗</span><span className="sr-only">, opens in a new tab</span></a></>}{item.id === 'non-teaching' && <Photo photo={content.staffPhotos.nonTeaching} />}<p className="directory-count" role={group === item.id ? 'status' : undefined}>{records.length} of {item.records.length} people</p><div className="screen-directory" key={personQuery}><Directory records={records} /></div><div className="print-directory"><Directory records={item.records} print /></div>{!records.length && <p className="directory-empty">No matching people in {item.title.toLowerCase()}. Try another name or role, reset your search, or select another group.</p>}</article>;
        })}
      </Disclosure>
    </section>

    <section id="rules" className="about-scene essentials-scene" aria-labelledby="rules-title"><div className="container"><div className="essentials-heading"><div><p className="eyebrow">05 / Parent essentials</p><h2 id="rules-title">A little clarity for<br /><em>everyday school life.</em></h2></div><p>Find the right uniform, plan the school day, and read the guidelines that help our community work together.</p></div>
      <div className="uniform-guide"><div className="uniform-heading"><h3>Uniform guide</h3><p>Choose your child’s class to see the applicable instructions.</p></div><div className="uniform-controls"><div className="gender-controls" role="group" aria-label="Uniform group">{['girls', 'boys'].map(value => <button type="button" key={value} aria-pressed={gender === value} onClick={() => chooseUniform(value, schoolClass)}>{value === 'girls' ? 'Girls' : 'Boys'}</button>)}</div><div><label htmlFor="uniform-class">Class</label><select id="uniform-class" value={schoolClass} onChange={event => chooseUniform(gender, event.target.value)}>{['lkg', 'ukg', ...Array.from({ length: 12 }, (_, i) => String(i + 1))].map(value => <option value={value} key={value}>{['lkg', 'ukg'].includes(value) ? value.toUpperCase() : `Class ${value}`}</option>)}</select></div></div>
      {uniformGroups.map(selection => <article id={selection.id} tabIndex={-1} key={selection.id} hidden={selectedUniform.id !== selection.id} className="uniform-panel detail-target interactive-panel"><h4>{selection.title}</h4><div className="uniform-layout"><ul className="about-list">{selection.items.map((text, i) => <li id={`${selection.id}-instruction-${i + 1}`} data-source-id={`uniform:${selection.index + 1}:${i + 1}`} key={i}>{text}</li>)}</ul><div className="uniform-images"><img src={selection.image} alt={`${selection.title}: official uniform illustration`} width="322" height="411" loading="lazy" />{selection.additionalImage && <img src={selection.additionalImage} alt={`${selection.title}: additional uniform photograph`} width="322" height="411" loading="lazy" />}</div></div>{selection.index === 2 && <p className="policy-clarification">The wording “Black shoes season” appears in the school’s uniform instructions. Please contact the school for clarification.</p>}</article>)}
      </div>
      <div className="policy-heading"><h3>School guidelines</h3><div className="rules-actions"><button type="button" onClick={() => policyArea.current.querySelectorAll('details').forEach(el => setDisclosureOpen(el, true))}>Expand all</button><button type="button" onClick={() => policyArea.current.querySelectorAll('details').forEach(el => setDisclosureOpen(el, false))}>Collapse all</button><button type="button" onClick={() => window.print()}>Print all details <span aria-hidden="true">↗</span></button></div></div><div ref={policyArea}>{ruleTopics.map(topic => <Disclosure key={topic.id} id={`rules-${topic.id}`} title={topic.title}><ol className="about-list policy-list">{topic.rules.map(rule => <li id={rule.id} tabIndex={-1} data-source-ids={rule.sourceIds.join(' ')} key={rule.id} className="detail-target">{rule.text}</li>)}</ol></Disclosure>)}</div>
      <Disclosure id="school-day" title="School hours & senior secondary streams"><article id="school-day-text" className="detail-target" tabIndex={-1}><Prose paragraphs={content.story[5].paragraphs} /></article></Disclosure>
    </div></section>


    <button ref={floatingTrigger} type="button" className="floating-find button button--primary" hidden={!floating || dialogOpen} onClick={openSearch} aria-haspopup="dialog">Find information <span aria-hidden="true">⌕</span></button>
  </section>
  <dialog ref={dialog} className="search-dialog" aria-labelledby="search-dialog-title" onKeyDown={keepSearchFocus} onCancel={event => { event.preventDefault(); closeSearch(); }}><div className="dialog-heading"><h2 id="search-dialog-title">Find information</h2><button type="button" onClick={() => closeSearch()} aria-label="Close search">✕</button></div><AboutSearch dialog autoFocus onNavigate={reveal} /></dialog>
  </>;
}
