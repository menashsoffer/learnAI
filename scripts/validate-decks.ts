/**
 * CI gate (run: `npm run validate:decks`):
 *   1. every deck JSON passes the full Zod structure schema
 *   2. slug-stability guard — a released slug must not vanish without a `redirects` entry
 *
 * Per-scene `data` validation against scene-type schemas is covered by the Vitest suite
 * (`src/scenes/validateDeck` + `tests/`), which can resolve the React/CSS scene modules.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { deckSchema } from '../src/engine/deck/schema';

const here = dirname(fileURLToPath(import.meta.url));
const decksDir = join(here, '..', 'content', 'decks');
const releasedPath = join(here, 'released-slugs.json');

const released: Record<string, string[]> = JSON.parse(readFileSync(releasedPath, 'utf8'));

let failures = 0;
const fail = (msg: string) => {
  failures += 1;
  console.error(`  ✗ ${msg}`);
};

const deckIds = readdirSync(decksDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const id of deckIds) {
  console.log(`\ndeck: ${id}`);
  const raw = JSON.parse(readFileSync(join(decksDir, id, 'deck.json'), 'utf8'));

  const parsed = deckSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fail(`${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
    continue;
  }
  const deck = parsed.data;
  console.log(`  ✓ structure ok (${deck.scenes.length} scenes)`);

  if (deck.meta.id !== id) fail(`meta.id "${deck.meta.id}" != folder "${id}"`);

  const currentSlugs = new Set(deck.scenes.map((s) => s.slug));
  const redirects = deck.meta.redirects ?? {};
  for (const slug of released[id] ?? []) {
    if (!currentSlugs.has(slug) && !(slug in redirects)) {
      fail(`released slug "${slug}" was removed without a redirects entry`);
    }
  }
  for (const [from, to] of Object.entries(redirects)) {
    if (!currentSlugs.has(to)) fail(`redirect "${from}" -> "${to}" targets a missing slug`);
  }
  console.log('  ✓ slug-stability ok');
}

if (failures > 0) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log('\nAll decks valid.');
