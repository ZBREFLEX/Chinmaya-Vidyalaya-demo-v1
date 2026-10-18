import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';
import EnquiryProvider from './components/enquiry/EnquiryProvider';
import Infrastructure from './pages/Infrastructure/Infrastructure';
import VerdantView from './pages/VerdantView/VerdantView';
import Facilities from './pages/Facilities/Facilities';

const pageMetadata = {
  home: { title: 'Chinmaya Vidyalaya Kolazhy | School With A Difference', description: 'Chinmaya Vidyalaya, Kolazhy, Thrissur. Nurturing curious minds, compassionate hearts and confident individuals.' },
  infrastructure: { title: 'Infrastructure | Chinmaya Vidyalaya Kolazhy', description: 'Explore nine campus spaces at Chinmaya Vidyalaya Kolazhy, from the tortoise-shaped KG Block to classrooms, the Saraswathy Temple and campus residences.' },
  'verdant-view': { title: 'Verdant View | Chinmaya Vidyalaya Kolazhy', description: 'Discover the Vegetable Garden, Herbal Garden and Nakshathravanam at Chinmaya Vidyalaya Kolazhy through photographs and the school’s garden descriptions.' },
  facilities: { title: 'Facilities | Chinmaya Vidyalaya Kolazhy', description: 'Explore the school library, six laboratories, classroom learning, sports spaces and everyday support at Chinmaya Vidyalaya Kolazhy.' },
};

export default function App() {
  const campusPage = window.location.pathname.match(/^\/incampus\/(infrastructure|verdant-view|facilities)\/?$/)?.[1];
  const currentPage = campusPage || 'home';
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
      {currentPage === 'infrastructure' ? <Infrastructure /> : currentPage === 'verdant-view' ? <VerdantView /> : currentPage === 'facilities' ? <Facilities /> : <Home />}
      <Footer currentPage={currentPage} />
    </EnquiryProvider>
  );
}
