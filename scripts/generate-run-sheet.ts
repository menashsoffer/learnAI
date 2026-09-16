/**
 * Regenerates `documentation/RUN-SHEET.md` FROM the deck (`npm run run-sheet`).
 *
 * The run sheet used to be hand-maintained prose holding the authoritative minute budget —
 * which meant the pacing lived somewhere the app could not read, and could silently disagree
 * with the deck. Now the deck owns the numbers and this file is a printable view of them.
 * CI checks it is current, exactly as it must be regenerated after editing a budget.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { deckSchema } from '../src/engine/deck/schema';
import { buildPlan } from '../src/engine/pacing/plan';
import type { StageBudget } from '../src/engine/pacing/types';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const DECK_ID = process.env.DECK_ID ?? 'ai-cadets-2026';

const raw = JSON.parse(
  readFileSync(join(root, 'content', 'decks', DECK_ID, 'deck.json'), 'utf8'),
) as unknown;
const deck = deckSchema.parse(raw);

const stages: StageBudget[] = deck.scenes.map((s) => ({
  slug: s.slug,
  title: s.title,
  stage: s.stage,
  budgetMin: s.budgetMin ?? 1,
  optional: s.optional ?? false,
  controlPoint: s.controlPoint,
}));
const plan = buildPlan(stages, deck.meta.totalMinutes ?? 0);

const rows = plan.stages
  .map(
    (s, i) =>
      `| ${i + 1} | ${s.stage} | ${s.title} | ${s.budgetMin} | ${s.endMin} | ` +
      `${s.optional ? 'רשות' : '—'} |`,
  )
  .join('\n');

const controlPoints = plan.stages
  .filter((s) => s.controlPoint)
  .map((s) => `- **${s.stage}** (דקה ${s.startMin}–${s.endMin}): ${s.controlPoint}`)
  .join('\n');

const prep = (deck.meta.prepChecklist ?? [])
  .map(
    (p) =>
      `| ${p.label} | ${p.required ? '⚠️ **חובה**' : 'מומלץ'} |` +
      (p.note ? ` ${p.note} |` : ' — |'),
  )
  .join('\n');

const md = `<!--
  GENERATED FILE — do not edit by hand.
  The deck owns the pacing; this is a printable view of it.
  Regenerate with: npm run run-sheet
-->

# דף ריצה — ${plan.totalMin} דקות

${deck.meta.title} · ${plan.stages.length} שלבים · ${plan.plannedMin} דקות מתוקצבות${
  plan.slackMin >= 0 ? ` · ${plan.slackMin} דקות באפר` : ` · **חריגה של ${-plan.slackMin} דקות**`
}

${prep ? `## הכנה לפני ההרצאה\n\n| פריט | סטטוס | הערה |\n| :--- | :--- | :--- |\n${prep}\n` : ''}
## הריצה

| #   | שלב | יחידה | דק׳ | מצטבר | דילוג |
| :-- | :-- | :---- | :-- | :---- | :---- |
${rows}

${controlPoints ? `## נקודות בקרה\n\n${controlPoints}\n` : ''}
---

המנחה לא צריך לזכור את הטבלה הזאת. מצב מנחה מציג את אותו מידע חי — שעון מצטבר מול תוכנית,
תקציב לשלב הנוכחי, ונקודת הבקרה של השלב שאתה עומד בו.
`;

const out = join(root, 'documentation', 'RUN-SHEET.md');
if (process.argv.includes('--check')) {
  const current = readFileSync(out, 'utf8');
  if (current !== md) {
    console.error('RUN-SHEET.md is stale — run `npm run run-sheet` and commit the result.');
    process.exit(1);
  }
  console.log('RUN-SHEET.md is current.');
} else {
  writeFileSync(out, md);
  console.log(
    `wrote ${out} (${plan.stages.length} stages, ${plan.plannedMin}/${plan.totalMin} min)`,
  );
}
