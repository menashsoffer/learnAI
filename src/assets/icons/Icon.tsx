import type { ReactElement, SVGProps } from 'react';

/**
 * The manual's pictograms: one 24-unit grid, one 1.75 stroke, square caps. Drawn here rather
 * than borrowed from glyphs (▶ ⏸ ✕ ▦), which render in whatever font the system has and
 * never match each other.
 *
 * Direction: this is an RTL deck, so "next" points LEFT and "prev" points RIGHT.
 */

type IconName =
  | 'next'
  | 'prev'
  | 'grid'
  | 'fullscreen'
  | 'close'
  | 'play'
  | 'pause'
  | 'check'
  | 'reset'
  | 'copy'
  | 'text-size'
  | 'presenter'
  | 'phone'
  | 'laptop'
  | 'book'
  | 'skip'
  | 'jump'
  | 'chevron-up'
  | 'chevron-down';

const PATHS: Record<IconName, ReactElement> = {
  next: <path d="M15 5 8 12l7 7" />,
  prev: <path d="m9 5 7 7-7 7" />,
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  fullscreen: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  /* Media glyphs are not mirrored in RTL: play points the way tape runs. */
  play: <path d="M7 5v14l11-7z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  check: <path d="m19 7-9.5 10L5 12.5" />,
  reset: <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4v4.5h-4.5" />,
  copy: (
    <>
      <rect x="4" y="8" width="11" height="12" />
      <path d="M9 8V4h11v12h-5" />
    </>
  ),
  'text-size': <path d="M3 19 8.5 5h1L15 19M5.2 14h7.6M16 19l3.2-8h.6L23 19M16.9 16.5h5.2" />,
  presenter: (
    <>
      <rect x="3" y="4" width="18" height="12" />
      <path d="M12 16v4M8 20h8" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" />
      <path d="M11 18h2" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4" width="16" height="11" rx="1" />
      <path d="M2 18h20M9 18v1.5h6V18" />
    </>
  ),
  book: (
    <path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14" />
  ),
  skip: <path d="M13 5 6 12l7 7M18 5v14" />,
  jump: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
};

export function Icon({
  name,
  size = 20,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  const filled = name === 'play';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="icon"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
