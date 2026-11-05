import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';
import EnquiryProvider from './components/enquiry/EnquiryProvider';
import Incampus from './pages/Incampus/Incampus';
import Academics from './pages/Academics/Academics';
import MandatoryDisclosure from './pages/CBSE/MandatoryDisclosure';
import Contact from './pages/Contact/Contact';
const CampusLife = lazy(() => import('./pages/CampusLife/CampusLife'));
const Achievements = lazy(() => import('./pages/Achievements/Achievements'));

const pageMetadata = {
  'cbse-text-books': { title: 'Text Books & CBSE Curriculum | Chinmaya Vidyalaya Kolazhy', description: 'Read the school’s textbook list for 2025–2026 and open the linked CBSE Academic curriculum.' },
  'cbse-declarations': { title: 'Declarations | CBSE | Chinmaya Vidyalaya Kolazhy', description: 'Read and download school declarations on homework, single-shift operation, science practicals and the 2025–2026 textbook list.' },
  'cbse-accreditation': { title: 'Accreditation | CBSE | Chinmaya Vidyalaya Kolazhy', description: 'View school information and non-teaching, primary and nursery staff records.' },
  'cbse-affiliation': { title: 'Affiliation | CBSE | Chinmaya Vidyalaya Kolazhy', description: 'View affiliation supporting documents, governing body records, textbooks, land documents, affidavits and the sample transfer certificate.' },
  contact: { title: 'Contact Us | Chinmaya Vidyalaya Kolazhy', description: 'Contact Chinmaya Vidyalaya Kolazhy by email, WhatsApp or phone. Find our campus location and directions.' },
  achievements: { title: 'Achievements | Chinmaya Vidyalaya Kolazhy', description: 'Explore documented academic, sporting, cultural and staff recognition from the school archives.' },
  'campus-life': { title: 'Campus Life | Chinmaya Vidyalaya Kolazhy', description: 'Discover school life through culture, clubs, student groups, service and a searchable collection of stories from the Chinmaya Vidyalaya archives.' },
  academics: { title: 'Academics | Chinmaya Vidyalaya Kolazhy', description: 'Explore our curriculum, senior secondary subject choices, assessment, question papers and examination results archive.' },
  home: { title: 'Chinmaya Vidyalaya Kolazhy | School With A Difference', description: 'Chinmaya Vidyalaya, Kolazhy, Thrissur. Nurturing curious minds, compassionate hearts and confident individuals.' },
  incampus: { title: 'Incampus | Chinmaya Vidyalaya Kolazhy', description: 'Explore Chinmaya Vidyalaya Kolazhy’s infrastructure, three campus gardens, learning facilities, sports spaces and everyday support in one place.' },
  'cbse-disclosure': { title: 'Mandatory Public Disclosure | CBSE | Chinmaya Vidyalaya Kolazhy', description: 'Mandatory public disclosure documents and certificates in accordance with Central Board of Secondary Education (CBSE) requirements.' },
};

function getPage(pathname) {
  if (/^\/cbse\/text-books\/?$/.test(pathname)) return 'cbse-text-books';
  if (/^\/cbse\/declarations?\/?$/.test(pathname)) return 'cbse-declarations';
  if (/^\/cbse\/accreditation\/?$/.test(pathname)) return 'cbse-accreditation';
  if (/^\/cbse\/affiliation\/?$/.test(pathname)) return 'cbse-affiliation';
  if (/^\/contact\/?$/.test(pathname)) return 'contact';
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
      ) : currentPage === 'contact' ? (
        <Contact />
      ) : currentPage === 'academics' ? (
        <Academics />
      ) : currentPage === 'incampus' ? (
        <Incampus />
      ) : currentPage === 'cbse-text-books' ? (
        <MandatoryDisclosure key="text-books" section="text-books" />
      ) : currentPage === 'cbse-declarations' ? (
        <MandatoryDisclosure key="declarations" section="declarations" />
      ) : currentPage === 'cbse-accreditation' ? (
        <MandatoryDisclosure key="accreditation" section="accreditation" />
      ) : currentPage === 'cbse-affiliation' ? (
        <MandatoryDisclosure key="affiliation" section="affiliation" />
      ) : currentPage === 'cbse-disclosure' ? (
        <MandatoryDisclosure />
      ) : (
        <Home />
      )}
      <Footer currentPage={currentPage} />
    </EnquiryProvider>
  );
}
