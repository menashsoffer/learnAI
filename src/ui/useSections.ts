import { useMemo } from 'react';
import { useDeck, usePresentation } from '@/react/PresentationProvider';
import { buildSections, hueStyle, type Part } from './sections';

/** The deck's divider map, memoised per deck. */
export function useSections() {
  const deck = useDeck();
  return useMemo(() => buildSections(deck.scenes), [deck]);
}

/** The part the room is in right now, and the style that paints a subtree in its hue. */
export function useCurrentPart(): {
  part: Part;
  partIdx: number;
  style: ReturnType<typeof hueStyle>;
} {
  const { parts, partIndex } = useSections();
  const index = usePresentation((s) => s.index);
  const partIdx = partIndex[index] ?? 0;
  const part = parts[partIdx]!;
  return { part, partIdx, style: hueStyle(part.hue) };
}
