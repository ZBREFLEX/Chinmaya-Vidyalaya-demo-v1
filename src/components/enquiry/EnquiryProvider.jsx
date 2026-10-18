import { useEffect, useRef } from 'react';
import { EnquiryContext } from './EnquiryContext';
import { admissionClasses, buildEnquiryUrl } from './enquiryMessage';
import './Enquiry.css';

export default function EnquiryProvider({ children }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const previousOverflow = useRef('');

  function openEnquiry(button) {
    if (dialog.current.open) return;
    trigger.current = button;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    dialog.current.querySelector('input').focus();
    document.body.style.overflow = 'hidden';
  }

  function restorePage() {
    document.body.style.overflow = previousOverflow.current;
    const returnTarget = trigger.current?.getClientRects().length ? trigger.current : document.querySelector('.navbar__enquire');
    returnTarget?.focus();
  }

  useEffect(() => () => {
    if (dialog.current?.open) document.body.style.overflow = previousOverflow.current;
  }, []);

  function submitEnquiry(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    window.location.assign(buildEnquiryUrl(values));
  }

  return <EnquiryContext.Provider value={openEnquiry}>
    {children}
    <dialog ref={dialog} className="enquiry-dialog" aria-labelledby="enquiry-title" aria-describedby="enquiry-description" onClose={restorePage}>
      <button type="button" className="enquiry-dialog__close" aria-label="Close admission enquiry" onClick={() => dialog.current.close()}>×</button>
      <p className="eyebrow">Admissions</p>
      <h2 id="enquiry-title">A brighter beginning.</h2>
      <p id="enquiry-description">Tell us a little about your family. We’ll prepare your admission enquiry on WhatsApp.</p>
      <form className="enquiry-form" onSubmit={submitEnquiry}>
        <label htmlFor="enquiry-parent">Parent / guardian name
          <input id="enquiry-parent" name="parentName" autoComplete="name" required maxLength={100} pattern=".*\S.*" autoFocus />
        </label>
        <label htmlFor="enquiry-phone">Parent contact number
          <input id="enquiry-phone" name="phone" type="tel" autoComplete="tel" required maxLength={25} pattern="\+?[0-9\s\(\)\-]{7,25}" title="Enter a phone number with 7 to 25 characters, using digits, spaces, brackets or a leading +." />
        </label>
        <label htmlFor="enquiry-student">Student name
          <input id="enquiry-student" name="studentName" autoComplete="off" required maxLength={100} pattern=".*\S.*" />
        </label>
        <label htmlFor="enquiry-class">Class applying for
          <select id="enquiry-class" name="studentClass" required defaultValue="">
            <option value="" disabled>Select a class</option>
            {admissionClasses.map(studentClass => <option key={studentClass}>{studentClass}</option>)}
          </select>
        </label>
        <p className="enquiry-form__note">You can review the message in WhatsApp before sending it to the school.</p>
        <button type="submit" className="button button--primary">Continue to WhatsApp <span aria-hidden="true">⟶</span></button>
      </form>
    </dialog>
  </EnquiryContext.Provider>;
}
