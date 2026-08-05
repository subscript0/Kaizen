import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { skills } from '@/lib/data';
import { TOTAL_TECHS } from '@/components/skills/capabilities';

/**
 * The stack, as an index — not a badge cloud.
 *
 * Skill logos are referenced in `lib/data.ts` but `public/logo/` does not
 * exist in the repo, so every logo would render as a broken image. Names set
 * in the grotesque are also simply more legible at this size, and a ruled
 * two-column index (discipline → tools) is the Swiss answer to a tag soup:
 * it reads top-to-bottom as a table of contents for what this person can do.
 */
const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Data',
  tools: 'Tooling',
  cloud: 'Cloud',
  design: 'Design',
  security: 'Security',
};

export default function CapabilityPanel() {
  return (
    <div className="rule-t rule-b rule-l rule-r bg-[hsl(var(--background)/0.55)] backdrop-blur-[2px]">
      {/* Panel head — a spec-sheet caption, ruled off from its contents. */}
      <div className="rule-b flex items-baseline justify-between gap-4 px-4 py-3">
        <span className="micro micro--strong">Capabilities</span>
        {/* Distinct tools, not the sum of the rows — Linux is listed under both
            Tooling and Security, and this figure has to match the one /skills
            puts on its ledger. */}
        <span className="micro">{TOTAL_TECHS} tools</span>
      </div>

      <dl>
        {skills.map((category, i) => (
          <div
            key={category.category}
            className={`px-4 py-3.5 ${i > 0 ? 'rule-t' : ''}`}
          >
            <dt className="micro flex items-baseline gap-3">
              <span className="micro--strong">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{CATEGORY_LABELS[category.category] ?? category.category}</span>
            </dt>
            <dd className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 font-sans text-[0.9375rem] font-medium leading-snug tracking-tight text-[hsl(var(--foreground))]">
              {category.items.map((item, j) => (
                <span key={item.name}>
                  {item.name}
                  {j < category.items.length - 1 && (
                    <span aria-hidden="true" className="ml-2.5 text-[hsl(var(--foreground)/0.28)]">
                      /
                    </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <Link
        href="/skills"
        className="micro rule-t group flex items-center justify-between px-4 py-3 transition-colors duration-200 hover:!text-[hsl(var(--primary))]"
      >
        Full skill index
        <ArrowRight
          className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
          strokeWidth={2.5}
        />
      </Link>
    </div>
  );
}
