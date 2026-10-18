import EnquiryButton from '../enquiry/EnquiryButton';
import { useEffect, useState } from 'react';
import reference from '../../assets/images/hero/design-reference.png';
import campus from '../../assets/images/hero/campus.jpeg';
import kindergarten from '../../assets/images/kindergarten.png';
import soccer from '../../assets/images/soccer.png';
import studentTrophy from '../../assets/images/student-trophy.png';
import bharatanatyam from '../../assets/images/bharatanatyam.png';
import About from '../../pages/About/About';
import './HomeSections.css';

const features = ['Play-based learning', 'Caring and experienced teachers', 'Safe and secure environment', 'Focus on overall development'];
const highlights = [
  { title: <>Our students<br />make us <em>proud.</em></>, text: 'From academic excellence to sports, arts and cultural achievements, we celebrate the curiosity, dedication and talents of our students.', image: studentTrophy, label: 'Smiling student holding a gold trophy while classmates applaud' },
  { title: <>Learning teamwork.<br />Growing in <em>confidence.</em></>, text: 'On the playing field, children discover the joy of participation, build resilience and learn to support one another.', image: soccer, label: 'Schoolboys playing football together on a green field' },
  { title: <>Creative expression.<br />A world of <em>possibilities.</em></>, text: 'Arts and cultural activities give every child opportunities to express themselves and connect with our rich traditions.', image: bharatanatyam, label: 'Children performing Bharatanatyam in colourful traditional costumes' },
];

function Photo({ crop: [x, y, width, height] = [0, 0, 1, 1], image, label, className = '' }) {
  if (image) return <img src={image} alt={label} className={className} loading="lazy" />;
  return <div className={`reference-photo ${className}`} role="img" aria-label={label} style={{ '--photo-ratio': `${width} / ${height}` }}>
    <div className="reference-photo__frame"><img src={reference} alt="" aria-hidden="true" loading="lazy" style={{ width: `${686 / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} /></div>
  </div>;
}

function FeatureIcon({ index }) {
  const paths = ['M5 12h14M12 5v14M5 5h4v4H5zM15 15h4v4h-4z', 'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3a6 6 0 0 1 12 0v3M17 5a4 4 0 0 1 0 8M18 16a5 5 0 0 1 4 5', 'm12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Zm-4 10 3 3 5-6', 'm12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z'];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[index]} /></svg>;
}

export default function HomeSections() {
  const [active, setActive] = useState(0);

  useEffect(() => {

    const timer = window.setTimeout(() => {
      setActive(current => (current + 1) % highlights.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [active]);

  const slide = highlights[active];
  return <>
    <section className="home-section kindergarten" id="kindergarten" aria-labelledby="kindergarten-title">
      <div className="section-shell kindergarten__grid">
        <img src={kindergarten} alt="Kindergarten children exploring colourful wooden blocks together in a classroom" className="kindergarten__photo" width="1536" height="1024" loading="lazy" />
        <div className="section-copy"><p className="eyebrow">Kindergarten</p><h2 id="kindergarten-title">Little steps.<br /><em>Big beginnings.</em></h2><p>Our Kindergarten (LKG &amp; UKG) provides a warm, nurturing and joyful environment where children discover, explore and grow with confidence.</p><a className="button button--primary" href="mailto:chinvidhya@gmail.com?subject=Kindergarten%20enquiry">Explore Kindergarten <span aria-hidden="true">⟶</span></a></div>
        <ul className="kindergarten__features">{features.map((feature, index) => <li key={feature}><span className="feature-icon"><FeatureIcon index={index} /></span><span>{feature}</span></li>)}</ul>
      </div>
    </section>

    <section className="home-section approach" id="our-approach" aria-labelledby="approach-title">
      <div className="section-shell approach__grid"><div className="section-copy"><p className="eyebrow">Our approach</p><h2 id="approach-title">Education<br />with <em>values</em><br />for life.</h2><p>We combine academic excellence with strong value-based education, helping every child grow into a responsible and compassionate individual.</p><a className="button button--outline" href="#about">About Chinmaya Vidyalaya <span aria-hidden="true">⟶</span></a></div><div className="approach__visual"><img src={campus} alt="Chinmaya Vidyalaya courtyard surrounded by school buildings and trees" loading="lazy" /><div className="approach__note" id="our-values">A positive environment<br />to learn, grow and belong.<span /></div></div></div>
    </section>

    <section className="home-section achievements" id="achievements" aria-labelledby="achievement-title">
      <div className="section-shell achievements__grid"><Photo crop={slide.crop} image={slide.image} label={slide.label} className="achievements__photo" /><div className="section-copy"><p className="eyebrow">Achievements</p><div className="achievements__slide" aria-live="off" aria-atomic="true"><h2 id="achievement-title">{slide.title}</h2><p>{slide.text}</p></div><a className="button button--outline" href="mailto:chinvidhya@gmail.com?subject=Student%20achievements%20enquiry">Discover Our Achievements <span aria-hidden="true">⟶</span></a><div className="carousel-controls"><button type="button" aria-label="Previous highlight" onClick={() => setActive(current => (current - 1 + highlights.length) % highlights.length)}>←</button><span><strong>{String(active + 1).padStart(2, '0')}</strong> / 03</span><button type="button" aria-label="Next highlight" onClick={() => setActive(current => (current + 1) % highlights.length)}>→</button></div></div></div>
    </section>

    <section className="home-section campus-life" id="campus-life" aria-labelledby="campus-life-title"><div className="section-shell campus-life__grid"><div className="section-copy"><p className="eyebrow">Campus life</p><h2 id="campus-life-title">A vibrant campus<br />for a well-rounded<br />child.</h2><p>From academics to sports to life skills, our campus provides the right environment for every child to discover their potential.</p><a className="button button--primary" href="mailto:chinvidhya@gmail.com?subject=Campus%20life%20enquiry">Explore Campus Life <span aria-hidden="true">⟶</span></a></div><div className="campus-life__photos"><figure><Photo crop={[284, 1390, 122, 195]} label="Student reading in the library" /><figcaption>Discover</figcaption></figure><figure><Photo crop={[422, 1390, 114, 195]} label="Children playing football outdoors" /><figcaption>Play</figcaption></figure><figure><Photo crop={[550, 1390, 100, 195]} label="Children celebrating through traditional dance" /><figcaption>Create</figcaption></figure></div></div></section>

    <About />

    <section className="admissions section-shell" id="admissions" aria-labelledby="admissions-title"><div className="section-copy"><p className="eyebrow">Admissions</p><h2 id="admissions-title">Be a part of the<br />Chinmaya Vidyalaya family.</h2><p>Explore admissions for Kindergarten (LKG &amp; UKG) to Class 10.<br />Get in touch with us today.</p></div><div className="admissions__right"><div className="admissions__doodle" aria-hidden="true"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="15" /><path d="M40 4v12m0 48v12M4 40h12m48 0h12M14 14l9 9m34 34 9 9M14 66l9-9m34-34 9-9" /></svg><span>Learning.<br />Growing.<br />Together.</span></div><div className="admissions__actions"><EnquiryButton className="button button--primary">Enquire Now <span aria-hidden="true">⟶</span></EnquiryButton><a className="button button--outline" href="#contact">Contact Us</a></div></div></section>


  </>;
}
