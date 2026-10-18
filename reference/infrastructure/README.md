# Infrastructure source archive

All nine supplied PDFs are archived here. All 23 pages were read and rendered for review. The page descriptions, not the printed navigation/footer/admission banners, are the content source. No menu screenshot was supplied with the attachments or present in the repository; the three Incampus categories follow the user's brief.

`source-passages.json` independently records the substantive PDF passages with line wrapping removed, including continuations on later pages. The regression tests compare the campus model to these passages. Keep this source record independent when editing the website copy.

## Image provenance

Photographs in `public/images/infrastructure/` were extracted from PDF image objects. JPEGs retain their original bytes and dimensions. The two parking images were converted from lossless PNG to WebP at the same pixel dimensions (quality 90) to reduce download size. No photographs were generated, enlarged, or relabelled as other buildings.

| Public filename | Source PDF | Page | PDF image object | Dimensions |
| --- | --- | --- | --- | --- |
| chinmaya-balkrishna.jpg | balakrishna.pdf | 1 | 10 | 600 × 402 |
| main-block.jpg | main block.pdf | 1 | 8 | 592 × 397 |
| tapovan-maharaj-auditorium.jpg | main block.pdf | 2 | 36 | 594 × 395 |
| saraswathy-temple.jpg | temple.pdf | 2 | 33 | 382 × 570 |
| golden-jubilee-block.jpg | golden jjublee block.pdf | 1 | 9 | 553 × 370 |
| chinmaya-balaniketan.jpg | CHINMAYA BALANIKETAN.pdf | 1 | 10 | 800 × 600 |
| cycle-shed.webp | shed.pdf | 1 | 10 | 800 × 533 |
| car-parking.webp | shed.pdf | 2 | 34 | 800 × 533 |
| chinmaya-vishram.jpg | vishram.pdf | 2 | 30 | 549 × 367 |
| chinmaya-darshan.jpg | darshan.pdf | 1 | 10 | 572 × 397 |

The opening photograph reuses `src/assets/images/hero/campus.jpeg`, the existing authentic campus photograph. The repeated 2000 × 301 campus banner and 280 × 93 logo were excluded from the new location gallery.

## Missing material and source details

- Chinmaya Saket's reference is the long filename beginning `Chinmaya Vidayalam Kolazhy`. Both pages and every embedded image were checked: there is no location photograph, only the repeated header banner and logo. The Saket tile and explorer therefore use a neutral architectural icon and its complete description.
- Vishram's guest-house photograph and the Temple photograph are on page 2; their blank first-page areas were not treated as missing photographs.
- Darshan's original paragraph starts `CHINMAYA DARSHANA permanent...` without a separating space between the title and `A`. This joined wording is retained verbatim; the display heading is `Chinmaya Darshan`. Its final sentence continues on page 2.
- KG construction/features text continues on page 2. Balaniketan accommodation text also continues on page 2. Both continuations are retained.
- The Main Block source mentions senior secondary classes, whereas the existing homepage advertises admissions through Class 10. This source discrepancy has not been independently resolved. The Infrastructure page preserves the supplied description without changing the homepage or admission class options.
- Golden Jubilee Block and the parking source supply titles and photographs only; no additional capacity, allocation, construction date, security or access claims were added.
- Category labels organise browsing only. They do not represent official departments or geographic locations.
- Source printouts contain inconsistent admission-year banners. Those banners were discarded; the source descriptions and photographs are not presented as a fresh verification of current facilities.
