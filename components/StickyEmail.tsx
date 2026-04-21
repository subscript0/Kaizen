'use client';

import { personalInfo } from '@/lib/data';

export default function StickyEmail() {
  return (
    <div className="sticky-email hidden lg:flex" aria-label="Contact email">
      <a
        href={`mailto:${personalInfo.email}`}
        className="hover:text-primary transition-colors"
      >
        {personalInfo.email}
      </a>
    </div>
  );
}
