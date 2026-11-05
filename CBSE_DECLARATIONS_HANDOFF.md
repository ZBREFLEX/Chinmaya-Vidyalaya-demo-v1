# CBSE declarations

Added `/cbse/declarations` using the existing CBSE document list, filters, inline PDF viewer, download controls and shared layout. The navbar's Declaration link opens this page. The result-archive entry from the legacy design points to `/academics#results`.

`src/content/cbseDeclarations.js` keeps titles, source order, descriptions, original source URLs and file hashes separate from presentation. All four supplied PDFs are copied without modification to `public/CBSE files/declarations/`. The legacy website printout is archived at `reference/declarations/old-website-declarations.pdf`.

The declarations are dated 1 June 2025; the book list is explicitly for 2025–2026. The two homework PDF pages repeat the same declaration; both original pages are retained. No scanned document has been reconstructed or edited. Source school code 75026 is used on this page; other CBSE pages' existing metadata is unchanged.

The declarations page reads the office phone from the existing `src/config/contact.js`. Contact configuration edits already in progress have not been overwritten; other CBSE pages' contact content is unchanged.

Validation: source PDFs visually inspected, including both textbook pages and both homework pages; PDF hashes verified against originals; build/lint/tests and desktop/mobile navigation, filtering, inline viewing, downloads, direct document links and history checked.

## Text Books and curriculum

The CBSE Text Books menu now opens `/cbse/text-books`, matching the two-resource structure in the supplied legacy Text Books printout. It includes the original 2025–2026 textbook PDF and an external CBSE Curriculum link opening in a new tab. The user-specified URL, `https://cbseacademic.nic.in/curriculum_2024.html`, is preserved exactly and labelled as the 2023–24 curriculum, as shown on the official linked page.

`src/content/cbseTextBooks.js` stores the link metadata and references the existing textbook document. The newly attached `(1)` PDF is byte-identical to that original, so the verified PDF is reused. The legacy Text Books printout is archived at `reference/declarations/old-website-text-books.pdf`. Desktop/mobile checks confirm the exact external link, PDF preview/download controls, navbar route and absence of horizontal overflow. Build, lint and all tests pass.
