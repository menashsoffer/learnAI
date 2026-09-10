/**
 * Built-in scene illustrations — simple line art, no external assets, theme-aware
 * (strokes take `currentColor` from a wrapper that sets it to a brand token).
 * Referenced from a scene by `scene.image` = one of these ids.
 */
import type { ReactElement } from 'react';
import './illustrations.css';

const box = {
  viewBox: '0 0 128 128',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  role: 'img' as const,
};

const ROBOT = (
  <svg {...box} aria-label="רובוט">
    <circle cx="64" cy="14" r="3.5" className="ill-accent" />
    <line x1="64" y1="17" x2="64" y2="30" />
    <rect x="38" y="30" width="52" height="40" rx="9" />
    <circle cx="53" cy="49" r="5" className="ill-accent" />
    <circle cx="75" cy="49" r="5" className="ill-accent" />
    <line x1="54" y1="62" x2="74" y2="62" />
    <line x1="64" y1="70" x2="64" y2="79" />
    <rect x="44" y="79" width="40" height="30" rx="7" />
    <line x1="44" y1="88" x2="31" y2="97" />
    <line x1="84" y1="88" x2="97" y2="97" />
  </svg>
);

const KEYBOARD_BRAIN = (
  <svg {...box} aria-label="מקלדת מחוברת למוח">
    <rect x="14" y="90" width="58" height="24" rx="4" />
    <line x1="22" y1="98" x2="64" y2="98" strokeWidth="2" opacity="0.6" />
    <line x1="22" y1="106" x2="64" y2="106" strokeWidth="2" opacity="0.6" />
    <path d="M72 100 C 100 100 98 68 92 54" className="ill-accent" />
    <path d="M92 22 c -13 0 -19 9 -16 17 c -8 3 -7 15 2 17 c 1 9 13 12 19 6 c 9 4 20 -3 18 -13 c 7 -5 4 -18 -6 -20 c -3 -6 -12 -9 -17 -4 z" />
    <path
      d="M92 24 c -2 8 -2 14 -6 18 c 4 3 4 9 1 13 c 4 2 8 1 9 -3"
      strokeWidth="2"
      opacity="0.7"
    />
  </svg>
);

const CRAZY_COMPUTER = (
  <svg {...box} aria-label="מחשב משוגע">
    <rect x="26" y="34" width="76" height="54" rx="6" />
    <line x1="64" y1="88" x2="64" y2="102" />
    <line x1="46" y1="102" x2="82" y2="102" />
    <path
      d="M64 46 c 12 0 18 10 16 19 c -2 9 -14 13 -21 7 c -6 -5 -6 -15 2 -18 c 6 -2 12 3 11 9"
      className="ill-accent"
    />
    <path
      d="M32 28 c 3 -4 3 -8 0 -12 M44 24 c 3 -4 3 -8 0 -12"
      className="ill-accent"
      strokeWidth="2.5"
    />
    <line x1="24" y1="34" x2="16" y2="26" className="ill-accent" strokeWidth="2.5" />
    <line x1="104" y1="34" x2="112" y2="26" className="ill-accent" strokeWidth="2.5" />
  </svg>
);

const CAUTION = (
  <svg {...box} aria-label="זהירות">
    <path d="M64 22 L108 100 L20 100 Z" />
    <line x1="64" y1="48" x2="64" y2="78" className="ill-accent" strokeWidth="5" />
    <circle cx="64" cy="90" r="3.5" className="ill-accent" />
  </svg>
);

const DOG_PARK = (
  <svg {...box} aria-label="גינת כלבים מושקעת">
    <line x1="14" y1="106" x2="114" y2="106" />
    {/* fence */}
    <line x1="24" y1="80" x2="24" y2="106" strokeWidth="2.5" />
    <line x1="40" y1="80" x2="40" y2="106" strokeWidth="2.5" />
    <line x1="56" y1="80" x2="56" y2="106" strokeWidth="2.5" />
    <line x1="20" y1="86" x2="60" y2="86" strokeWidth="2.5" />
    <line x1="20" y1="98" x2="60" y2="98" strokeWidth="2.5" />
    {/* tree */}
    <line x1="98" y1="106" x2="98" y2="70" />
    <circle cx="98" cy="58" r="15" className="ill-accent-fill" />
    {/* dog */}
    <ellipse cx="74" cy="92" rx="13" ry="8" />
    <circle cx="88" cy="86" r="6" />
    <path d="M90 81 l 4 -5 M85 81 l -2 -6" strokeWidth="2.5" />
    <path d="M62 90 q -6 -3 -9 -9" strokeWidth="2.5" />
    <line x1="68" y1="99" x2="68" y2="106" strokeWidth="2.5" />
    <line x1="80" y1="99" x2="80" y2="106" strokeWidth="2.5" />
  </svg>
);

const TOOLBOX = (
  <svg {...box} aria-label="ארגז כלים">
    {/* handle */}
    <path d="M50 38 v-5 a14 14 0 0 1 28 0 v5" />
    {/* lid */}
    <rect x="20" y="38" width="88" height="22" rx="6" />
    {/* body */}
    <path d="M24 60 v40 a6 6 0 0 0 6 6 h68 a6 6 0 0 0 6 -6 v-40" />
    {/* latch */}
    <rect x="57" y="43" width="14" height="12" rx="3" className="ill-accent-fill" />
    {/* tray line */}
    <line x1="24" y1="82" x2="104" y2="82" strokeWidth="2" opacity="0.45" />
    {/* a wrench resting in the tray */}
    <path
      d="M46 94 l14 -14 M44 96 a5 5 0 1 0 -0.1 -0.1 M62 78 a5 5 0 1 0 6 6"
      className="ill-accent"
      strokeWidth="2.5"
    />
  </svg>
);

const REGISTRY: Record<string, ReactElement> = {
  robot: ROBOT,
  'keyboard-brain': KEYBOARD_BRAIN,
  'crazy-computer': CRAZY_COMPUTER,
  caution: CAUTION,
  'dog-park': DOG_PARK,
  toolbox: TOOLBOX,
};

export function SceneIllustration({ id, className }: { id?: string; className?: string }) {
  if (!id) return null;
  const art = REGISTRY[id];
  if (!art) {
    if (import.meta.env.DEV) console.warn(`[illustration] unknown id "${id}"`);
    return null;
  }
  return <div className={`illus${className ? ` ${className}` : ''}`}>{art}</div>;
}
