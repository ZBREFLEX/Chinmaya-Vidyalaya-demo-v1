export const campusSections = [
  { id: 'infrastructure', name: 'Infrastructure' },
  { id: 'verdant-view', name: 'Verdant View' },
  { id: 'facilities', name: 'Facilities' },
];

export function canonicalCampusUrl({ pathname, search = '', hash = '' }) {
  const legacySection = pathname.match(/^\/incampus\/(infrastructure|verdant-view|facilities)\/?$/)?.[1];
  if (legacySection) return `/incampus${search}${hash || `#${legacySection}`}`;
  if (pathname === '/incampus/') return `/incampus${search}${hash}`;
  return null;
}

export function campusSectionHref(id, currentPage = 'home') {
  return `${currentPage === 'incampus' ? '' : '/incampus'}#${id}`;
}
