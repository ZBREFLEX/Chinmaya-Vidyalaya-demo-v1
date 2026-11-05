import { declarationDocuments } from './cbseDeclarations';

// The newly supplied textbook PDF is byte-identical to this verified original.
export const textBookDocuments = [declarationDocuments.find(doc => doc.id === 'text-books-2025-2026')];
export const cbseCurriculum = {
  title: 'CBSE Curriculum',
  academicYear: '2023–24',
  url: 'https://cbseacademic.nic.in/curriculum_2024.html',
  description: 'View the CBSE Academic curriculum and subject syllabi for Secondary (IX–X) and Senior Secondary (XI–XII). The linked curriculum is for the academic year 2023–24.',
};
