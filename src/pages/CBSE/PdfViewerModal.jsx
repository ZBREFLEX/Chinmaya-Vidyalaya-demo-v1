import { useEffect, useRef } from 'react';
import './PdfViewerModal.css';

export default function PdfViewerModal({ document: doc, onClose, returnToRef }) {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!doc) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const originalOverflow = document.body.style.overflow;
    const returnElement = returnToRef?.current;
    document.body.style.overflow = 'hidden';

    if (!dialog.open) {
      dialog.showModal();
    }
    closeBtnRef.current?.focus();

    return () => {
      if (dialog?.open) {
        dialog.close();
      }
      document.body.style.overflow = originalOverflow;
      returnElement?.focus({ preventScroll: true });
    };
  }, [doc, returnToRef]);

  if (!doc) return null;

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), iframe'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="pdf-modal"
      aria-labelledby="pdf-modal-title"
      role="dialog"
      aria-modal="true"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
    >
      <div className="pdf-modal__shell">
        <header className="pdf-modal__header">
          <div className="pdf-modal__title-group">
            <span className="pdf-modal__badge" aria-hidden="true">PDF</span>
            <div className="pdf-modal__headings">
              <span className="pdf-modal__category">
                Doc #{String(doc.number).padStart(2, '0')} · {doc.category} · {doc.fileSize}
              </span>
              <h2 id="pdf-modal-title" className="pdf-modal__title">
                {doc.title}
              </h2>
            </div>
          </div>

          <div className="pdf-modal__actions">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-modal__tab-btn"
              title="Open document in a new browser tab"
            >
              <span>Open in tab</span>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d="M6 3h7v7M13 3 5 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a
              href={doc.fileUrl}
              download={doc.downloadName}
              className="button button--primary pdf-modal__download-btn"
              title={`Download original file (${doc.fileSize})`}
            >
              <span>Download PDF</span>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d="M8 2v9m0 0 3.5-3.5M8 11 4.5 7.5M2 14h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <button
              ref={closeBtnRef}
              type="button"
              className="pdf-modal__close-btn"
              onClick={onClose}
              aria-label="Close document viewer"
              title="Close viewer (Esc)"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="m3 3 10 10M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <main className="pdf-modal__body">
          <iframe
            src={`${doc.fileUrl}#view=FitH&toolbar=1`}
            title={`${doc.title} document viewer`}
            className="pdf-modal__iframe"
          />
        </main>

        <footer className="pdf-modal__footer">
          <p className="pdf-modal__footer-text">
            Viewing <strong>{doc.title}</strong> directly from our verified school records.
          </p>
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-modal__fallback-link"
          >
            If preview is not supported by your device, click here to open the PDF directly ↗
          </a>
        </footer>
      </div>
    </dialog>
  );
}
