// Plain string helpers for raw HTML and XML, used by request-based checks (no browser).

export function extractSitemapLocations(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((match) => match[1]);
}

export function countH1(html: string): number {
  return [...html.matchAll(/<h1[\s>]/gi)].length;
}

// Site footer is the <footer role="contentinfo">, article footers have no role.
export function extractFooterLinks(html: string): string[] {
  const footer = html.match(/<footer[^>]*role="contentinfo"[^>]*>([\s\S]*?)<\/footer>/i);
  if (!footer) return [];
  return [...footer[1].matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
}

export function extractImageUrls(html: string): string[] {
  return [...html.matchAll(/<img\s[^>]*src="([^"]+)"/gi)].map((match) => match[1]);
}

export function toPath(url: string, origin: string): string | null {
  const parsed = new URL(url, origin);
  return parsed.origin === new URL(origin).origin ? parsed.pathname : null;
}
