import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cbseDocuments } from '../../content/cbseDisclosure';
import PdfViewerModal from './PdfViewerModal';
import './MandatoryDisclosure.css';

export default function MandatoryDisclosure() {
  const [activeDoc, setActiveDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const triggerRefs = useRef({});
  const lastTriggerRef = useRef(null);
  const searchInputId = useId();

  // Extract categories for filter tabs
  const categories = useMemo(() => {
    const set = new Set(cbseDocuments.map(d => d.category));
    return ['All', ...Array.from(set)];
  }, []);

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
  }, [searchQuery, selectedCategory]);

  // Open PDF modal and reflect in URL
  const openPdf = (doc) => {
    lastTriggerRef.current = triggerRefs.current[doc.id];
    setActiveDoc(doc);
    const url = new URL(window.location.href);
    url.searchParams.set('doc', doc.id);
    window.history.pushState({ docId: doc.id }, '', url.toString());
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
  }, []);

  return (
    <div className="cbse-page">
      <div className="cbse-hero">
        <div className="container">
          <nav className="cbse-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true" className="cbse-breadcrumb__sep">/</span>
            <span>CBSE</span>
            <span aria-hidden="true" className="cbse-breadcrumb__sep">/</span>
            <span aria-current="location">Mandatory Public Disclosure</span>
          </nav>

          <div className="cbse-hero__content">
            <p className="eyebrow">CBSE Regulatory Compliance · Appendix IX</p>
            <h1 className="cbse-hero__title">
              Mandatory <em>Public Disclosure.</em>
            </h1>
            <p className="cbse-hero__lead">
              In accordance with the directives of the Central Board of Secondary Education (CBSE),
              Chinmaya Vidyalaya Kolazhy maintains complete transparency by making all statutory certificates,
              affiliation orders, safety reports, academic calendars, and governance records publicly available.
            </p>

            <dl className="cbse-stats" aria-label="School compliance summary">
              <div className="cbse-stat">
                <dt>Affiliation Number</dt>
                <dd>930031</dd>
              </div>
              <div className="cbse-stat">
                <dt>School Code</dt>
                <dd>75027</dd>
              </div>
              <div className="cbse-stat">
                <dt>Public Records</dt>
                <dd>14 Verified Documents</dd>
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
              View all 14 documents
            </button>
          </div>
        ) : (
          <div className="cbse-grid" role="list">
            {filteredDocuments.map((doc) => (
              <article key={doc.id} className="cbse-card" role="listitem" id={doc.id}>
                <div className="cbse-card__meta">
                  <span className="cbse-card__num">#{String(doc.number).padStart(2, '0')}</span>
                  <span className="cbse-card__category">{doc.category}</span>
                  <span className="cbse-card__size">{doc.fileSize}</span>
                </div>

                <div className="cbse-card__content">
                  <div className="cbse-card__icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 32 36" width="30" height="34" className="cbse-pdf-svg">
                      <path d="M19 2H6a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V12z" fill="#f0f7fa" stroke="#14758d" strokeWidth="1.8" />
                      <path d="M19 2v10h10" fill="none" stroke="#14758d" strokeWidth="1.8" />
                      <text x="16" y="26" textAnchor="middle" fill="#14758d" fontSize="8" fontWeight="bold" letterSpacing="0.5">PDF</text>
                    </svg>
                  </div>

                  <div className="cbse-card__info">
                    <h2 className="cbse-card__title">{doc.title}</h2>
                    <p className="cbse-card__desc">{doc.description}</p>
                  </div>
                </div>

                <div className="cbse-card__actions">
                  <button
                    ref={(el) => { triggerRefs.current[doc.id] = el; }}
                    type="button"
                    className="button button--outline cbse-card__btn cbse-card__btn--view"
                    onClick={() => openPdf(doc)}
                    aria-label={`View ${doc.title} inline`}
                  >
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                      <path d="M10 4C5 4 1.5 10 1.5 10s3.5 6 8.5 6 8.5-6 8.5-6-3.5-6-8.5-6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="10" cy="10" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    <span>View PDF</span>
                  </button>

                  <a
                    href={doc.fileUrl}
                    download={doc.downloadName}
                    className="button button--primary cbse-card__btn cbse-card__btn--download"
                    aria-label={`Download ${doc.title} original PDF (${doc.fileSize})`}
                  >
                    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                      <path d="M10 3v10m0 0 4-4m-4 4-4-4M3 16h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Download PDF</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

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
              All certificates and records displayed on this page are authentic digital copies of the original documents issued by the
              respective Government departments, educational authorities, and statutory bodies. Original physical records are available
              for inspection at the Vidyalaya Administrative Office during regular school hours.
            </p>
            <p className="cbse-notice__contact">
              For compliance enquiries or official verification requests, please write to{' '}
              <a href="mailto:chinvidhya@gmail.com">chinvidhya@gmail.com</a> or contact the office at{' '}
              <a href="tel:04872381270">0487 2381270</a>.
            </p>
          </div>
        </section>
      </main>

      {/* Integrated PDF Viewer Modal */}
      <PdfViewerModal
        document={activeDoc}
        onClose={closePdf}
        returnToRef={lastTriggerRef}
      />
    </div>
  );
}
