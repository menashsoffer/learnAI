import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

/**
 * The machine-readable surface agents and crawlers read. These files have no runtime that
 * would catch a typo, and a broken sitemap or malformed JSON-LD fails silently in production
 * — so they are asserted here instead.
 *
 * CANONICAL_ORIGIN must match `base` in vite.config.ts and the canonical link in index.html.
 */
const CANONICAL = 'https://menashsoffer.github.io/learnAI/';

const read = (rel: string) =>
  readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), 'utf8');

/** Prettier wraps long tags across lines; assert on intent, not on line breaks. */
const flat = (html: string) => html.replace(/\s+/g, ' ');

describe('index.html — the pre-JavaScript view', () => {
  const html = read('index.html');

  it('declares language and direction', () => {
    expect(html).toMatch(/<html lang="he" dir="rtl">/);
  });

  it('has the four entity-resolution signals', () => {
    const f = flat(html);
    expect(f).toContain(`<link rel="canonical" href="${CANONICAL}" />`);
    expect(f).toMatch(/<meta property="og:type" content="website" \/>/);
    expect(f).toMatch(/<meta property="og:image" content="[^"]+og-image\.png" \/>/);
    expect(f).toMatch(/<meta name="description" content="[^"]{50,}"/);
  });

  it('serves a single H1 with sequential heading levels below it', () => {
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    // no level may jump by more than one from the deepest level seen so far
    let deepest = 1;
    for (const l of levels) {
      expect(l).toBeLessThanOrEqual(deepest + 1);
      deepest = Math.max(deepest, l);
    }
  });

  it('carries at least 500 characters of real content without running JavaScript', () => {
    const root = html.slice(html.indexOf('<div id="root">'), html.indexOf('</div>\n    <script'));
    const text = root
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    expect(text.length).toBeGreaterThanOrEqual(500);
  });

  it('embeds valid JSON-LD naming the site, the instructor and the course', () => {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(m).not.toBeNull();
    const ld = JSON.parse(m![1]);
    expect(ld['@context']).toBe('https://schema.org');

    const types = ld['@graph'].map((n: { '@type': string }) => n['@type']);
    expect(types).toEqual(expect.arrayContaining(['WebSite', 'Person', 'Course']));

    const person = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Person');
    expect(person.contactPoint.email).toMatch(/@/);
    expect(person.sameAs.length).toBeGreaterThan(0);

    const course = ld['@graph'].find((n: { '@type': string }) => n['@type'] === 'Course');
    expect(course.url).toBe(CANONICAL);
    expect(course.teaches.length).toBeGreaterThanOrEqual(3);
  });
});

describe('robots.txt', () => {
  const txt = read('public/robots.txt');

  it('points at the sitemap with an absolute URL', () => {
    expect(txt).toContain(`Sitemap: ${CANONICAL}sitemap.xml`);
  });

  it.each([
    'ChatGPT-User',
    'GPTBot',
    'OAI-SearchBot',
    'ClaudeBot',
    'Google-Extended',
    'PerplexityBot',
    'DeepSeekBot',
    'ora-agent',
  ])('allows %s', (agent) => {
    const block = txt.slice(txt.indexOf(`User-agent: ${agent}`));
    expect(block).toMatch(/^User-agent: .+\nAllow: \//);
  });

  it('disallows nothing', () => {
    expect(txt).not.toMatch(/^Disallow: \S/m);
  });
});

describe('sitemap.xml', () => {
  const xml = read('public/sitemap.xml');

  it('is well-formed XML in the sitemaps.org namespace', () => {
    expect(XMLValidator.validate(xml)).toBe(true);
    expect(xml).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
  });

  it('lists every real page with an ISO lastmod, and no fragment URLs', () => {
    const parsed = new XMLParser().parse(xml);
    const urls: Array<{ loc: string; lastmod: string }> = [parsed.urlset.url].flat();
    const locs = urls.map((u) => u.loc);

    expect(locs).toEqual([
      CANONICAL,
      `${CANONICAL}about/`,
      `${CANONICAL}contact/`,
      `${CANONICAL}privacy/`,
    ]);
    // Fragments are not separate documents — listing them would be invalid.
    expect(locs.some((l) => l.includes('#'))).toBe(false);
    for (const u of urls) expect(String(u.lastmod)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('llms.txt', () => {
  const txt = read('public/llms.txt');

  it('opens with an H1 and a blockquote summary, per the llms.txt convention', () => {
    const lines = txt.split('\n');
    expect(lines[0]).toMatch(/^# .+/);
    expect(lines.slice(1, 5).join('\n')).toMatch(/^\s*>/m);
  });

  it('carries an explicit when-to-use section', () => {
    expect(txt).toMatch(/^## When to use this site$/m);
    // guidance, not marketing: it must also say what NOT to use the site for
    expect(txt).toMatch(/Do \*\*not\*\* use this site/);
  });

  it('links every page the sitemap lists', () => {
    for (const p of ['', 'about/', 'contact/', 'privacy/']) {
      expect(txt).toContain(`${CANONICAL}${p}`);
    }
  });
});

describe('trust anchor pages', () => {
  it.each(['about', 'contact', 'privacy'])(
    '/%s/ has a canonical, an H1 and 500+ characters of content',
    (page) => {
      const html = read(`public/${page}/index.html`);
      expect(html).toContain(`<link rel="canonical" href="${CANONICAL}${page}/" />`);
      expect(html).toMatch(/<html lang="he" dir="rtl">/);
      expect([...html.matchAll(/<h1[\s>]/g)]).toHaveLength(1);

      const body = html.slice(html.indexOf('<body>'));
      const text = body
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      expect(text.length).toBeGreaterThanOrEqual(500);
    },
  );
});

describe('404.html', () => {
  const html = read('public/404.html');

  it('is excluded from indexing', () => {
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });

  it('gives an agent somewhere to go next', () => {
    for (const p of ['/learnAI/', '/learnAI/sitemap.xml', '/learnAI/llms.txt']) {
      expect(html).toContain(`href="${p}"`);
    }
  });
});
