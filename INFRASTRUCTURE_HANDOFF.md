# Infrastructure page handoff

> Route update: this content is now a section of `/incampus`. Previous page and detail URLs remain compatible. See [INCAMPUS_HANDOFF.md](INCAMPUS_HANDOFF.md) for the current composition and navigation.

## Route and navigation

`/incampus/infrastructure` (with optional trailing slash) renders one campus exploration page. The project still has no router dependency: `App.jsx` selects the page by pathname, with normal document links between pages. Deployment needs the same `index.html` fallback already required for legacy `/about` links; no server redirect rules were invented.

The shared header has an Incampus menu with direct Infrastructure, Verdant View and Facilities links. Verdant View is implemented separately at `/incampus/verdant-view`, and Facilities at `/incampus/facilities`. Existing Campus Life navigation remains available. Shared Home/About/content links point back to the homepage from Infrastructure; Contact remains local to the shared footer. The footer links to all three campus pages. No equivalent Infrastructure routes existed in the repository, so no legacy application routes required forwarding.

## Files and content

- `src/content/infrastructure.js`: single campus data model for nine locations, all original paragraphs, categories, aliases, highlights, ten photographs, source/page references, and the Main Block auditorium sublocation; shared search and hash lookup.
- `src/pages/Infrastructure/Infrastructure.jsx`: compact opening, nine-place overview, immediate search/count/reset/empty state, shared explorer, thumbnails, previous/next navigation, enquiry invitation, native dialog lightbox, and complete print-only composition.
- `src/pages/Infrastructure/Infrastructure.css`: styles scoped to the new page/lightbox, responsive grids, focus/selected states, entrance motion, selection crossfades, reduced motion and print layout.
- `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`: route, metadata and shared navigation integration.
- `public/images/infrastructure/`: ten authentic photographs extracted from the supplied PDFs. Source provenance and missing-image audit are in `reference/infrastructure/README.md`.
- `reference/infrastructure/`: all nine original PDFs and independently extracted source passages.
- `tests/infrastructure.test.js`: exact paragraph retention, search/deep-link coverage and asset/source integrity checks.

Home and About content and their interactions are retained. Enquiry buttons reuse the existing parent/student/class form and the WhatsApp number from `src/config/contact.js`. No packages were added.

## Interaction details

Main Block is the initial selection. Each record has a stable hash, for example `/incampus/infrastructure#kg-block`, `#chinmaya-saket`, or `#parking-area`. `#tapovan-maharaj-auditorium` selects Main Block, displays the auditorium photograph, and scrolls to its description. Direct loads and browser Back/Forward reveal the appropriate record below the shared header.

Explicit selections update the URL, scroll and focus the detail heading. Filtering preserves the explorer selection and URL and keeps focus in the search input. Choose another place returns to and focuses the overview heading. There is no autoplay or additional sticky navigation.

Lightbox photographs use the shared `src/components/media/PhotoLightbox.jsx` and `.css`, promoted from the original Infrastructure viewer when Verdant View was added. It retains contain sizing, captions, arrow-key image navigation, previous/next controls where applicable, focus wrapping, Escape/close, and focus/body-scroll/scroll-position restoration. Missing Saket imagery has a text-led architectural fallback. Print always includes all nine locations and ten photographs regardless of selection or search.

View Transitions crossfade the complete photo-and-description composition so titles and pictures remain paired; canceled transitions cannot overwrite a newer requested selection. CSS provides short entrance effects and an IntersectionObserver tile reveal, with visible fallback when the observer is unavailable. Reduced motion disables animations and smooth scrolling, including when changed during use.

## Source limitations

Saket has no usable photograph. The source JPEGs range from 382 × 570 to 800 × 600 and retain their available resolution. Darshan's joined `CHINMAYA DARSHANA` wording and Main Block's senior-secondary reference are retained source details; the latter conflicts with the existing homepage's Class 10 admissions range. See the source README for the full audit. No campus map, geographic adjacency or current independent verification is implied.

## Verification

Build and lint pass without warnings; all seven Node tests pass. Source comparisons retain every supplied substantive paragraph, including the auditorium and later-page continuations.

Browser checks at 1440, 768, 390 and 360px verify nine visible/discoverable places, source images, search aliases and clear/empty states, preserved selection/focus while filtering, tile/heading/URL changes, deep links to all nine places plus the auditorium, Back/Forward, sticky-header offsets, thumbnails, lightbox arrow keys/focus wrapping/Escape/restoration, missing-image fallback, the enquiry form and Incampus/shared Home/About links. No horizontal overflow or duplicate IDs was found.

Normal-motion rapid repeated selections and live reduced-motion switching were checked. Existing Home/About journeys at 1440, 768 and 390px pass, including search/dialog/history, legacy About paths and admissions anchors. Desktop/mobile page and lightbox screenshots were reviewed. Printed output was rendered and reviewed; text extraction verifies all original passages and the print DOM contains all nine records and ten photographs. Temporary QA files are under ignored `tmp/qa/` and `tmp/infrastructure/`.
