import { pages } from './pages';

// Limits for US-007. Values are in the requirement too (for people); keep both in sync.
export const downloads = {
  page: pages.downloads,
  fileExtension: /\.pdf$/i,
  pdfContentType: 'application/pdf',
  // Every real PDF file starts with these bytes.
  pdfSignature: '%PDF-',
  maxFileBytes: 2 * 1024 * 1024,
  // The link text must tell it is a download (AK5).
  downloadWords: /pdf|stáhn|stažen/i,
  // Recommended: the link also names the file type and size, e.g. "(PDF, 66 kB)". Missing = warning only.
  typeAndSize: /pdf[^a-z]*\d[\d\s,.]*\s*(kb|mb)/i,
} as const;
