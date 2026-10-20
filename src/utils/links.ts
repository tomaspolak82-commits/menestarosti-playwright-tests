export type LinkKind = 'internal' | 'external' | 'anchor' | 'email' | 'phone' | 'empty' | 'other';

// What a link points to, judged from its href on a page of the site.
export function linkKind(href: string, origin: string): LinkKind {
  const value = href.trim();
  if (value === '' || value === '#') return 'empty';
  if (value.startsWith('#')) return 'anchor';
  if (/^mailto:/i.test(value)) return 'email';
  if (/^tel:/i.test(value)) return 'phone';
  if (!/^(https?:|\/)/i.test(value)) return 'other';
  return new URL(value, origin).host === new URL(origin).host ? 'internal' : 'external';
}

// Address without the #fragment: the server never sees it.
export function withoutFragment(url: string, origin: string): string {
  const parsed = new URL(url, origin);
  parsed.hash = '';
  return parsed.href;
}

export function hasElementWithId(html: string, id: string): boolean {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\sid="${escaped}"`).test(html);
}
