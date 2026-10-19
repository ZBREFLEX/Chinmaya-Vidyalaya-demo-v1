# Combined Incampus page

`/incampus` now contains Infrastructure, Verdant View and Facilities in one document, with one main landmark, page heading, breadcrumb, footer and final enquiry invitation. The original content, images, Infrastructure explorer/search, garden anchors, Facilities finder/laboratory selector, Digital disclosure, photo viewers and WhatsApp configuration are retained.

The shared navbar follows the About pattern: the Incampus label is a real link to `/incampus`, and its separately labelled arrow opens section links. It works on Home/About and Incampus, on desktop and mobile; menu selections close the mobile menu. Footer and related links point to the combined page. Within Incampus the three destinations are `#infrastructure`, `#verdant-view` and `#facilities`.

Previously shared `/incampus/infrastructure`, `/incampus/verdant-view` and `/incampus/facilities` URLs are canonicalised before React mounts. A page-only URL forwards to its section; an existing detail hash and query are preserved, for example `/incampus/facilities#artificial-intelligence-lab` becomes `/incampus#artificial-intelligence-lab`. The existing host fallback to `index.html` is still required, with no invented server redirects.

## Files

- `src/pages/Incampus/Incampus.jsx` and `.css`: compact introduction, section navigation, combined composition and shared-header-aware section restoration.
- `src/content/campusNavigation.js`: section metadata, legacy URL conversion and shared link helpers.
- `src/main.jsx`, `src/App.jsx`: early URL conversion, one Incampus route and page metadata.
- Shared Navbar/Footer: direct Incampus link, separate disclosure arrow and consolidated section links.
- Infrastructure, Verdant View and Facilities components/styles: embeddable semantic sections, adjusted heading hierarchy, isolated detail/hash handling, one breadcrumb and one closing invitation. Content remains in the existing data sources.
- `tests/campusNavigation.test.js`: canonical URLs, retained detail/query values and cross-page/local section links.

## Smooth campus motion

`src/pages/Incampus/useCampusMotion.js` now coordinates entrances across the complete page. Opening heading lines, section introductions, photographs, Infrastructure tiles, garden stories, facility chapters and the closing invitation reveal when they enter the viewport. Entrances run once, use short stagger delays, and combine an eased fade with 12–22px movement and a small photo scale. Mobile uses shorter, lighter movement. Photo hover and section-link arrows have restrained transitions.

Embedded sections disable their former individual entrance observers and mount-time opening animations, preventing doubled animations and introductions finishing before visitors scroll to them. Interactive explorer/lab transitions and native disclosure motion remain in place. New filtered tiles are discovered without hiding or delaying the underlying content. Focused controls and destinations settle their entrance so keyboard focus stays stationary.

Explicit Incampus section links in the header, page navigation, related links and footer now scroll smoothly with the correct header offset. Direct page loads and browser history restore immediately. Modified clicks and other destinations retain normal browser behaviour. Reduced motion disables entrances and animated scrolling, including a live preference change; printing cancels active entrances, and unavailable animation APIs leave all content visible.

Browser checks on desktop and mobile verify that lower section entrances wait until scrolling, section jumps request smooth scrolling, entrances do not replay on a section revisit, finder/history/focus behaviour remains intact, and initial/live reduced motion and animation-API failure fallbacks work.

Section scrolling is handled by the combined page; each existing component handles only its own detail hashes. This avoids the former pages resetting scroll when a visitor navigates elsewhere in the combined document. Browser Back/Forward and explicit section jumps respect the shared sticky header. Printing retains all three sections, every source paragraph, all six lab labels and all thirty distinct photographs.

## Verification

Build and lint pass; all fourteen Node tests pass. Browser checks at 1440, 768, 390 and 360px verify the direct navbar link from Home/About, separate Incampus disclosure, all three section links, mobile closing, one header/main/footer/page heading/breadcrumb, unique IDs, no horizontal overflow, retained explorer/search/finder/garden/lightbox interactions, old section/detail URLs and browser history. Keyboard disclosure/Escape/focus and section navigation, normal-motion lab changes and Digital disclosure also pass. Desktop/mobile opening and section screenshots were inspected.

The combined printout was rendered and visually reviewed. Independent source-passage comparisons find no missing Infrastructure, garden or Facilities descriptions, and all thirty photographs are present. Existing Home/About journeys still pass at desktop, tablet and mobile widths. Temporary browser scripts, screenshots and print checks are under ignored `tmp/qa/`.
