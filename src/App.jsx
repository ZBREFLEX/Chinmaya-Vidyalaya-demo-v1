import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';
import EnquiryProvider from './components/enquiry/EnquiryProvider';
import Incampus from './pages/Incampus/Incampus';
import Academics from './pages/Academics/Academics';
import MandatoryDisclosure from './pages/CBSE/MandatoryDisclosure';
const CampusLife = lazy(() => import('./pages/CampusLife/CampusLife'));
const Achievements = lazy(() => import('./pages/Achievements/Achievements'));

const pageMetadata = {
  achievements: { title: 'Achievements | Chinmaya Vidyalaya Kolazhy', description: 'Explore documented academic, sporting, cultural and staff recognition from the school archives.' },
  'campus-life': { title: 'Campus Life | Chinmaya Vidyalaya Kolazhy', description: 'Discover school life through culture, clubs, student groups, service and a searchable collection of stories from the Chinmaya Vidyalaya archives.' },
  academics: { title: 'Academics | Chinmaya Vidyalaya Kolazhy', description: 'Explore our curriculum, senior secondary subject choices, assessment, question papers and examination results archive.' },
  home: { title: 'Chinmaya Vidyalaya Kolazhy | School With A Difference', description: 'Chinmaya Vidyalaya, Kolazhy, Thrissur. Nurturing curious minds, compassionate hearts and confident individuals.' },
  incampus: { title: 'Incampus | Chinmaya Vidyalaya Kolazhy', description: 'Explore Chinmaya Vidyalaya Kolazhy’s infrastructure, three campus gardens, learning facilities, sports spaces and everyday support in one place.' },
  'cbse-disclosure': { title: 'Mandatory Public Disclosure | CBSE | Chinmaya Vidyalaya Kolazhy', description: 'Mandatory public disclosure documents and certificates in accordance with Central Board of Secondary Education (CBSE) requirements.' },
};

function getPage(pathname) {
  if (/^\/achievements\/?$/.test(pathname)) return 'achievements';
  if (/^\/campus-life\/?$/.test(pathname)) return 'campus-life';
  if (/^\/academics\/?$/.test(pathname)) return 'academics';
  if (/^\/incampus\/?$/.test(pathname)) return 'incampus';
  if (/^\/cbse\/mandatory-public-disclosure\/?$/.test(pathname)) return 'cbse-disclosure';
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => getPage(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setCurrentPage(getPage(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const meta = pageMetadata[currentPage] || pageMetadata.home;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    // Preserve previously shared About URLs on the single-page website.
    if (/^\/about\/?$/.test(window.location.pathname)) {
      window.history.replaceState(null, '', `/${window.location.search}${window.location.hash || '#about'}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, [currentPage]);

  return (
    <EnquiryProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar currentPage={currentPage} />
      {currentPage === 'achievements' ? (
        <Suspense fallback={<main id="main" className="container"><p>Loading Achievements…</p></main>}>
          <Achievements />
        </Suspense>
      ) : currentPage === 'campus-life' ? (
        <Suspense fallback={<main id="main" className="container"><p>Loading Campus Life…</p></main>}>
          <CampusLife />
        </Suspense>
      ) : currentPage === 'academics' ? (
        <Academics />
      ) : currentPage === 'incampus' ? (
        <Incampus />
      ) : currentPage === 'cbse-disclosure' ? (
        <MandatoryDisclosure />
      ) : (
        <Home />
      )}
      <Footer currentPage={currentPage} />
    </EnquiryProvider>
  );
}
