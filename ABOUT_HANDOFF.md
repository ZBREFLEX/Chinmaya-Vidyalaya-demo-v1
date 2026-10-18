# About page handoff

Home and About now form one website at `/`, with About available at `/#about`. It offers a compact visual overview and local search across the complete school content. The homepage, shared header/footer, existing links, and original source content remain in place. No frontend dependencies were added.

## Files changed in the redesign

- `src/pages/About/About.jsx`: interactive timeline, vision selector, excerpt-to-full principal letter, grouped people directory, parent topics, uniform selectors, coordinated detail navigation, and accessible floating search dialog.
- `src/pages/About/About.css`: editorial layout using homepage curves and blue accents, responsive controls, restrained animation, destination feedback, and complete print styles.
- `src/pages/About/AboutSearch.jsx`: shared local search with suggested queries, ranked results, safe React highlighting, matching excerpts, reset/empty states, and paced result announcements.
- `src/content/aboutModel.js`: derived search index, source policy mapping, uniform class aliases, people groups, and stable detail navigation metadata. It imports the existing `about.json`; source text is not duplicated in the index.
- `tests/aboutModel.test.js` and `package.json`: regression checks available through `npm.cmd test`.

## Content and interactions

The existing `src/content/about.json` remains the school-editable source. All original history and vision paragraphs, the full principal message, four school leaders, 19 departmental/specialist assignments, 17 non-teaching staff records, 20 historical management memberships, and all policies/uniform categories remain accessible.

The original 25 discipline entries and six admission entries are mapped into five parent topics. One repeated trouser-waist rule is displayed once with both original source identifiers. `data-source-ids` and model tests verify coverage. Uniform instructions retain individual source identifiers.

Year and pillar controls use real buttons with selected states. All panels exist in semantic markup, including inactive panels. Native disclosures expand long prose inline. Closing the full history/message/directory returns focus to its original control. Search reveals the required selection and disclosures, clears directory filters when needed, waits for committed layout, scrolls beneath the measured header, focuses the matching destination, and briefly highlights it.

Search supports punctuation/spacing/case differences, Roman/Arabic class aliases, and TC/T.C./transfer certificate. The floating search appears after the opening search has passed and hides near the footer. Its native modal dialog also has explicit keyboard focus wrapping, Escape/close controls, reliable body-scroll restoration, and focus return. Ctrl/Cmd+K opens it outside editable controls.

## Detail URLs and hosting

Existing links such as `#story`, `#motto`, `#vision`, `#principal`, `#management`, `#administration`, `#staff`, and `#rules` still work. Management and administration hashes reveal the corresponding directory group.

Shareable targets include `#milestone-4`, `#story-detail-6`, `#pillar-1-part-4`, `#principal-letter`, `#non-teaching-person-17`, `#admission-rule-03`, and `#uniform-2`. Direct loads and browser back/forward restore the panel/disclosure state required to reveal that target. Record numbers reference source ordering; keep these stable when updating directories.

The project has no router dependency. All primary navigation uses same-document anchors. Previously shared `/about` URLs are canonicalized to `/#about`, preserving any detail hash; a host fallback to `index.html` supports those legacy URLs.

## Historical context and remaining source gaps

- The staff group and non-teaching group photographs are included. Teaching-staff directory pages in the supplied PDF are blank, so no invented teaching group is shown.
- The recovered management link is retained: https://chinmayavidyalaya.org/assets/img/pdf/MANAGEMENT_COMMITTEE-2023-24.pdf. Its committee is clearly labelled 2023–2024 and is not represented as current leadership.
- The ISO 9001:2008 reference is a December 2009 historical milestone. The end-of-2018 garden target is framed as recorded vision material.
- `Coordinatorr`, `combiNations`, and `explaNations` are preserved source spellings. The unclear uniform wording `Black shoes season` is retained with a parent-facing clarification because it affects interpretation.
- Principal/uniform photographs have limited source resolution. Higher-resolution official originals would improve clarity.
- Source PDFs remain archived under `reference/about/`, and authentic extracted assets remain under `public/images/about/`. Developer extraction notes are kept out of the school story.

## Verification

- `npm.cmd run build`: passed.
- `npm.cmd run lint`: passed without warnings.
- `npm.cmd test`: four tests pass for aliases, names/roles and hidden-content discovery, complete policy coverage, and retained source/index records.
- Headless Chrome journeys at 1440px, 768px and 360px pass: initial overview, full story open/collapse/focus, stable timeline layout, all pillars, full letter without duplicate excerpt, class-6 and TC results, inactive-panel reveal, directory name/role/reset/empty states, direct detail links, back/forward, dialog keyboard focus/Escape/body scroll, expand/collapse policies, complete printing, and the homepage.
- Actual desktop/mobile screenshots were reviewed for opening, full composition, principal/staff photos, policies, and the search dialog. Reduced-motion checks pass; normal-motion navigation and keyboard shortcuts were also exercised.
- Print opens all disclosures, prints all inactive timeline/vision/directory/uniform panels and all directory records despite search filters, hides interactive controls, and restores disclosure choices afterward. A printed text comparison verifies all 227 tested source passages, names and roles, with no missing material (accounting for PDF line-wrap hyphens).

Temporary browser screenshots, extracted print previews, and browser journey scripts are under ignored `tmp/qa/`.

## Targeted storytelling motion

`src/pages/About/aboutMotion.js` adds one-time IntersectionObserver entrances, scroll-driven timeline progress/emphasis, a moving vision accent, and interruptible native disclosure animation. CSS scopes movement to the requested heading lines, selected timeline/vision explanations, two brief source-derived transition sentences, motto, portrait/excerpt/attribution, group photograph, and leadership names. No broad section/paragraph reveal remains.

The current motto layout has a decorative school gesture rather than a photograph; it fades softly without introducing or replacing imagery. A brand-colour curved underline draws once below “Smiling”. All existing school photographs retain their positions and dimensions.

Timeline scrolling updates the line and visible-milestone accent without updating selected-year state. Vision button boxes remain stationary while their titles reveal. Directory filtering renders results immediately and fades the list without stagger. Disclosures animate for 260ms, support reversal, and return to natural height/overflow. Search and direct links settle required disclosures immediately before scrolling/focusing, so motion cannot leave matched content clipped or hidden. Print also settles animations before exposing all details.

Desktop storytelling sequences last 400–700ms, with short stagger delays. Mobile uses simple fades and removes decorative movement/drawing. Reduced motion disables transforms, drawing, animated scrolling, and disclosure animation, including when the preference changes during use. Without IntersectionObserver or Web Animations support, content and native disclosures remain visible and usable.

Additional browser checks at 1440px and 360px passed for entrance layout shifts (none observed), scroll progress, manual-year preservation, smooth disclosure open/close/reversal, direct search destinations, moving accent alignment, letter expansion, immediate directory filtering, live reduced-motion switching, and failure fallback. The existing three-width browsing/search/keyboard/print journeys still pass.


## Single-page composition

`App.jsx` renders the shared navbar, one main landmark, and one footer. `HomeSections.jsx` places the complete interactive About section after Campus Life and before the existing Admissions invitation. Home’s original hero, Kindergarten, approach, achievements, and campus sections remain intact. The former approach anchor is now `#our-approach`, reserving `#about` for the complete About section.

The About opening is now a section heading rather than a second page-level heading. Its separate closing invitation and footer have been removed in favour of the existing Admissions/Contact ending. About labels, dropdown entries, homepage links, and footer links scroll within the same document. The navbar highlights Home or About according to the current scroll location.

Previously shared `/about` and `/about#detail` links continue to reveal the appropriate content at the canonical root URL. Search, source content, detail hashes, directory filters, disclosures, animation, reduced motion, and print handling remain intact.

Single-page browser checks pass at 1440px, 768px and 390px: one main/header/footer/page heading, unique IDs, complete Home/About sections, direct navbar anchors and sticky-header offsets, mobile menu closing, search/dialog navigation, browser history, legacy About links, admissions links, and no horizontal overflow. Build, lint and source/search model tests pass.

## WhatsApp admission enquiries

All Enquire Now buttons (header, mobile menu, hero and Admissions section) and the admissions dropdown enquiry open the same accessible admission form. It collects parent/guardian name, contact number, student name and the class applying for (LKG, UKG, Classes 1�10). Required fields use native browser validation.

Continue to WhatsApp opens a WhatsApp chat with an encoded message containing those details. The parent reviews and sends the message in WhatsApp. To change the recipient for every enquiry button, edit only `whatsappNumber` in `src/config/contact.js`. Include the country code; spaces and a leading `+` are supported and removed when building the link. No enquiry backend or local storage is used.

The shared form lives in `src/components/enquiry/EnquiryProvider.jsx`, with a native modal dialog, Escape/close controls, scroll locking and focus restoration. `EnquiryButton.jsx` connects each entry point. Other topic-specific email links remain in place.

Verification: build, lint and existing model tests pass. Browser checks at 1440px and 390px verify opening from the header and hero, initial focus, required-field validation, close/Escape/focus return, responsive sizing, and the exact outgoing WhatsApp number and decoded parent/student/class message. The WhatsApp navigation was intercepted during verification; no message was sent.
