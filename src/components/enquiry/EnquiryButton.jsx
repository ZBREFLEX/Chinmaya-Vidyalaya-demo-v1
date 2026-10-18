import { useContext } from 'react';
import { EnquiryContext } from './EnquiryContext';

export default function EnquiryButton({ children, className, onClick }) {
  const openEnquiry = useContext(EnquiryContext);
  return <button type="button" className={className} aria-haspopup="dialog" onClick={event => {
    onClick?.(event);
    openEnquiry(event.currentTarget);
  }}>{children}</button>;
}
