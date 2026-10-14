import { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';
import Footer from './components/layout/Footer';

export default function App() {
  useEffect(() => {
    document.title = 'Chinmaya Vidyalaya Kolazhy | School With A Difference';
    // Preserve previously shared About URLs on the single-page website.
    if (/^\/about\/?$/.test(window.location.pathname)) {
      window.history.replaceState(null, '', `/${window.location.search}${window.location.hash || '#about'}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}
