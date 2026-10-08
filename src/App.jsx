import Navbar from './components/layout/Navbar';
import Home from './pages/Home/Home';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <Home />
    </>
  );
}