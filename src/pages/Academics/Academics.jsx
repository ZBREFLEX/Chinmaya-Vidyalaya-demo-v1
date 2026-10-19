import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { content, streams, categories, defaultState, readAcademicState, academicQuery, matchingResults } from '../../content/academicsModel';
import { whatsappNumber } from '../../config/contact';
import './Academics.css';

const subjects = [...new Set(content.combinations.flatMap(c => c.subjects))].filter(subject => subject !== 'Economics Psychology').sort();
const classLabels = { 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII' };
const assessmentAreas = [
  { title: 'Scholastic', text: 'Three periodic tests, half-yearly examination (VI–VIII), annual examination, notebook submission and subject enrichment activities.' },
  { title: 'Co-scholastic', text: 'Work Education, Art Education, and Health & Physical Education support the holistic development of each student.' },
  { title: 'Discipline', text: 'Attendance, sincerity, behaviour, values, tidiness, respect for rules and regulations, and attitude towards society, the nation and others.' },
];

function CombinationRows({ rows }) {
  return <ol className="academic-combinations">{rows.map(c => <li key={c.id}>
    <span className="academic-combinations__number">Combination {String(c.number).padStart(2, '0')}</span>
    <p>{c.subjects.map((subject, i) => <span key={i}>{subject}{i < c.subjects.length - 1 && <b aria-hidden="true"> / </b>}</span>)}{c.ambiguous && <sup aria-label="Source punctuation note"> *</sup>}</p>
  </li>)}</ol>;
}
function ResultTable({ rows, caption }) {
  return <table className="academic-table"><caption>{caption}</caption><thead><tr><th scope="col">Academic year</th><th scope="col">Student name</th><th scope="col">Percentage</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{r.year}</td><th scope="row">{r.name}</th><td>{r.percentage}%</td></tr>)}</tbody></table>;
}
function ResourceLink({ resource }) {
  return <a className="academic-resource" href={resource.url} target="_blank" rel="noopener noreferrer">
    <span><small>{resource.class ? `Class ${classLabels[resource.class]}${resource.stream ? ` · ${resource.stream}` : ''} · ${resource.year}` : 'Teacher professional development · Archive'}</small><strong>{resource.title}</strong>{resource.unavailable && <small className="academic-resource__status">Source link currently unavailable; please contact the school.</small>}</span>
    <span className="academic-resource__action">{resource.kind === 'folder' ? 'Open folder' : 'View document'} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></span>
    <span className="academic-print-url">{resource.url}</span>
  </a>;
}

export default function Academics() {
  const [state, setState] = useState(() => readAcademicState(window.location.search));
  const { stream: selectedStream, category: selectedCategory } = state;
  const root = useRef(null);
  const comboList = useRef(null);
  const resultList = useRef(null);
  const previous = useRef({ stream: state.stream, category: state.category });
  const frames = useRef([]);
  const scrollToSection = (id, explicit = false) => {
    frames.current.forEach(cancelAnimationFrame);
    frames.current = [requestAnimationFrame(() => frames.current.push(requestAnimationFrame(() => {
      const target = id ? document.getElementById(id) : root.current;
      if (!target) return;
      if (explicit) target.focus({ preventScroll: true });
      const behavior = explicit && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant';
      if (!id) window.scrollTo({ top: 0, behavior });
      else target.scrollIntoView({ behavior, block: 'start' });
    })))];
  };
  const update = (patch, { replace = false, hash = window.location.hash } = {}) => {
    const next = { ...state, ...patch };
    const url = `/academics${academicQuery(next)}${hash}`;
    if (url !== `${location.pathname}${location.search}${location.hash}`) history[replace ? 'replaceState' : 'pushState'](null, '', url);
    setState(next);
  };

  useLayoutEffect(() => {
    const header = document.querySelector('.navbar__inner');
    const resize = () => root.current?.style.setProperty('--academic-offset', `${Math.max(115, header.getBoundingClientRect().height + 28)}px`);
    resize();
    const observer = new ResizeObserver(resize); observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const restore = () => { setState(readAcademicState(location.search)); scrollToSection(location.hash.slice(1)); };
    const follow = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/^\/academics\/?$/.test(url.pathname)) return;
      event.preventDefault();
      if (`${location.pathname}${location.search}${location.hash}` !== `${url.pathname}${url.search}${url.hash}`) history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
      setState(readAcademicState(url.search)); scrollToSection(url.hash.slice(1), true);
    };
    restore();
    window.addEventListener('popstate', restore); window.addEventListener('hashchange', restore);
    document.addEventListener('click', follow, true);
    return () => { frames.current.forEach(cancelAnimationFrame); window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore); document.removeEventListener('click', follow, true); };
  }, []);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    if (typeof window.IntersectionObserver !== 'function') return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduced.matches || !entry.target.animate) return;
      try {
        const animation = entry.target.animate([{ opacity: .3, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 580, delay: Number(entry.target.dataset.delay || 0), easing: 'cubic-bezier(.2,.7,.2,1)' });
        animations.add(animation); animation.finished.then(() => animations.delete(animation)).catch(() => {});
      } catch { /* Content is visible without animation. */ }
    }), { threshold: .15 });
    root.current.querySelectorAll('[data-academic-reveal]').forEach(el => observer.observe(el));
    const cancel = () => animations.forEach(a => a.cancel());
    reduced.addEventListener('change', cancel); window.addEventListener('beforeprint', cancel);
    return () => { observer.disconnect(); cancel(); reduced.removeEventListener('change', cancel); window.removeEventListener('beforeprint', cancel); };
  }, []);

  useEffect(() => {
    const animations = [];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const [key, value, ref] of [['stream', selectedStream, comboList], ['category', selectedCategory, resultList]]) if (previous.current[key] !== value && ref.current?.animate) {
        try { animations.push(ref.current.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 180 })); } catch { /* Filtering works without animation. */ }
      }
    }
    previous.current = { stream: selectedStream, category: selectedCategory };
    const cancel = () => animations.forEach(a => a.cancel());
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', cancel); window.addEventListener('beforeprint', cancel);
    return () => { cancel(); media.removeEventListener('change', cancel); window.removeEventListener('beforeprint', cancel); };
  }, [selectedStream, selectedCategory]);

  useEffect(() => {
    let closed = [];
    const openForPrint = () => { closed = [...root.current.querySelectorAll('details:not([open])')]; closed.forEach(el => { el.open = true; }); };
    const restoreDetails = () => { closed.forEach(el => { el.open = false; }); closed = []; };
    window.addEventListener('beforeprint', openForPrint); window.addEventListener('afterprint', restoreDetails);
    return () => { window.removeEventListener('beforeprint', openForPrint); window.removeEventListener('afterprint', restoreDetails); };
  }, []);

  const combinations = content.combinations.filter(c => c.stream === state.stream && (!state.subject || c.subjects.includes(state.subject)));
  const papers = content.resources.filter(r => (!state.class || r.class === state.class) && (!state.paperStream || r.stream === state.paperStream));
  const results = matchingResults(state);
  const years = [...new Set(content.results.filter(r => r.category === state.category).map(r => r.year))];
  const enquiryUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Chinmaya Vidyalaya, I would like to enquire about senior secondary subject choices in the ${state.stream} stream. Please share the current combinations and admission process. Thank you.`)}`;

  return <main id="main" className="academics-page" ref={root} tabIndex={-1}>
    <header className="academic-opening academic-shell">
      <nav className="academic-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Academics</span></nav>
      <p className="eyebrow">Academics</p><h1>A foundation for<br /><em>every next step.</em></h1>
      <p className="academic-lead">From the first years of learning to senior secondary choices, discover the curriculum, assessment and academic resources at Chinmaya Vidyalaya.</p>
      <nav className="academic-shortcuts" aria-label="Academic shortcuts">{[['subject-combinations', 'Explore subject combinations'], ['question-papers', 'Find question papers'], ['assessment', 'Understand assessment'], ['results', 'View results']].map(([id, label], i) => <a key={id} href={`#${id}`}><small>0{i + 1}</small><span>{label}</span><b aria-hidden="true">↘</b></a>)}</nav>
    </header>

    <section id="curriculum" className="academic-section academic-shell" tabIndex={-1} aria-labelledby="curriculum-title">
      <div className="academic-section-heading"><p className="eyebrow">01 / The learning journey</p><h2 id="curriculum-title">Room to grow, at every stage.</h2><p>{content.curriculum.affiliation}</p></div>
      <ol className="academic-progression">{content.curriculum.stages.map((stage, i) => <li key={stage} data-academic-reveal data-delay={i * 65}><span>0{i + 1}</span><h3>{stage}</h3></li>)}</ol>
      <div className="academic-curriculum-meta"><p><strong>English</strong><span>Medium of instruction</span></p><p><strong>{content.curriculum.pattern}</strong><span>Educational pattern in the supplied curriculum</span></p><details><summary>School at a glance</summary><p>{content.curriculum.strength}</p><small>Enrolment and divisions as reported in the supplied curriculum.</small></details></div>
    </section>

    <section id="subject-combinations" className="academic-explorer academic-section" tabIndex={-1} aria-labelledby="subjects-title"><div className="academic-shell">
      <div className="academic-section-heading"><p className="eyebrow">02 / Senior secondary · XI–XII</p><h2 id="subjects-title">Find a combination<br />that speaks to you.</h2><p>Explore the subject choices listed by the school across Science, Commerce and Humanities. Confirm current availability with the school before applying.</p></div>
      <div className="academic-interactive">
        <div className="academic-streams" role="group" aria-label="Choose a stream" style={{ '--stream-index': streams.indexOf(state.stream) }}>{streams.map(stream => <button key={stream} aria-pressed={state.stream === stream} onClick={() => update({ stream, subject: '' }, { hash: '#subject-combinations' })}>{stream}<small>{content.combinations.filter(c => c.stream === stream).length} combinations</small></button>)}</div>
        <div className="academic-controls"><label>Contains subject<select aria-label="Contains subject" value={state.subject} onChange={e => update({ subject: e.target.value })}><option value="">All subjects</option>{subjects.map(s => <option key={s}>{s}</option>)}</select></label><button className="academic-reset" onClick={() => update({ stream: 'Science', subject: '' })}>Reset subject choices</button><p role="status">{combinations.length} {state.stream} combinations</p></div>
        <div ref={comboList}><CombinationRows rows={combinations} />{!combinations.length && <p className="academic-empty">No combinations match this subject in {state.stream}. Select another subject or reset your choices.</p>}</div>
      </div>
      <div className="academic-print-only">{streams.map(stream => <div key={stream}><h3>{stream}</h3><CombinationRows rows={content.combinations.filter(c => c.stream === stream)} /></div>)}</div>
      <p className="academic-note">* Three Humanities rows print “Economics Psychology” without a comma. That source wording is retained; please confirm the subject separation with the school.</p>
      <a href={enquiryUrl} target="_blank" rel="noopener noreferrer" className="academic-text-link">Enquire about subject choices <span aria-hidden="true">↗</span><span className="sr-only"> on WhatsApp (opens in a new tab)</span></a>
    </div></section>

    <section id="assessment" className="academic-section academic-shell" tabIndex={-1} aria-labelledby="assessment-title">
      <div className="academic-section-heading"><p className="eyebrow">03 / Uniform system of assessment</p><h2 id="assessment-title">Learning, seen as a whole.</h2><p>The supplied school description brings together classroom learning, co-curricular development and discipline, with assessment building towards the Class X examination.</p></div>
      <div className="academic-terms"><p><strong>Classes VI–VIII</strong><span>Term 1 and Term 2, with gradual increase in learning assessment.</span></p><p><strong>Classes IX–X</strong><span>Class IX follows a single-term evaluation pattern similar to Class X.</span></p></div>
      <div className="academic-assessment-grid">{assessmentAreas.map((area, i) => <article key={area.title} data-academic-reveal data-delay={i * 70}><span>0{i + 1}</span><h3>{area.title}</h3><p>{area.text}</p></article>)}</div>
      <details className="academic-original academic-interactive"><summary>Read the complete school assessment description</summary>{content.assessmentOriginal.map((p, i) => <p key={i}>{p}</p>)}</details>
      <div className="academic-print-only"><h3>Complete school assessment description</h3>{content.assessmentOriginal.map((p, i) => <p key={i}>{p}</p>)}</div>
    </section>

    <div className="academic-resources-band"><section id="question-papers" className="academic-section academic-shell" tabIndex={-1} aria-labelledby="papers-title">
      <div className="academic-section-heading"><p className="eyebrow">04 / Student resources</p><h2 id="papers-title">A little preparation.<br />A clearer way forward.</h2><p>Previous year question papers for Classes VI–XII. Academic year <strong>2021–2022</strong>.</p></div>
      <div className="academic-interactive"><div className="academic-controls"><label>Class<select aria-label="Class" value={state.class} onChange={e => update({ class: e.target.value }, { hash: '#question-papers' })}><option value="">All classes</option>{Object.entries(classLabels).map(([id, label]) => <option key={id} value={id}>Class {label}</option>)}</select></label><label>Stream<select aria-label="Stream" value={state.paperStream} onChange={e => update({ paperStream: e.target.value }, { hash: '#question-papers' })}><option value="">All resources</option><option>Science</option><option>Commerce</option></select></label><button className="academic-reset" onClick={() => update({ class: '', paperStream: '' })}>Reset resources</button><p role="status">{papers.length} resources</p></div>
      <div className="academic-resource-list">{papers.map(r => <ResourceLink key={r.id} resource={r} />)}{!papers.length && <p className="academic-empty">No resources match these choices. Science and Commerce entries are listed for Classes XI and XII; try all resources for other classes.</p>}</div></div>
      <div className="academic-print-only">{content.resources.map(r => <ResourceLink key={r.id} resource={r} />)}</div>
      <p className="academic-note">Folders and individual documents are retained as separate source resources. Some archived links are unavailable; contact the school if a resource does not open.</p>
    </section>
    <section id="training-programmes" className="academic-shell academic-training" tabIndex={-1} aria-labelledby="training-title"><div><p className="eyebrow">05 / Teacher development</p><h2 id="training-title">Learning continues for teachers, too.</h2><p>A record of teacher professional development from 2019–2020.</p></div><ResourceLink resource={content.training} /></section></div>

    <section id="results" className="academic-section academic-shell" tabIndex={-1} aria-labelledby="results-title">
      <div className="academic-section-heading"><p className="eyebrow">06 / Results archive</p><h2 id="results-title">Years of learning.<br />Individual achievements.</h2><p>Browse the school’s supplied CBSE examination records by group, academic year or student name.</p></div>
      <div className="academic-interactive"><div className="academic-controls academic-result-controls"><label>Examination / group<select aria-label="Examination / group" value={state.category} onChange={e => update({ category: e.target.value, year: '', limit: 8 }, { hash: '#results' })}>{categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label><label>Academic year<select aria-label="Academic year" value={state.year} onChange={e => update({ year: e.target.value, limit: 8 }, { hash: '#results' })}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></label><label>Student name<input type="search" value={state.name} placeholder="Search the archive" onChange={e => update({ name: e.target.value, limit: 8 }, { replace: true })} /></label><button className="academic-reset" onClick={() => update({ category: defaultState.category, year: '', name: '', limit: 8 })}>Clear filters</button></div>
      <p className="academic-result-count" role="status">{results.length} matching records <span>· Showing {Math.min(results.length, state.limit)}</span></p>
      <div ref={resultList}><ResultTable rows={results.slice(0, state.limit)} caption={categories.find(c => c.id === state.category).label} />{!results.length && <p className="academic-empty">No records match your search. Try another name or clear the filters.</p>}</div>
      {results.length > state.limit && <button className="button button--outline academic-show-more" onClick={() => update({ limit: state.limit + 8 })}>Show more records <span aria-hidden="true">↓</span></button>}</div>
      <div className="academic-print-only">{categories.map(c => <ResultTable key={c.id} caption={c.label} rows={content.results.filter(r => r.category === c.id)} />)}</div>
      <details className="academic-original"><summary>About these historical records</summary><p>Historical source note: “{content.historicalNote}” This describes the archive’s historical context.</p><p>Both Science entries labelled 2023–2024 are preserved as supplied. Percentages belong to individual student records. Missing years have no supplied records.</p></details>
    </section>
    <aside className="academic-closing academic-shell"><p className="eyebrow">Your next step</p><h2>Let’s talk about<br />your child’s learning.</h2><p>For current subject availability and academic guidance, get in touch with the school.</p><a className="button button--primary" href={enquiryUrl} target="_blank" rel="noopener noreferrer">Enquire on WhatsApp <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></aside>
  </main>;
}
