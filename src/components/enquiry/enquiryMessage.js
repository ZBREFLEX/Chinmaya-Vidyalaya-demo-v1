import { whatsappNumber } from '../../config/contact';

export const admissionClasses = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, index) => `Class ${index + 1}`)];

export function buildEnquiryUrl({ parentName, phone, studentName, studentClass }) {
  const message = [
    'Hello Chinmaya Vidyalaya, I would like to enquire about admission.',
    '',
    `Parent / Guardian: ${parentName.trim()}`,
    `Contact number: ${phone.trim()}`,
    `Student name: ${studentName.trim()}`,
    `Admission sought for: ${studentClass}`,
    '',
    'Please share the admission process and availability. Thank you.',
  ].join('\n');
  const recipient = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}
