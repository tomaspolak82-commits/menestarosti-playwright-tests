// Minimal robots.txt reading: rules for "User-agent: *" only, which is what Google and others fall back to.

export function disallowedPrefixes(robotsTxt: string): string[] {
  const prefixes: string[] = [];
  let forAll = false;
  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, '').trim();
    const [field, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (/^user-agent$/i.test(field)) forAll = value === '*';
    else if (forAll && /^disallow$/i.test(field) && value) prefixes.push(value);
  }
  return prefixes;
}

export function sitemapUrls(robotsTxt: string): string[] {
  return [...robotsTxt.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map((match) => match[1]);
}
