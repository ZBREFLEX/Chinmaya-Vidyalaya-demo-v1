import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { declarationDocuments } from '../src/content/cbseDeclarations.js';

test('declarations preserve the four supplied PDF files and legacy source order', () => {
  assert.deepEqual(declarationDocuments.map(doc => doc.id), ['no-homework-classes-1-2', 'single-shift', 'text-books-2025-2026', 'no-animals-practicals']);
  for (const doc of declarationDocuments) {
    const bytes = readFileSync(path.join('public', decodeURIComponent(doc.fileUrl)));
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', doc.fileName);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), doc.sha256, `Original PDF bytes must remain intact: ${doc.fileName}`);
    assert.equal(doc.downloadName, doc.fileName);
  }
});

test('dated textbook records and declarations remain accurately labelled', () => {
  assert.match(declarationDocuments.find(doc => doc.id === 'text-books-2025-2026').title, /2025–2026/);
  assert.match(declarationDocuments.find(doc => doc.id === 'single-shift').description, /08:30 AM to 03:00 PM/);
  assert.match(declarationDocuments.find(doc => doc.id === 'no-homework-classes-1-2').description, /Classes III–VIII/);
});
