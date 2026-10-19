import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';
import EnquiryProvider from './components/enquiry/EnquiryProvider';
import Incampus from './pages/Incampus/Incampus';

const pageMetadata = {
  home: { title: 'Chinmaya Vidyalaya Kolazhy | School With A Difference', description: 'Chinmaya Vidyalaya, Kolazhy, Thrissur. Nurturing curious minds, compassionate hearts and confident individuals.' },
  incampus: { title: 'Incampus | Chinmaya Vidyalaya Kolazhy', description: 'Explore Chinmaya Vidyalaya Kolazhy’s infrastructure, three campus gardens, learning facilities, sports spaces and everyday support in one place.' },
};

export default function App() {
  const currentPage = window.location.pathname === '/incampus' ? 'incampus' : 'home';
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
      {currentPage === 'incampus' ? <Incampus /> : <Home />}
      <Footer currentPage={currentPage} />
    </EnquiryProvider>
  );
}
