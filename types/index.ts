export interface Project {
  id: number;
  slug: string;
  title: string;
  number: string;
  description: string;
  longDescription: string;
  techStack: string[];
  role: string;
  liveUrl: string;
  sourceUrl: string;
  thumbnail: string;
  images: string[];
  problem: string;
  solution: string;
  result: string;
  metrics: string;
  featured: boolean;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  description: string;
  highlights: string[];
}

export interface Skill {
  name: string;
  /**
   * Optional, and currently unset everywhere. The old entries all pointed into
   * `public/logo/`, which does not exist in the repo, so anything that rendered
   * one would have shown a broken image. Brand artwork now comes from the
   * inlined marks in `components/skills/marks.ts` instead.
   */
  logo?: string;
}

export interface SkillCategory {
  category: string;
  items: Skill[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
}

export interface SocialLink {
  name: string;
  url: string;
}
