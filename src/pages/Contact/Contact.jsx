import { whatsappNumber, schoolPhone, schoolEmail, schoolAddress, directionsUrl, mapEmbedUrl } from '../../config/contact';
import campus from '../../assets/images/hero/campus.jpeg';
import EnquiryButton from '../../components/enquiry/EnquiryButton';
import './Contact.css';

function ContactIcon({ type }) {
  const paths = {
    email: 'M3 5h18v14H3V5Zm0 0 9 8 9-8',
    phone: 'm7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3c0 3-2 5-5 4C8 19 5 16 3 8 2 5 4 3 7 3Z',
    chat: 'M21 11a9 9 0 0 1-9 9H7l-5 2 2-6a9 9 0 1 1 17-5ZM7 10h10M7 14h6',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}

export default function Contact() {
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I would like to know more about Chinmaya Vidyalaya Kolazhy.')}`;
  const contacts = [
    { icon: 'email', title: 'Send us an email', value: schoolEmail, text: 'For questions, information and school enquiries.', href: `mailto:${schoolEmail}`, action: 'Write to us' },
    { icon: 'chat', title: 'Chat on WhatsApp', value: whatsappNumber, text: 'Connect with us about admissions and school life.', href: whatsappUrl, action: 'Start a conversation', external: true },
    { icon: 'phone', title: 'Call the school office', value: schoolPhone, text: 'Speak with our team for information and assistance.', href: `tel:${schoolPhone.replace(/\s/g, '')}`, action: 'Call the office' },
    { icon: 'phone', title: 'Call our mobile', value: whatsappNumber, text: 'You can also reach us on our mobile number.', href: `tel:${whatsappNumber.replace(/\s/g, '')}`, action: 'Call our mobile' },
  ];

  return <main id="main" className="contact-page">
    <section className="contact-hero" aria-labelledby="contact-title"><div className="section-shell contact-hero__grid">
      <div><a className="contact-breadcrumb" href="/#home">Home <span aria-hidden="true"> / </span><span>Contact Us</span></a><p className="eyebrow">We’re here to help</p><h1 id="contact-title">Let’s start a<br /><em>conversation.</em></h1><p>Every brighter beginning starts with a connection. Whether you’re exploring admissions or have a question about our school, we’d love to hear from you.</p><EnquiryButton className="button button--primary">Enquire about admissions <span aria-hidden="true">⟶</span></EnquiryButton></div>
      <div className="contact-hero__photo"><img src={campus} alt="Tree-lined courtyard at Chinmaya Vidyalaya Kolazhy" width="1280" height="963" /><span>Rooted in values. Connected with care.</span></div>
    </div></section>

    <section className="section-shell contact-options" aria-labelledby="contact-options-title"><div className="contact-section-heading"><p className="eyebrow">Get in touch</p><h2 id="contact-options-title">A little closer.<br /><em>However you connect.</em></h2><p>Choose the way that works best for you.</p></div><div className="contact-options__grid">{contacts.map(contact => <article className="contact-card" key={contact.title}><span className={`contact-card__icon ${contact.icon === 'chat' ? 'contact-card__icon--whatsapp' : ''}`}><ContactIcon type={contact.icon} /></span><h3>{contact.title}</h3><a className="contact-card__value" href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{contact.value}</a><p>{contact.text}</p><a className="contact-card__action" href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{contact.action}<span aria-hidden="true">↗</span></a></article>)}</div></section>

    <section className="section-shell contact-visit" aria-labelledby="visit-title"><div className="contact-visit__copy"><p className="eyebrow">Find your way here</p><h2 id="visit-title">Come discover<br /><em>our campus.</em></h2><p>A welcoming place to learn, grow and belong. Get in touch with our team to arrange your visit.</p><address><ContactIcon type="pin" /><span><strong>Chinmaya Vidyalaya</strong>{schoolAddress}</span></address><a className="button button--primary" href={directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions <span aria-hidden="true">↗</span></a></div><iframe title="Chinmaya Vidyalaya Kolazhy campus location" src={mapEmbedUrl} width="800" height="500" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></section>
    <section className="section-shell contact-invitation"><div><p className="eyebrow">Your child’s next chapter</p><h2>A brighter beginning<br />starts here.</h2><p>Talk to us about becoming part of the Chinmaya Vidyalaya family.</p></div><EnquiryButton className="button button--primary">Enquire Now <span aria-hidden="true">⟶</span></EnquiryButton></section>
  </main>;
}
