# Facilities handoff

> Route update: this content is now a section of `/incampus`. Previous page and detail URLs remain compatible. See [INCAMPUS_HANDOFF.md](INCAMPUS_HANDOFF.md) for the current composition and navigation.

## Route and composition

`/incampus/facilities` (optional trailing slash) consolidates the ten facilities into one page. Each facility has its own stable hash; individual laboratories also have hashes. No equivalent facility routes existed in the project, so no legacy application paths required forwarding. The project retains its existing pathname-based routing, normal links between pages and existing host fallback requirement.

Incampus now links directly to Infrastructure, Verdant View and Facilities. The shared footer links to all three. Existing pages and Home/About/contact navigation remain intact.

Three chapters organise content: Learning & Discovery; Sports & Play; Care & Everyday Support. The opening uses two authentic photographs. Facilities use varied compositions: a prominent Library feature, one laboratory selector, a Digital/Audio Visual pair, a broad playground composition with compact court images, and quiet Sick Bay/First Aid/Transport sections. Short descriptions are fully visible; only the longer Digital Classrooms paragraph uses a native inline disclosure.

## Files changed

- `src/content/facilities.js`: single structured source for ten facilities, six lab subentries, chapters, full source descriptions, aliases, sixteen photographs, provenance and target/search helpers.
- `src/pages/Facilities/Facilities.jsx` and `.css`: chapters, photo groups, lab selection, inline Digital disclosure, URL/history/focus behaviour, reduced-motion-aware entrances, print and closing enquiry.
- `src/pages/Facilities/FacilityFinder.jsx`: grouped searchable combobox with ten initial facility options and specific lab matches. It supports arrow/Home/End/Enter/Escape/Tab, active-option announcements, empty/reset states, pointer selection and viewport-aware dropdown placement.
- `src/App.jsx`, `src/components/layout/Navbar.jsx`, `src/components/layout/Footer.jsx`: route, metadata and direct Facilities links.
- `public/images/facilities/`: sixteen authentic full-size source photographs and sixteen responsive WebP previews.
- `reference/facilities/`: all ten original PDFs, independent source passages and image/media audit.
- `tests/facilities.test.js`: paragraph completeness, aliases/nested targets, all six labs and original/preview/source integrity.

No dependencies were added. The page reuses `components/media/PhotoLightbox` and the existing native-disclosure animation helper from About. General admissions enquiries reuse `EnquiryButton` and the single WhatsApp setting in `src/config/contact.js`. Enquire about transport links to the existing shared Contact section; no route details, phone numbers or fees were invented.

## Direct links and controls

Facility hashes: `#library`, `#laboratories`, `#audio-visual-room`, `#digital-classrooms`, `#playground`, `#basketball-court`, `#badminton-court`, `#transport`, `#apan-mithra`, `#sick-bay`.

Lab hashes: `#physics-lab`, `#chemistry-lab`, `#biology-lab`, `#mathematics-lab`, `#computer-science-lab`, `#artificial-intelligence-lab`.

Finder selection scrolls beneath the measured shared header, focuses and briefly highlights the destination, updates history, selects a specific lab when applicable, and expands Digital Classrooms when targeted. Search typing does not navigate or move focus. Empty queries list all ten facilities by chapter. Specific lab aliases take precedence over the general Laboratories result; `AI` does not match the `aid` in First Aid.

Lab buttons are a labelled group with pressed states and ordinary keyboard operation. All six labels remain visible. Selection crossfades the image/caption composition when View Transitions are available; versioned updates prevent canceled rapid selections from committing stale content. Direct loads and Back/Forward restore lab/disclosure state before scrolling. No autoplay exists.

The shared enlarged viewer supports the six-lab gallery, both badminton views, both basketball views and both playground views. It retains captions, arrow keys, previous/next where relevant, focus wrapping/return, Escape/close and body-scroll/scroll-position restoration. Digital Classrooms has only a static-photo enlargement action, despite the symbol embedded in the source pixels.

Print uses the same content, opens the complete Digital paragraph, shows all six lab panels and all sixteen distinct photographs, and hides the repeated opening images and interactive controls. The user's Digital disclosure choice is restored after printing.

## Source limitations

Audio Visual Room and Apan Mithra have no room photographs. No usable Digital Classrooms video is available. The source `800 mt. Track` measurement, current Library/Transport counts, transport operations and KG-to-Plus-Two wording require school confirmation; the original paragraphs remain intact. There is no supplied playpen photograph/equipment list. Image provenance, naming differences and all source cautions are documented in `reference/facilities/README.md`.

## Validation

Build and lint pass without warnings. All twelve Node tests pass. Independent PDF passage comparisons verify every substantive description, including later-page continuations, original quoted Sick Bay statements and the six-lab source coverage.

Browser checks at 1440, 768, 390 and 360px pass: all ten facilities, grouped combobox and keyboard commands, aliases and empty/clear/reset, `AI lab` activating Artificial Intelligence, `bus` reaching Transport, `first aid` reaching Apan Mithra, six lab selections, native disclosure, sixteen direct facility/lab links, Back/Forward, header offsets, visible keyboard focus, lightbox galleries/Escape/focus/scroll restoration, enquiry opening, static Digital media, all three Incampus links, unique IDs and no horizontal overflow.

Normal-motion checks pass for rapid lab selections, smooth finder jumps, opening/reversing the Digital disclosure, live reduced motion, print disclosure restoration and unavailable/throwing animation API fallback. Intermediate widths 1191, 1280 and 600px also have no overflow. Desktop/mobile page, finder and viewer screenshots were inspected. Printed output was rendered and inspected: four pages include every source paragraph, all six laboratory labels and all sixteen distinct photographs.

Home/About browser journeys pass at 1440, 768 and 390px. Infrastructure and Verdant View journeys pass at 1440, 768, 390 and 360px with the completed three-link Incampus menu. Temporary QA scripts, screenshots and printouts are under ignored `tmp/qa/` and `tmp/facilities/`.
