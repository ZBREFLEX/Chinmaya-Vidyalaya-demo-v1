# Academics page

Implemented at `/academics` (also accepts `/academics/`). Home, About and the combined Incampus page remain in place.

## Files and integration

- `src/pages/Academics/Academics.jsx` and `Academics.css`: responsive page, selectors, disclosures, resource links, results archive, motion and full print output.
- `src/content/academics.json`: source content, complete combinations, resources and results, including source file/page references, raw combination wording and original year text.
- `src/content/academicsModel.js`: navigation sections, validated URL state and archive filtering.
- `src/App.jsx`: route and page metadata.
- Shared Navbar and Footer: direct Academics links on every page. The Academics arrow opens all six original sections. Dropdown labels now wrap to accommodate the longer original titles.
- `tests/academics.test.js`: source completeness, merged years, ties, resource annotations and URL state.
- `reference/academics/`: unchanged copies of all six PDFs, every page's extracted text/blocks/link rectangles in `extracted.json`, and HTTP checks in `link-checks.json`.

WhatsApp actions read `src/config/contact.js`. They prepare a stream-specific draft for the parent to review in WhatsApp. No message is sent automatically. The existing generic admission form and its class options have not been changed.

## Content audit

Read and rendered all 23 source pages: Curriculum 3; combinations 3; assessment 3; question papers 4; training 2; results 8.

- **27 combinations:** Science 14, Commerce 6, Humanities 7. Full wrapped lines and source subject order retained, including the distinction between Introductory Computer Science (Python), Informatics Practices and Informatics Practices (Python).
- **16 question-paper destinations:** 7 class folders and 9 individual documents; Classes VI–XII, 2021–2022. Repeated annotations for the same control are deduplicated; different folder/file destinations remain separate. The outer link rectangle contains the matching visible class/stream label and was checked against the rendered pages.
- **1 teacher-training document:** Training Programmes 2019–2020.
- **95 result records:** AISSE Class X 31; AISSCE Class XII Science 34; Commerce 28; Humanities 2. Every name and exact percentage string matches the source extraction. Record IDs do not depend on year alone.
- Visually checked merged-year assignments: ANAIKA AFSAL and BHAMASREE B (2018–2019); V. P. S. RITWIKA and KUNNATH BALAKRISHNAN RAHUL (2007–2008); MRIDULA. N. and DILEEP CHANDRAN. T. (1998–1999); JIDESH HARIDAS and POORNIMA. Y. (1996–1997); KEERTHI SAGAR and RITWIKA (2009–2010); PARVATHI MOHAN and V POORNIMA (2017–2018).
- Both Science rows labelled 2023–2024 remain: SIDHARTH PRADEEP 96.6 and SIDHARTH V JAIN 97.4. Neither was relabelled.
- Full assessment wording is available inline and in print. The historical CCE/grading note remains with the results archive.

## Navigation and state

Stable sections:

```
/academics#curriculum
/academics#subject-combinations
/academics#assessment
/academics#question-papers
/academics#training-programmes
/academics#results
```

Examples of shareable selections:

```
/academics?stream=Humanities#subject-combinations
/academics?class=12&paperStream=Science&paperYear=2021-2022#question-papers
/academics?category=science&year=2023-2024#results
```

Additional query keys: `subject`, `name`, `limit`. Defaults are omitted. Only 2021–2022 is supplied for papers, so its year is a label, not a redundant selector. Input is validated on load. Selections are applied before deep-link scrolling. Back/Forward restores controls; typing replaces the current history entry. Explicit section links may focus the destination; typing and passive scrolling do not. Sticky header offset is measured responsively.

## External checks — 19 October 2026

The training destination returned HTTP 200 with `application/pdf`:
`https://chinmayavidyalaya.org/assets/img/pdf/Teachers_Training_Programmes_2019-20.pdf#toolbar=0`

All seven Drive folder endpoints and the Class VI, VII and VIII individual document endpoints returned HTTP 200. This confirms an HTTP response, not independent verification of every document or the contents/permissions inside each folder. No subject-level files were inferred.

Six individual Drive document links returned HTTP 404. Their original URLs remain present and are marked unavailable in the page:

| Source control | Original destination |
| --- | --- |
| Class XII Science | https://drive.google.com/file/d/1gMRVCuzNtDGHgh_nhWqVnFZog0aNT90d/view?usp=sharing |
| Class XII Commerce | https://drive.google.com/file/d/16Mgnmv1PsK0mfkK2MKvSWU5itwUhCyXr/view?usp=sharing |
| Class XI Science | https://drive.google.com/file/d/1dF77pHLGyIB1NoT-NWsY2hrsypENnz0D/view?usp=sharing |
| Class XI Commerce | https://drive.google.com/file/d/1-XEXq6vhvKAvLe9VKF00loGgAv5F-fwj/view?usp=sharing |
| Class X document | https://drive.google.com/file/d/1Wv1dzfeXxv9i66swvOt2vfP0wqG4xsTX/view?usp=sharing |
| Class IX document | https://drive.google.com/file/d/13MVj6mix9XDcQLVy8NT-yR37I7GPd58u/view?usp=sharing |

No webpage printout is offered as a substitute downloadable document. External links use separate tabs and safe `rel` attributes, with folder/document actions distinguished.

## Items requiring school confirmation

1. Humanities combinations 01–03 print **“Economics Psychology”** without punctuation. The exact fragment remains visible with a note and is preserved internally. It is excluded as a standalone option from the subject filter to avoid presenting an invented combined subject. Combinations 04–07 explicitly separate Economics and Psychology in the source.
2. Science results have two distinct entries labelled **2023–2024**. Confirm whether a source year needs correction; current data deliberately preserves both labels.
3. Curriculum specifies **5+3+2+2 (10+2)**. This has been retained without labelling it the current NEP framework.
4. Approximately **2000** students and reported divisions (LKG–VII three each; VIII–XII four each) are source-reported figures, presented within “School at a glance,” not independently verified live statistics.
5. These sources include **Classes XI–XII**. The existing homepage and generic admission enquiry options describe classes through X. Academics retains senior secondary provision; school confirmation is needed before revising the other content/form.
6. Assessment and training material is supplied/archive content, not a newly verified policy or upcoming programme. The school should confirm current arrangements and replace unavailable paper links.

## Validation

- `npm run build`, `npm run lint` and `npm test`: pass; 19 tests, no lint warnings.
- Chrome/Playwright: 1440px, 768px, 390px and 360px; no horizontal page overflow or runtime errors. Filters/reset/empty states, all result records through Show more, URL selections, reload, Back/Forward, six direct anchors, keyboard stream controls/menu Escape/focus return, configured WhatsApp draft and shared navigation checked.
- Restrained progression/assessment reveals, stream indicator and list/category fades; live reduced-motion cancellation and unavailable IntersectionObserver/WAAPI fallback checked. Base content remains visible.
- Print checked with filters active: all 27 combinations, full assessment text, all 16 paper URLs plus training URL and all 95 results included. Disclosures open for print and restore afterwards; controls are hidden.
- Existing Home/About checks pass at 1440/768/390; Incampus/navigation/legacy-link checks pass at 1440/768/390/360.
- Local visual and print QA artifacts/scripts are under ignored `tmp/qa/`; PDF page renders are under ignored `tmp/academics/`.
