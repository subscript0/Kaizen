import { Boxes } from 'lucide-react';
import { NEUTRAL_MARK, type Tech } from './capabilities';
import { MARKS } from './marks';

/**
 * A single technology mark, in its real brand colour.
 *
 * Deliberately unhoused: no tile, no plate, no filled square behind it. A brand
 * mark is recognised by its colour, so the marks stay coloured while everything
 * around them holds to monochrome plus the yellow accent.
 *
 * Drawn as inline SVG from `marks.ts` rather than fetched from a CDN — it
 * paints with the first frame, cannot regress to a broken image, and needs no
 * network at all, which matters because this build has none.
 *
 * Anything with no published mark falls back to a Lucide glyph tinted to the
 * right colour, so the row still reads in colour rather than going blank. Three
 * cases hit that path: brands Simple Icons has dropped or never carried (AWS,
 * VS Code), a product with no mark of its own (React Native, drawn as a device
 * in React's cyan), and the practices under Cybersecurity, which are
 * disciplines rather than products and take the chapter's own hue.
 */
export default function TechMark({
  tech,
  className = 'h-6 w-6',
}: {
  tech: Tech;
  className?: string;
}) {
  const mark = tech.slug ? MARKS[tech.slug] : undefined;

  if (!mark) {
    const Fallback = tech.icon ?? Boxes;
    return (
      <Fallback
        aria-hidden="true"
        strokeWidth={1.5}
        className={`${className} shrink-0`}
        style={{ color: tech.color ? `#${tech.color}` : NEUTRAL_MARK }}
      />
    );
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={`${className} shrink-0`}
      fill={tech.color ? `#${tech.color}` : mark.color}
    >
      {mark.d.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
