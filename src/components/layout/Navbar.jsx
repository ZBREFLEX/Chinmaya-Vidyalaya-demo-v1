import { useEffect, useRef, useState } from 'react';
import logo from '../../assets/images/chinmaya-logo.jpg';
import './Navbar.css';

const destinations = [
  { label: 'About', items: ['About Chinmaya', 'Our Story', 'Motto', 'Vision & Values', "Principal’s Message", 'Management', 'Administration', 'Staff', 'Rules & Regulation'] },
  { label: 'Kindergarten', items: ['Early Learning', 'LKG & UKG', 'Learning Environment'] },
  { label: 'Academics', items: ['Curriculum', 'Primary School', 'Secondary School', 'Faculty'] },
  { label: 'Campus Life', items: ['Our Campus', 'Sports & Activities', 'Clubs & Culture', 'Gallery'] },
  { label: 'Achievements', items: ['Academic Results', 'Student Achievements', 'School Highlights'] },
  { label: 'Admissions', items: ['Admission Process', 'Eligibility', 'School Prospectus'] },
];
const enquiry = 'mailto:chinvidhya@gmail.com?subject=Admission%20enquiry';
const sectionLinks = { 'About Chinmaya': '#about', 'Our Story': '#story', 'Motto': '#motto', 'Vision & Values': '#vision', "Principal’s Message": '#principal', 'Management': '#management', 'Administration': '#administration', 'Staff': '#staff', 'Rules & Regulation': '#rules', 'Early Learning': '#kindergarten', 'LKG & UKG': '#kindergarten', 'Learning Environment': '#kindergarten', 'Our Campus': '#campus-life', 'Sports & Activities': '#campus-life', 'Clubs & Culture': '#campus-life', 'Student Achievements': '#achievements', 'School Highlights': '#achievements', 'Admission Process': '#admissions' };

export default function Navbar() {
  const [activeArea, setActiveArea] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const header = useRef(null);
  const toggle = useRef(null);
  const dropdownTriggers = useRef([]);


  useEffect(() => {
    let frame;
    const updateArea = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const about = document.getElementById('about').getBoundingClientRect();
        const threshold = header.current.getBoundingClientRect().bottom + 80;
        setActiveArea(about.top <= threshold && about.bottom > threshold ? 'about' : 'home');
      });
    };
    updateArea();
    window.addEventListener('scroll', updateArea, { passive: true });
    window.addEventListener('resize', updateArea);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', updateArea); window.removeEventListener('resize', updateArea); };
  }, []);

  useEffect(() => {
    const updateFloating = () => setIsFloating(window.scrollY > 24);
    updateFloating();
    window.addEventListener('scroll', updateFloating, { passive: true });
    return () => window.removeEventListener('scroll', updateFloating);
  }, []);

  useEffect(() => {
    const onPointerDown = event => {
      if (!header.current?.contains(event.target)) {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
    };
    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      if (openDropdown !== null) {
        dropdownTriggers.current[openDropdown]?.focus();
        setOpenDropdown(null);
      } else if (menuOpen) {
        toggle.current?.focus();
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, openDropdown]);

  return <header ref={header} className={`navbar${isFloating ? ' navbar--floating' : ''}${menuOpen ? ' navbar--menu-open' : ''}`}><div className="navbar__inner">
    <a className="school-brand" href="#home" aria-label="Chinmaya Vidyalaya home"><span className="school-brand__mark" aria-hidden="true"><img src={logo} alt="" /></span><span><strong>Chinmaya Vidyalaya</strong><small>Chinmaya Gardens, Kolazhy, Thrissur</small></span></a>
    <nav id="primary-navigation" className={`navbar__links ${menuOpen ? 'is-open' : ''}`} aria-label="Primary">
      <a href="#home" aria-current={activeArea === 'home' ? 'location' : undefined} onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>Home</a>
      {destinations.map(({ label, items }, index) => {
        const isOpen = openDropdown === index;
        return <div className={`nav-dropdown ${isOpen ? 'is-open' : ''}`} key={label} onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(current => current === index ? null : current);
        }}>
          {label === 'About' ? <div className="nav-dropdown__heading">
            <a className="nav-dropdown__page-link" href="#about" aria-current={activeArea === 'about' ? 'location' : undefined} onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>About</a>
            <button ref={element => { dropdownTriggers.current[index] = element; }} className="nav-dropdown__trigger nav-dropdown__arrow" aria-label="About sections" aria-expanded={isOpen} aria-controls={`nav-panel-${index}`} onClick={() => setOpenDropdown(isOpen ? null : index)}><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg></button>
          </div> : <button ref={element => { dropdownTriggers.current[index] = element; }} className="nav-dropdown__trigger" aria-expanded={isOpen} aria-controls={`nav-panel-${index}`} onClick={() => setOpenDropdown(isOpen ? null : index)}>
            {label}<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </button>}
          <div id={`nav-panel-${index}`} className="nav-dropdown__panel" inert={!isOpen}>
            <div className="nav-dropdown__content">
              <p className="nav-dropdown__eyebrow">{label}</p>
              <ul>{items.map(item => <li key={item}>{sectionLinks[item] ? <a className="nav-dropdown__item" href={sectionLinks[item]} onClick={() => { setOpenDropdown(null); setMenuOpen(false); }}>{item}<span aria-hidden="true">↗</span></a> : <button className="nav-dropdown__item" disabled>{item}<span>Coming soon</span></button>}</li>)}</ul>
              {label === 'Admissions' && <a className="nav-dropdown__enquiry" href={enquiry}>Enquire about admissions <span aria-hidden="true">⟶</span></a>}
            </div>
          </div>
        </div>;
      })}
      <a className="navbar__mobile-link" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
      <a className="button button--primary navbar__mobile-link" href={enquiry}>Enquire Now <span aria-hidden="true">⟶</span></a>
    </nav>
    <a className="button button--primary navbar__enquire" href={enquiry}>Enquire Now <span aria-hidden="true">⟶</span></a>
    <button ref={toggle} className={`menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => { setMenuOpen(!menuOpen); setOpenDropdown(null); }}><span /><span /><span /></button>
  </div></header>;
}
