import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { cbseDocuments } from '../src/content/cbseDisclosure.js';
import { affiliationDocuments } from '../src/content/cbseAffiliation.js';
import { accreditationDocuments } from '../src/content/cbseAccreditation.js';

test('CBSE disclosure contains exactly 14 verified document records', () => {
  assert.equal(cbseDocuments.length, 14, 'Must have exactly 14 document records');
  const ids = cbseDocuments.map(d => d.id);
  assert.equal(new Set(ids).size, 14, 'Every document must have a unique ID');

  const numbers = cbseDocuments.map(d => d.number);
  assert.deepEqual(numbers, Array.from({ length: 14 }, (_, i) => i + 1), 'Numbers must be sequential 1 to 14');
});

test('Every configured PDF exists on disk in public/CBSE files/ and is non-empty', () => {
  const dir = path.resolve('public/CBSE files');
  assert.ok(fs.existsSync(dir), 'public/CBSE files directory must exist');

  const diskFiles = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'));
  assert.equal(diskFiles.length, 14, 'Disk directory must contain exactly 14 files');

  cbseDocuments.forEach(doc => {
    const filePath = path.join(dir, doc.fileName);
    assert.ok(fs.existsSync(filePath), `File on disk must exist for: ${doc.fileName}`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 1000, `File ${doc.fileName} must be non-empty (size: ${stat.size})`);
    assert.ok(doc.fileUrl.startsWith('/CBSE%20files/'), `fileUrl must use /CBSE%20files/ URL prefix: ${doc.fileUrl}`);
    assert.ok(doc.downloadName.endsWith('.pdf'), `downloadName must be a PDF file: ${doc.downloadName}`);
    assert.ok(doc.title && doc.title.length > 3, `Title must be descriptive: ${doc.title}`);
    assert.ok(doc.category && doc.category.length > 3, `Category must be present: ${doc.category}`);
  });
});

test('All six affiliation records resolve to real PDF documents', () => {
  assert.equal(affiliationDocuments.length, 6);
  assert.equal(new Set(affiliationDocuments.map(doc => doc.id)).size, 6);
  for (const doc of affiliationDocuments) {
    const filePath = path.join('public', decodeURIComponent(doc.fileUrl));
    const bytes = fs.readFileSync(filePath);
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', doc.fileName);
  }
});

test('All four accreditation records resolve to real PDF documents', () => {
  assert.equal(accreditationDocuments.length, 4);
  assert.equal(new Set(accreditationDocuments.map(doc => doc.id)).size, 4);
  for (const doc of accreditationDocuments) {
    const bytes = fs.readFileSync(path.join('public', decodeURIComponent(doc.fileUrl)));
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', doc.fileName);
  }
});

test('All 14 required document titles are accurately represented', () => {
  const expectedTitles = [
    'Mandatory Public Disclosure',
    'Affiliation Upgradation Extension Orders',
    'Trust Deed',
    'No Objection Certificate',
    'Building Safety Certificate',
    'Fire Safety Certificate',
    'Copy of Letter Submitted at the Time of Extension of Affiliation',
    'Safe Drinking Water and Sanitary Condition Certificate & Water Analysis Test Report',
    'Fee Structure of School',
    'Annual Academic Calendar',
    'List of School Management Committee',
    'List of Parent Advisory Committee',
    'Last Three Years Result',
    'Possession (Land) Certificate',
  ];

  const actualTitles = cbseDocuments.map(d => d.title);
  assert.deepEqual(actualTitles, expectedTitles, 'Document titles must match the required 14 titles');
});

