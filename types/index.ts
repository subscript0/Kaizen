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
  logo: string;
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
