# Homepage design assets

The navbar emblem and campus visual currently use CSS windows into `design-reference.png`, supplied by the project owner. This preserves the reference composition without showing the other homepage sections. The image is reference artwork, not verified campus photography.

For production, replace these windows with a separate official school logo and an original high-resolution campus photograph. The current baked-in campus caption comes from the supplied artwork. Hero headings, navigation and buttons are live HTML.

Only the navbar and hero are implemented in this stage. Navigation uses animated dropdown disclosures on desktop and accordion panels on mobile. Unbuilt pages are disabled and marked Coming soon. Enquire Now opens an email draft; the campus tour is disabled until its content is ready. No navigation links point to the old website. No enquiry form, backend, other homepage sections or statistics have been added.

Preview: `npm.cmd run dev`
Validation: `npm.cmd run build` and `npm.cmd run lint`

