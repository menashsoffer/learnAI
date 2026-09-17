import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/**
 * The participant URL as a projectable QR. This is how twenty-five people get onto the right
 * page in twenty seconds instead of mistyping a URL off a slide — worth the one tiny,
 * dependency-free library.
 *
 * Rendered as inline SVG paths rather than a canvas or an image, so it stays crisp on a
 * projector at any size and needs no raster asset.
 */
export function QrCode({
  value,
  size = 220,
  label = 'קוד סריקה לכניסת משתתפים',
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const path = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const count = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return { d, count };
  }, [value]);

  return (
    <svg
      className="qr"
      width={size}
      height={size}
      viewBox={`-2 -2 ${path.count + 4} ${path.count + 4}`}
      role="img"
      aria-label={label}
    >
      <rect x={-2} y={-2} width={path.count + 4} height={path.count + 4} fill="#fff" />
      <path d={path.d} fill="#000" shapeRendering="crispEdges" />
    </svg>
  );
}
