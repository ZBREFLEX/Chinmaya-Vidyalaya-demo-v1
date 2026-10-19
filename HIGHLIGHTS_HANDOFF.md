# Achievements and Event Gallery

Implemented in the existing React/Vite site; no deployment or new runtime dependency.

## Routes and content

- `/achievements`: compact introduction, three dataset-backed featured recognitions, search/category/year filters, six initial records, Show more, accessible record reader.
- `/achievements?achievement=<slug>#browse-achievements`: stable achievement link, including records outside the current results.
- `/campus-life#event-gallery`: photographic album view within Campus Life; linked from its opening and shared navigation dropdown.
- `/campus-life?story=<slug>#event-gallery`: existing Campus Life reader and story URL convention, shared by gallery and archive.
- Navbar Achievements labels, footer and homepage achievement CTA lead to the new page. No Highlights menu. Existing pages and the Academics results archive are preserved.

49 achievement records contain 40 unique images: 27 original posters and 13 photographs. Event Gallery adds 24 events, 20 photographs across 17 photo albums, and eight unique videos. Seven events are video-only; Ganesh Chathurthi has both a photograph and video. Campus Life now contains 182 records, including all 158 original stories unchanged.

`src/content/achievements.json` holds recognitions. Gallery events extend `src/content/campusLife.json`, with `gallery: true`; no parallel event database. Both views reference these same records. Dates remain explicit or unknown; dated editions of Annual Day, Talent Time, Book Fair and MUN remain separate. No identical existing gallery photograph or exact event report was found. The two Ruby Jubilee finale reports link to one another; no unverified achievement/event relationship was inferred.

## Sources and inventory

Unchanged supplied PDFs are in `reference/highlights/`: 42 Achievements pages and 19 Event Gallery pages. All 61 pages were extracted and visually inspected through rendered pages/contact sheets; poster details were transcribed from original embedded images, not inferred from thumbnails alone.

- `extracted.json`: every page, raw text/line geometry, embedded-image locations and hyperlink annotations.
- `inventory.json`: record/media associations and retained source descriptions.
- `page-audit.json`: all 61 pages, including section introductions and terminal print chrome.
- `text-audit.json`: each substantive report line mapped to a record.
- `video-checks.json`: YouTube oEmbed responses and thumbnail HTTP checks for all eight destinations.
- `public/images/highlights/`: unchanged original JPEGs, WebP derivatives at no greater than native dimensions, and actual downloaded video thumbnails.

The repeated SSCT Cricket heading/photo is one recognition; both image rectangles remain in provenance. Repeated Kho-Kho headings, team photo and poster are one achievement. Two Artificial Intelligence centum posters belong to one recognition with all verified names. Generic “Congratulations” headings are section introductions, not extra awards. Poster-only entries are represented individually.

The source’s nine video players resolve to eight unique IDs. All 18 hyperlink annotations are retained with PDF rectangles and labels. `XRMB6tqV1W8` occurs under both “Evening Coaching Camp Inauguration” and “Student Council Election”; player text and live school-channel oEmbed identify **Student Council Election 2025**. One canonical video retains all four annotation references and the incorrect heading as an alias/note.

## Accuracy and outstanding review

- Page 7 Class X “90% and above” has a dense portrait roster. Its heading, academic year and recognition are verified; individual roster names are not fully transcribed. The original poster remains accessible. Do not substitute guessed names.
- Pages 38–39 Under-14 cricket: source prose spells Akarsh A Krishnamoorthy / Sumit Chakraborty; poster spells Akarsh A Krishnamurthy (7B) / Sumith Chakravarthy (8A). Both forms are documented; no preferred spelling is asserted. The prose’s `2016-1017` is preserved as printed and excluded from year filtering; poster supplies no year.
- Page 26 “Patriotic Song Competition” repeats the Infinitum Quiz description. Original text is retained internally; public view explains the mismatch without asserting a song award. The complete quiz report remains in its correct record.
- Page 35 OISCA heading is followed by unrelated Model Union Council, farming and reading recognition. The public entry flags the mismatch and gives separately identified, source-supported summaries with names/outcomes; unchanged prose remains in provenance. No OISCA date or result is invented.
- Page 41 athletic poster confirms 800 m first and 400 m third; prose additionally reports 1500 m third. Both are retained and the discrepancy is noted internally.
- Older source heading says CBSE “0.1” merit certificates, while poster/prose describe 24 students with A1 in all five AISSE 2016 subjects. The public title uses “CBSE merit certificates” and retains the original heading internally.
- Source wording distinguishes Vasuki Narayan’s second-round qualification from winning, Rithvin M Ravindran’s championship selection from victory, and science-exhibition national selection from a national win. Historical wishes remain in their historical reports.
- The Flowers poster names “Top Singer Season 6”, while the heading/prose say “Star Singer Season 6”; the public note preserves that distinction and both names are searchable.
- Source encoding artefacts are repaired only for display; original text is unchanged. Historic 2019 examination figures and accompanying accounts are retained without implying current results.
- Gallery MUN gives 21, 24 and 25 September without a year. Ruby Jubilee grand finale says “the same evening”; no exact date is assigned. Untitled Chinmaya Vani and Purulia Chhau cards receive descriptive titles from their reports, without invented years.

All eight video titles and thumbnails returned HTTP 200 from YouTube. Talent Time’s 2025 year is additionally confirmed by the live video title. Video playback, embed availability and regional restrictions were **not** verified. Readers load a privacy-enhanced iframe only after explicit interaction, without autoplay, and always offer the original YouTube destination. No unverified/missing destination was substituted.

## Implementation and accessibility

Main files: `src/pages/Achievements/`, `src/content/achievementsModel.js`, `src/pages/CampusLife/EventGallery.jsx`, enhanced `CampusStoryReader.jsx`, `campusLifeModel.js`, shared `PhotoLightbox.jsx`, and route/navigation integration in App/Navbar/Footer/HomeSections.

Readers use a native modal dialog, contained Tab navigation, Escape/visible close, focus and body-scroll restoration, URL history, copy-link feedback/manual-copy fallback, and full-height mobile layout. Enlarged images use a mode inside the same dialog, with arrow keys, Previous/Next and original-file access. Posters retain natural proportions. Print shows only the selected record, its complete text and images; video destinations are printed. Grid images are responsive previews; larger assets are loaded when opened. Animation uses the existing motion hook, remains visible without browser animation APIs, and respects reduced motion.

Search replaces history rather than adding one entry per keystroke. Gallery parameters (`gq`, `media`, `gyear`, `glimit`) coexist with Campus Life archive filters. Reader and gallery state survive Back/Forward. Search and count feedback are accessible HTML, not image text.

## Validation

- Production build and oxlint pass.
- 28 Node tests pass, including independent source-line/image coverage, all original page tests, poster records, numerical results, coordinate-based video references, deduplication and URL round-trips.
- Headless Chrome checked 1440, 768, 390 and 360 px: search, categories/years/media, pagination, deep links, copied links, keyboard image controls, no nested dialogs, Back/Forward, reader focus/scroll restoration, and no horizontal overflow or browser runtime errors.
- Existing Home/About/Incampus, Academics and Campus Life browser regression checks pass. Original Campus Life test expectations were extended to account for the ninth category and five dropdown links; original 158-record source checks remain intact.
- Selected CBSE Results 2019 and Talent Time 2017 print PDFs were rendered and visually inspected; source text/images appear without printing the archive. Local QA files remain ignored under `tmp/`.
- Additional checks passed for achievement Tab containment, animation API fallback, reduced-motion cancellation, preview-only initial image requests, original-poster printing, and Achievements/Event Gallery navigation from every existing main route. The three-page AI centum print was visually inspected, including both complete posters.

No changes were made to `src/config/contact.js`; enquiries continue using the shared WhatsApp configuration.
