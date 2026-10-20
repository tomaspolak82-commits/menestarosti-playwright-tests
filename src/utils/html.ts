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

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name: string) => entities[name.toLowerCase()] ?? match);
}

// The page title is the <title> in <head>; inline SVG icons in the body have their own <title> elements.
export function extractTitle(html: string): string | null {
  const head = html.match(/<head[\s>][\s\S]*?<\/head>/i)?.[0] ?? '';
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return title ? decodeEntities(title[1]).trim() : null;
}

// Content of <meta name="…"> or <meta property="…">, whatever the attribute order.
export function extractMeta(html: string, key: string): string | null {
  for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
    const name = tag.match(/\s(?:name|property)="([^"]*)"/i)?.[1];
    if (name?.toLowerCase() !== key.toLowerCase()) continue;
    const content = tag.match(/\scontent="([^"]*)"/i)?.[1];
    return content === undefined ? null : decodeEntities(content).trim();
  }
  return null;
}

export function extractCanonical(html: string): string | null {
  for (const tag of html.match(/<link\s[^>]*>/gi) ?? []) {
    if (!/\srel="canonical"/i.test(tag)) continue;
    return tag.match(/\shref="([^"]*)"/i)?.[1] ?? null;
  }
  return null;
}

export type HtmlLink = { href: string; text: string };

// Every <a href> with its visible text; an image inside the link contributes its alt text.
export function extractLinks(html: string): HtmlLink[] {
  return [...html.matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => {
    const alts = [...match[2].matchAll(/<img\s[^>]*alt="([^"]*)"/gi)].map((alt) => alt[1]);
    const text = [match[2].replace(/<[^>]+>/g, ' '), ...alts].join(' ');
    return { href: decodeEntities(match[1]), text: decodeEntities(text).replace(/\s+/g, ' ').trim() };
  });
}

export function toPath(url: string, origin: string): string | null {
  const parsed = new URL(url, origin);
  return parsed.origin === new URL(origin).origin ? parsed.pathname : null;
}

// The article itself (WordPress "single-entry"), without the related-post cards below it, which are articles too.
export function extractSingleArticle(html: string): string {
  return html.match(/<article\s[^>]*class="[^"]*\bsingle-entry\b[^"]*"[^>]*>[\s\S]*?<\/article>/i)?.[0] ?? '';
}

// Links in post titles (class "entry-title") of a list page such as the article overview.
export function extractEntryTitleLinks(html: string): HtmlLink[] {
  return [...html.matchAll(/<(h[1-6])\s[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi)].flatMap((match) => extractLinks(match[2]));
}

// Visible text of <time itemprop="…">, e.g. the publish date of an article.
export function extractTimeText(html: string, itemprop: string): string | null {
  for (const match of html.matchAll(/<time\s([^>]*)>([\s\S]*?)<\/time>/gi)) {
    if (match[1].match(/\bitemprop="([^"]*)"/i)?.[1] !== itemprop) continue;
    return decodeEntities(match[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  }
  return null;
}

export type HtmlDetails = { summary: string; html: string };

// Collapsible blocks (<details> with a <summary> heading), e.g. the sources section of an article.
export function extractDetails(html: string): HtmlDetails[] {
  return [...html.matchAll(/<details[\s>][\s\S]*?<\/details>/gi)].map((match) => {
    const summary = match[0].match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ?? '';
    return { summary: decodeEntities(summary.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(), html: match[0] };
  });
}
