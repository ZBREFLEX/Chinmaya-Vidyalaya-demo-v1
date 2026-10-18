# Verdant View handoff

## Route and composition

`/incampus/verdant-view` (optional trailing slash) is one concise garden page using the existing pathname-based routing and shared header/footer. Incampus links directly to Infrastructure, Verdant View and Facilities. Footer navigation includes all three campus pages. Home/About links return to the homepage from either campus page; Contact stays local to the footer. Existing host fallback requirements are unchanged.

The opening introduces Where learning takes root with an authentic Nakshathravanam photograph and three plain anchor links. All three complete descriptions are visible in the document. Vegetable Garden combines its broad garden view and smaller student photograph; Herbal Garden reverses the image/text arrangement; Nakshathravanam uses a restrained blue/green composition with Birth-star plants and Dasapushpangal highlights. On mobile, Vegetable Garden text precedes the photographs and the images do not overlap. No search, filters, tabs, accordions or explorer were added.

## Files changed

- `src/pages/VerdantView/VerdantView.jsx` and `.css`: page, responsive garden stories, anchors, gentle entrances, print styles and enquiry closing. Botanical colours are scoped to this page.
- `src/content/verdantView.js`: three stable garden records with original descriptions, editorial labels, images/captions/alt text, highlights and source/page/image references.
- `src/components/media/PhotoLightbox.jsx` and `.css`: the existing Infrastructure viewer promoted to a shared component. It retains keyboard image navigation, focus containment/return, Escape/close, body-scroll restoration and full-image viewing. Both pages use it.
- `src/pages/Infrastructure/Infrastructure.jsx` and `.css`: import the shared viewer and remove its former local implementation/styles; the Infrastructure explorer is retained.
- `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`: Verdant View route, title/description and shared campus navigation.
- `public/images/verdant-view/`: four original JPEGs and four responsive WebP previews.
- `reference/verdant-view/`: all three source PDFs, independently extracted paragraph records and image provenance/source notes.
- `tests/verdantView.test.js`: full paragraph retention, continuation/naming checks, four-image completeness and original/preview/source integrity.

No packages were added. The enquiry action reuses the existing parent/student/class form and the WhatsApp destination from `src/config/contact.js`; no number is duplicated in this page.

## Interaction, motion and print

Stable anchors are `#vegetable-garden`, `#herbal-garden` and `#nakshathravanam`. Explicit anchor selections update history, position the section below the measured shared header, and focus its heading. Direct links and Back/Forward restore the appropriate section without moving focus during passive scrolling.

Opening heading lines and the photograph enter briefly. A lightweight IntersectionObserver triggers one-time heading/label and photograph entrances; the supporting photograph has a short delay. Body descriptions remain readable. Animations use 500–600ms durations and at most 14px translation. Base content is visible before/without animation, and missing/failed animation APIs leave it visible. Live reduced-motion changes cancel active garden animations.

Every photograph, including the opening image and supporting Vegetable Garden image, opens the shared viewer. Vegetable Garden has previous/next controls and arrow-key navigation for both views. Single-image gardens retain close and keyboard focus containment without unnecessary previous/next controls.

Print includes all three complete descriptions, the two cultural highlights, and all four distinct photographs. The duplicate opening photo, navigation, enquiry controls and enlargement labels are hidden.

## Assets and source uncertainties

All four source photographs are available. Originals range from 533 × 407 to 611 × 349; their dimensions and detailed provenance are recorded in `reference/verdant-view/README.md`. There are no invented garden images or missing-photo substitutions.

The source Nakshatravanam spelling is retained in the paragraph, while the requested title is Nakshathravanam. Only quotation styling and a stray space before a full stop were normalised to the user's supplied text. The complete Herbal Garden continuation is retained. Older About claims about hostel supply, plant counts and a 2018 target were not imported; the original About content remains intact. Photographs/descriptions are school source material and were not independently reverified as current.

## Validation

Build and lint pass without warnings. All nine Node tests pass, including original Infrastructure/About tests and the new garden source/asset checks.

Browser checks at 1440, 768, 390 and 360px verify all descriptions/images, responsive layout, unique IDs, no horizontal overflow, anchor offsets/history/direct links, mouse/keyboard photo viewing, both Vegetable Garden photographs, single-image focus wrapping, Escape/close/focus/body-scroll/position restoration, enquiry opening, and Incampus navigation. Desktop/mobile full-page and viewer screenshots were inspected.

Normal-motion heading/photo entrances, trailing-slash route, live reduced motion and unavailable/throwing animation API fallbacks pass. Print was rendered and inspected; extracted text retains all three source descriptions, and all four photographs are present.

Existing Home/About browser journeys pass at 1440, 768 and 390px. Infrastructure's full search/history/deep-link/lightbox/print/navigation journeys pass at 1440, 768, 390 and 360px after sharing the viewer, including rapid selections and reduced motion. Temporary QA files are under ignored `tmp/qa/` and `tmp/verdant-view/`.
