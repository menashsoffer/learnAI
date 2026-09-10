/** Injectable time source so timer / elapsed logic is deterministic under test. */
export type Clock = () => number;

export const systemClock: Clock = () => Date.now();

export function fixedClock(startMs = 0): Clock & { advance: (ms: number) => void } {
  let now = startMs;
  const c = (() => now) as Clock & { advance: (ms: number) => void };
  c.advance = (ms: number) => {
    now += ms;
  };
  return c;
}
