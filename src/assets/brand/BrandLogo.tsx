import cadetsAvif from './cadets-logo.avif';
import cadetsPng from './cadets-logo.png';
import ministryAvif from './ministry-logo.avif';
import ministryPng from './ministry-logo.png';
import './brand.css';

/**
 * The two organisational marks behind the programme.
 *
 * Each is served as AVIF with a PNG fallback: the source art is the same 360x92 either way,
 * so AVIF only buys bytes — the PNG is there because a locked-down municipal laptop at the
 * venue may predate AVIF support, and a missing logo on the projector is not recoverable
 * mid-lecture. The browser downloads exactly one of the two.
 *
 * Vite fingerprints them for the hosted build and inlines them as data URIs for the offline
 * single-file target, so the artifact stays self-contained with no network.
 */

type Size = 'sm' | 'md' | 'lg';

const MARKS = {
  cadets: { avif: cadetsAvif, png: cadetsPng, alt: 'צוערים לשלטון המקומי' },
  ministry: { avif: ministryAvif, png: ministryPng, alt: 'משרד הפנים' },
} as const;

export type BrandMark = keyof typeof MARKS;

export function BrandLogo({ mark, size = 'md' }: { mark: BrandMark; size?: Size }) {
  const { avif, png, alt } = MARKS[mark];
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <img className={`brand-logo brand-logo--${size}`} src={png} alt={alt} />
    </picture>
  );
}

/** Both marks side by side — the programme, then the ministry that runs it. */
export function BrandLockup({ size = 'md' }: { size?: Size }) {
  return (
    <div className="brand-lockup">
      <BrandLogo mark="cadets" size={size} />
      <span className="brand-lockup__rule" aria-hidden="true" />
      <BrandLogo mark="ministry" size={size} />
    </div>
  );
}
