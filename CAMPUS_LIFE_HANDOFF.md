# Campus Life

Implemented at `/campus-life`, also accepting `/campus-life/`.

The page combines a photographic introduction, three story themes, student groups, a CVMUN feature and a searchable archive. Achievements remains separate. Existing Home, About, Academics and Incampus pages are preserved.

## Files

- `src/pages/CampusLife/CampusLife.jsx` / `CampusLife.css`: overview, themes, groups, MUN feature, archive, filters, pagination, URL/history handling and print layouts.
- `CampusStoryReader.jsx`: full reports, all associated images, shared gallery mode, copying links, printing, focus containment and scroll restoration.
- `useLifeMotion.js`: visible-by-default heading/photo reveals, reduced-motion cancellation and animation fallback.
- `src/content/campusLife.json`: one dataset for features, archive, reader and gallery. Stores original titles/bodies/categories/dates, excerpts, image provenance, source page ranges and internal uncertainty notes.
- `campusLifeModel.js`: search, validated filters, stable record lookup, source-backed theme selections and shareable state. Punctuation encoding is repaired for display only; raw source wording remains unchanged in the dataset.
- `lifeNavigation.js`: small shared navigation metadata; the page and full dataset load only when visiting Campus Life.
- `src/App.jsx`, shared Navbar/Footer and the homepage's existing “Explore Campus Life” action: route integration and direct links. Campus Life has a direct label link plus a separate section-menu arrow on desktop and mobile.
- `src/components/media/PhotoLightbox.jsx`: extracted `PhotoViewerContent` so the existing viewer presentation works inside the story dialog, without opening a second modal. Existing standalone lightbox behaviour is preserved.
- `public/images/campus-life/`: 163 extracted image assets, each with a full WebP (up to 1800px), 640px preview and 320px thumbnail, preserving aspect ratios. No stock or generated event photographs.
- `reference/campus-life/`: unchanged copies of all eight supplied PDFs, complete extracted text/layout data, record inventory, text/image audit trails and CVMUN source metadata.
- `tests/campusLife.test.js`: five source-integrity/search/state tests, bringing the suite to 24 tests.

## Source coverage and counts

Read and rendered every source page, including image-only pages. Source page counts:

| Original source | Pages | Original entries | Archive filter count |
| --- | ---: | ---: | ---: |
| Service to Society | 15 | 17 | 17 |
| Celebrations | 39 | 51 | 51 |
| Observations | 33 | 41 | 40 |
| Competitions | 12 | 22 | 21 |
| Co-Scholastic | 18 | 21 | 21 |
| Houses & Clubs | 8 | 7 | 7 |
| Scouts & Guides | 4 | 1 | 1 |
| Cubs & Bulbuls | 3 | 1 | 1 |
| **Total** | **132** | **161** | **158 unique stories** |

Filter counts total 159 memberships because the verified 2023 Investiture story belongs to both Celebrations and Observations. It appears once when browsing all stories.

Three verified duplicate pairs were merged, preserving every original source reference, original wording variant and old record-ID alias:

1. The 27 July 2023 Investiture report: same full report apart from a final punctuation character and the exact same two extracted images across Celebrations and Observations.
2. The two “Reception of Chinmaya Jyoti” reports within Observations: identical report; the illustrated copy's three images are retained.
3. Puzhakkal Block Panchayat / Plastic carry bag free day: identical date and report except spacing; neither source control has images. Both titles remain searchable.

All **165 relevant image occurrences** are accounted for by **163 distinct extracted assets**; the two Investiture image duplicates share assets but retain both provenance references. Other visually related image encodings and near-duplicate report variants are retained rather than silently discarded. All five Scouts & Guides photographs and all four Cubs & Bulbuls photographs are accessible in their readers.

Descriptions crossing page boundaries remain complete, including the 2023 Investiture report, Annual Day accounts, service reports and the final Avishkar 2016 continuation. Source layout was checked to associate photo groups correctly: several categories place images before their headings, while Celebrations and Observations generally place headings before images.

The three Oru Pidi Ari entries remain separate (140 kg, 70 Kg and 50Kgs). Their quantities are not combined. Annual Day, Onam, Republic Day, teacher events and differing seminar accounts remain distinct. Mixed accounts appearing beneath one source heading retain all their text under that original report, with internal notes.

## Content and dates needing school confirmation

- Celebrations' **Kerala Piravi Celebration** heading is followed by a repeated Children's Day report dated 14 November 2017. Its original paragraph and supplied image are preserved; the date for the Kerala Piravi heading is left unresolved.
- Observations' **Pi Day Celebrations** heading is followed by a Philately Club inauguration account. Original text and image remain intact; no Pi Day report or date is invented.
- Observations calls the 2 December 2019 athletic meet the **“1st Annual Athletic Meet.”** This source wording is retained.
- The Co-Scholastic **Seminar** account ends with the incomplete phrase **“the functioning of”**. No missing ending was supplied.
- Co-Scholastic's adolescent-education and Samanvayam reports contain additional seminar accounts. These are preserved in full, including their separate stated dates and historical speakers; their source grouping is recorded internally.
- The energy-conservation account also contains a Cubs/Bulbuls centenary statement and an alumni account. All source text remains available and searchable; the alumni's batch/award years are not assigned as the energy event's year.
- A seminar photograph adjacent to the adolescent-education report is retained in its source context without inventing the pictured speaker's identity. The supplied Dr T P Sethumadhavan image caption is preserved separately where identified.
- **Glimpses from Onam Celebration 2025** and **Chinmaya Balkrishna Onam Celebration 2025** are heading-only entries in the printout: no report, photograph or usable video destination is supplied. They remain searchable as 2025 entries without invented text or replacement images.
- Several 2017 celebration entries show broken image placeholders in the supplied printout: Mathrupooja, Onam 2017, Mahasamadhi day, Sanskrit Day 2017, August 15 Independence Day, Alumni Meet, the earlier Republic Day, Farewell and Annual Day. Available reports remain accessible using text-led cards. The absent photographs cannot be recovered from these PDFs.
- Houses & Clubs supplies seven activity/project reports, **not a house directory**. No house names, colours, captains or current club roster have been invented.
- Undated records and partial dates remain as supplied. No PDF printing date, adjacent record's year, anniversary ordinal or unrelated batch year is used to invent an event year. Date labels say “Date not recorded” where appropriate; the year filter also supports “Year not recorded.”
- Archive programmes, staffing, eligibility and activities are not promoted as independently confirmed current arrangements. The two group descriptions are retained exactly, including Scouts & Guides **“from Std. V onwards.”**

## CV Model United Nations

The programme destination was checked on 19 October 2026:
[CV Model United Nations website](https://chinmayavidyalaya.org/cvmun/index.html).

Its general introduction supports diplomacy, public speaking, teamwork and international affairs. The feature uses an authentic image from the supplied historical MUN report, labelled as an archive image. The external CTA opens safely in a separate tab. Registration forms, countdowns, conference dates and committee availability have not been copied.

The **12–13 November 2017** MUN report remains a separate archive story with both supplied photographs; it is also linked beneath the programme CTA. These two images are only 260 × 196 pixels in the supplied PDF. The feature photo is displayed at its native width within a light frame, without artificial enlargement.

## Navigation, search and readers

Section links:

```
/campus-life#life-themes
/campus-life#student-groups
/campus-life#cvmun
/campus-life#campus-stories
```

Example selections and reader links:

```
/campus-life?theme=service#campus-stories
/campus-life?category=Houses+%26+Clubs#campus-stories
/campus-life?category=Celebrations&year=2017#campus-stories
/campus-life?story=study-trip-to-kila-4-16#campus-stories
/campus-life?story=chinmaya-vidyalaya-model-united-nation-4-08#campus-stories
```

Additional parameters: `q`, `limit`. Six stories initially appear, followed by Show more in groups of six. Category options retain all eight original names. Search indexes full reports, original/alias titles, categories, supplied dates, people, organisations and useful terms such as MUN/science exhibition. Theme filters are visibly identified and removable. Count announcements are delayed briefly to avoid announcing each keystroke; filtering remains immediate.

Search typing replaces the current history entry. Other explicit selections use history entries. Opening a story adds a reader entry; Back closes it and Forward reopens it, preserving the previous filter/page state. Direct-entry stories also receive a local overview history entry so Back closes the reader before leaving Campus Life. Closing restores focus and exact background scroll position after browser fragment restoration. Shared direct links work even with unmatched archive filters or records outside the first page.

Photo enlargement uses gallery mode in the **same native dialog**, with arrows, previous/next, Back to story, Escape and contained keyboard focus. The mobile reader has one normal vertical scroll area and a sticky close control. Clipboard failure exposes a selectable link instead of claiming a successful copy.

Only responsive previews load in the overview/archive; full images load on enlargement. Below-fold archive imagery is lazy-loaded and dimensions are reserved. The independent Event Gallery has not been migrated or represented as this collection.

## Validation

- Build and lint pass with no warnings; **24 tests pass**.
- Automated source checks account for every captured substantive text line and all 165 relevant image occurrences against the archived PDF extraction. Stable IDs/slugs are unique; all source references and asset variants exist.
- Chrome/Playwright at **1440, 768, 390 and 360px**: one main/heading/header/footer, no horizontal overflow, search/category/year/theme/reset/empty states, pagination, URL state, copied links, readers, photo mode, focus and exact scroll restoration, direct entry, Back/Forward and shared navigation checked.
- Normal motion, live reduced-motion cancellation and unavailable IntersectionObserver/WAAPI fallback checked. Initial network requests use previews rather than enlarged image files.
- Keyboard Tab/Shift+Tab containment, gallery arrows, Escape and focus restoration checked. No runtime errors in the Campus Life browser checks.
- Print: overview is a compact four-page introduction/category summary, rather than the full archive. A selected report prints its full text; printing from gallery mode still prints the complete selected story and every image/caption. Tested a text-only KILA report and the five-photo Scouts & Guides programme.
- Existing Home/About regression checks pass at 1440/768/390px; Academics and Incampus checks pass at 1440/768/390/360px. Shared standalone photo lightboxes continue to work.
- Ignored `tmp/qa/` holds browser scripts/screenshots/print checks. Ignored `tmp/campus-life/` holds source page renders, image contact sheets and extraction work.
