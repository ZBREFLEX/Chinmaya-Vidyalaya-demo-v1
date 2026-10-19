import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';
import EnquiryProvider from './components/enquiry/EnquiryProvider';
import Incampus from './pages/Incampus/Incampus';
import Academics from './pages/Academics/Academics';
const CampusLife = lazy(() => import('./pages/CampusLife/CampusLife'));
const Achievements = lazy(() => import('./pages/Achievements/Achievements'));

const pageMetadata = {
  achievements: { title: 'Achievements | Chinmaya Vidyalaya Kolazhy', description: 'Explore documented academic, sporting, cultural and staff recognition from the school archives.' },
  'campus-life': { title: 'Campus Life | Chinmaya Vidyalaya Kolazhy', description: 'Discover school life through culture, clubs, student groups, service and a searchable collection of stories from the Chinmaya Vidyalaya archives.' },
  academics: { title: 'Academics | Chinmaya Vidyalaya Kolazhy', description: 'Explore our curriculum, senior secondary subject choices, assessment, question papers and examination results archive.' },
  home: { title: 'Chinmaya Vidyalaya Kolazhy | School With A Difference', description: 'Chinmaya Vidyalaya, Kolazhy, Thrissur. Nurturing curious minds, compassionate hearts and confident individuals.' },
  incampus: { title: 'Incampus | Chinmaya Vidyalaya Kolazhy', description: 'Explore Chinmaya Vidyalaya Kolazhy’s infrastructure, three campus gardens, learning facilities, sports spaces and everyday support in one place.' },
};

export default function App() {
  const currentPage = /^\/achievements\/?$/.test(window.location.pathname) ? 'achievements' : /^\/campus-life\/?$/.test(window.location.pathname) ? 'campus-life' : /^\/academics\/?$/.test(window.location.pathname) ? 'academics' : window.location.pathname === '/incampus' ? 'incampus' : 'home';
  useEffect(() => {
    document.title = pageMetadata[currentPage].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageMetadata[currentPage].description);
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
      {currentPage === 'achievements' ? <Suspense fallback={<main id="main" className="container"><p>Loading Achievements…</p></main>}><Achievements /></Suspense> : currentPage === 'campus-life' ? <Suspense fallback={<main id="main" className="container"><p>Loading Campus Life…</p></main>}><CampusLife /></Suspense> : currentPage === 'academics' ? <Academics /> : currentPage === 'incampus' ? <Incampus /> : <Home />}
      <Footer currentPage={currentPage} />
    </EnquiryProvider>
  );
}
