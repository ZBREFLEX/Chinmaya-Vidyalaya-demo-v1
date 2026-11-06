import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cbseDocuments as disclosureDocuments } from '../../content/cbseDisclosure';
import { affiliationDocuments } from '../../content/cbseAffiliation';
import { accreditationDocuments } from '../../content/cbseAccreditation';
import { declarationDocuments } from '../../content/cbseDeclarations';
import { cbseCurriculum, textBookDocuments } from '../../content/cbseTextBooks';
import { schoolPhone } from '../../config/contact';

import './MandatoryDisclosure.css';
import './DisclosureDocuments.css';

export default function MandatoryDisclosure({ section = 'disclosure' }) {
  const isTextBooks = section === 'text-books';
  const isDeclaration = section === 'declarations';
  const isAffiliation = section === 'affiliation';
  const isAccreditation = section === 'accreditation';
  const cbseDocuments = isTextBooks ? textBookDocuments : isDeclaration ? declarationDocuments : isAccreditation ? accreditationDocuments : isAffiliation ? affiliationDocuments : disclosureDocuments;
  const [activeDoc, setActiveDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const triggerRefs = useRef({});

  const searchInputId = useId();

  // Extract categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set(cbseDocuments.map(d => d.category));
    return ['All', ...Array.from(set)];
  }, [cbseDocuments]);

  // Filter documents based on query and category
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cbseDocuments.filter(doc => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch = !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, cbseDocuments]);

  // Open PDF modal and reflect in URL
  const openPdf = (doc) => {

    setActiveDoc(doc);
    const url = new URL(window.location.href);
    url.searchParams.set('doc', doc.id);
    window.history.pushState({ docId: doc.id }, '', url.toString());
    requestAnimationFrame(() => triggerRefs.current[doc.id]?.scrollIntoView({ block: 'start' }));
  };

  // Close PDF modal and remove param from URL
  const closePdf = () => {
    setActiveDoc(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('doc')) {
      url.searchParams.delete('doc');
      window.history.pushState({}, '', url.pathname + (url.search || '') + (url.hash || ''));
    }
  };

  // Handle browser back/forward and deep link on initial load
  useEffect(() => {
    const checkUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const docId = params.get('doc');
      if (docId) {
        const found = cbseDocuments.find(d => d.id === docId);
        if (found) {
          setActiveDoc(found);
          return;
        }
      }
      setActiveDoc(null);
    };

    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, [cbseDocuments]);

  return (
    <div className="cbse-page">
      <div className="cbse-hero">
        <div className="container">
          <nav className="cbse-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true" className="cbse-breadcrumb__sep">/</span>
            <span>CBSE</span>
            <span aria-hidden="true" className="cbse-breadcrumb__sep">/</span>
            <span aria-current="location">{isTextBooks ? 'Text Books' : isDeclaration ? 'Declarations' : isAccreditation ? 'Accreditation' : isAffiliation ? 'Affiliation' : 'Mandatory Public Disclosure'}</span>
          </nav>

          <div className="cbse-hero__content">
            <p className="eyebrow">{isTextBooks ? 'CBSE · Learning resources' : isDeclaration ? 'CBSE · School declarations' : 'CBSE Regulatory Compliance · Appendix IX'}</p>
            <h1 className="cbse-hero__title">
              {isTextBooks ? <>Text Books & <em>Curriculum.</em></> : isDeclaration ? <>School <em>Declarations.</em></> : isAccreditation ? <>CBSE <em>Accreditation.</em></> : isAffiliation ? <>CBSE <em>Affiliation.</em></> : <>Mandatory <em>Public Disclosure.</em></>}
            </h1>
            <p className="cbse-hero__lead">
              {isTextBooks ? 'Browse the school’s textbook list for the academic year 2025–2026, or visit the CBSE Academic website for the linked curriculum. View the original book list below or download a copy.' : isDeclaration ? 'Read the school’s declarations on homework, single-shift operation and science practicals, alongside the textbook list for 2025–2026. Select a document to view the original signed copy or download it.' : isAccreditation ? 'Browse school information and staff records, including non-teaching staff and primary and nursery teaching staff lists for 2025–2026. Select a document below to read it or download a copy.' : isAffiliation ? 'Browse our affiliation supporting documents, governing body record, textbook list, land document, affidavits and sample transfer certificate. Select a document below to read it or download a copy.' : <>In accordance with the directives of the Central Board of Secondary Education (CBSE),
              Chinmaya Vidyalaya Kolazhy maintains complete transparency by making all statutory certificates,
              affiliation orders, safety reports, academic calendars, and governance records publicly available.</>}
            </p>

            <dl className="cbse-stats" aria-label="School compliance summary">
              <div className="cbse-stat">
                <dt>Affiliation Number</dt>
                <dd>930031</dd>
              </div>
              <div className="cbse-stat">
                <dt>School Code</dt>
                <dd>{isDeclaration || isTextBooks ? '75026' : '75027'}</dd>
              </div>
              <div className="cbse-stat">
                <dt>Public Records</dt>
                <dd>{cbseDocuments.length} {cbseDocuments.length === 1 ? 'Document' : 'Documents'}</dd>
              </div>
              <div className="cbse-stat">
                <dt>Format</dt>
                <dd>Official Signed PDFs</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <main id="main" className="cbse-main container">
        <section className="cbse-controls-bar" aria-label="Filter and search documents">
          <div className="cbse-search-box">
            <label htmlFor={searchInputId} className="sr-only">Search disclosure documents</label>
            <div className="cbse-search-input-wrap">
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="cbse-search-icon">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m13.5 13.5 4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                id={searchInputId}
                type="search"
                className="cbse-search-input"
                placeholder="Search documents by title, keyword or category…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="cbse-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search text"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="cbse-category-pills" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`cbse-pill ${selectedCategory === cat ? 'is-active' : ''}`}
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="cbse-status-row" aria-live="polite">
            <span className="cbse-count-text">
              Showing <strong>{filteredDocuments.length}</strong> of {cbseDocuments.length} documents
              {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
              {searchQuery && <span> matching “{searchQuery}”</span>}
            </span>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                className="cbse-reset-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        </section>

        {filteredDocuments.length === 0 ? (
          <div className="cbse-empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="#a2bcc9" strokeWidth="1.5" />
              <path d="M14 2v6h6M9 15h6M9 11h6" fill="none" stroke="#a2bcc9" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h3>No matching documents found</h3>
            <p>We couldn't find any documents matching “{searchQuery}”. Please check your spelling or clear the filter.</p>
            <button
              type="button"
              className="button button--outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              View all {cbseDocuments.length} documents
            </button>
          </div>
        ) : (
          <div className="cbse-document-list" role="list">
            {filteredDocuments.map(doc => {
              const isOpen = activeDoc?.id === doc.id;
              return <article key={doc.id} className={`cbse-document ${isOpen ? 'is-open' : ''}`} role="listitem" id={doc.id}>
                <h2 className="cbse-document__heading">
                  <button ref={el => { triggerRefs.current[doc.id] = el; }} type="button" className="cbse-document__trigger" aria-expanded={isOpen} aria-controls={`pdf-panel-${doc.id}`} onClick={() => isOpen ? closePdf() : openPdf(doc)}>
                    <span className="cbse-document__name">{doc.title}</span>
                    <svg className="cbse-document__chevron" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>
                  </button>
                </h2>
                <div id={`pdf-panel-${doc.id}`} hidden={!isOpen} className="cbse-document__panel">
                  {isOpen && <>
                    <p className="cbse-document__description">{doc.description}</p>
                    <div className="cbse-pdf-shell">
                      <div className="cbse-document__toolbar"><span><strong>PDF document</strong>{doc.category} · {doc.fileSize}</span><div><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Open in new tab ↗</a><a href={doc.fileUrl} download={doc.downloadName}>Download PDF ↓</a></div></div>
                      <iframe key={doc.id} className="cbse-document__viewer" src={`${doc.fileUrl}#toolbar=0&navpanes=0&pagemode=none&view=FitH&zoom=page-width`} title={doc.title} width="100%" height="900" />
                    </div>
                    <p className="cbse-document__hint">Scroll inside the document to read all pages. If the preview is unavailable, <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">open the PDF in a new tab</a>.</p>
                  </>}
                </div>
              </article>;
            })}
          </div>
        )}

        {isTextBooks && <section className="cbse-notice" aria-labelledby="cbse-curriculum-title">
          <div className="cbse-notice__content">
            <h2 id="cbse-curriculum-title">{cbseCurriculum.title}</h2>
            <p>{cbseCurriculum.description}</p>
            <a className="button button--outline" href={cbseCurriculum.url} target="_blank" rel="noopener noreferrer">View CBSE Curriculum <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </section>}

        {isDeclaration && <section className="cbse-notice" aria-labelledby="declaration-results-title">
          <div className="cbse-notice__content">
            <h2 id="declaration-results-title">Results archive</h2>
            <p>Explore the school’s examination results in our Academics section.</p>
            <a className="button button--outline" href="/academics#results">View results archive <span aria-hidden="true">↗</span></a>
          </div>
        </section>}

        <section className="cbse-notice" aria-label="Official verification advisory">
          <div className="cbse-notice__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M12 16v-4m0-4h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="cbse-notice__content">
            <h3>Authenticity & Office Verification</h3>
            <p>
              {isTextBooks ? 'The textbook PDF is the school’s supplied 2025–2026 list. Curriculum resources open on the official CBSE Academic website.' : isDeclaration ? 'The PDFs on this page are the supplied signed school declarations and textbook list. Please contact the school office for enquiries or verification.' : <>All certificates and records displayed on this page are authentic digital copies of the original documents issued by the
              respective Government departments, educational authorities, and statutory bodies. Original physical records are available
              for inspection at the Vidyalaya Administrative Office during regular school hours.</>}
            </p>
            <p className="cbse-notice__contact">
              For compliance enquiries or official verification requests, please write to{' '}
              <a href="mailto:chinvidhya@gmail.com">chinvidhya@gmail.com</a> or contact the office at{' '}
              <a href={isDeclaration || isTextBooks ? `tel:${schoolPhone.replace(/[^+\d]/g, '')}` : 'tel:0487220439'}>{isDeclaration || isTextBooks ? schoolPhone : '0487 2381270'}</a>.
            </p>
          </div>
        </section>
      </main>


    </div>
  );
}
