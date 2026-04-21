import type {
  Project,
  Experience,
  SkillCategory,
  Testimonial,
  SocialLink,
} from '@/types';

// ========== CONTENTLAYER / SANITY PLACEHOLDER ==========
// To move to a CMS, replace these arrays with fetch() calls.
// Example: const projects = await sanityClient.fetch(groq`*[_type == "project"]`)
// =========================================================

// ── Personal Info ─────────────────────────────────────
export const personalInfo = {
  name: 'Kaizen',
  tagline: 'FULLSTACK DEVEOPER',
  positioning:
    'I help SaaS and fintech companies ship high-performance, conversion-optimised interfaces.',
  email: 'chiemeried321@gmail.com',
  calendlyUrl: 'https://calendly.com/chiemeried321/30min', // Replace with your Calendly URL
  // ========== CONTENTLAYER / SANITY PLACEHOLDER ==========
  // To move to a CMS, replace these arrays with fetch() calls.
  // Example: const projects = await sanityClient.fetch(groq`*[_type == "project"]`)  upworkUrl: 'https://www.upwork.com/freelancers/~01f6ce82d55eb7345d?mp_source=share', // Replace with your Upwork profile
  stats: [
    { label: 'Years of Experience', value: '3+' },
    { label: 'Projects Shipped', value: '10+' },
    { label: 'Hours Invested', value: '5K+' },
  ],
};

// ── Social Links ──────────────────────────────────────
export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/subscript0' },
  { name: 'WhatsApp', url: 'https://api.whatsapp.com/send/?phone=2349117564724&text&type=phone_number&app_absent=0' },
  { name: 'Twitter', url: 'https://x.com/Indexter_1' },
];

// ── Projects ──────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 1,
    slug: 'ai-analytics-dashboard',
    title: 'AI Analytics Dashboard',
    number: '_01.',
    description:
      'A real-time analytics platform powered by AI insights, enabling teams to surface business intelligence at a glance.',
    longDescription:
      'Built for a Series-A data company, this dashboard aggregates multi-source data pipelines and surfaces predictive insights via an LLM layer. Features real-time websocket updates, custom chart primitives, and a role-based access system.',
    techStack: ['Next.js', 'TypeScript', 'Recharts', 'OpenAI API', 'Prisma', 'PostgreSQL'],
    role: 'Lead Frontend Engineer',
    liveUrl: '#',
    sourceUrl: '#',
    thumbnail: '/projects/images/ai-analytics-dashboard.jpg',
    images: [
      '/projects/images/ai-analytics-dashboard.jpg',
      '/projects/images/ai-analytics-dashboard-2.jpg',
    ],
    problem:
      "The client's data team was spending 4+ hours per day manually pulling reports from 6 different tools. Key metrics were scattered, delayed, and unreliable.",
    solution:
      "I designed and built a unified dashboard that ingests data from all sources via REST and webhooks, then applies an AI summarisation layer to surface the top 3 action items each morning.",
    result:
      'Reporting time reduced from 4 hours to under 15 minutes. The AI summary layer replaced a full analyst workflow, saving the team ~$8,000/month.',
    metrics: '40% faster reporting · 95% analyst time recovered · 4.9/5 user satisfaction',
    featured: true,
  },
  {
    id: 2,
    slug: 'fintech-payment-hub',
    title: 'Fintech Payment Hub',
    number: '_02.',
    description:
      'A multi-currency payment orchestration interface with real-time FX rates, compliance flags, and transaction analytics.',
    longDescription:
      'Built for a B2B fintech startup processing $2M+ monthly, this hub consolidates payment routing, compliance checks, and reconciliation into a single operator interface.',
    techStack: ['React', 'Redux', 'Tailwind CSS', 'Node.js', 'Stripe API', 'TypeScript'],
    role: 'Senior Frontend Engineer',
    liveUrl: '#',
    sourceUrl: '#',
    thumbnail: '/projects/images/fintech-payment-hub.jpg',
    images: [
      '/projects/images/fintech-payment-hub.jpg',
      '/projects/images/fintech-payment-hub-2.jpg',
    ],
    problem:
      'Operators were switching between 3 separate tools to process, reconcile, and flag payments — causing errors and a 2-day reconciliation backlog.',
    solution:
      'Consolidated all payment operations into a single interface with optimistic UI updates, real-time FX feeds, and automated compliance flag routing.',
    result:
      'Reconciliation backlog eliminated within 2 weeks of launch. Error rate dropped by 68%.',
    metrics: '68% fewer errors · 2-day backlog eliminated · $2M+/month processed',
    featured: true,
  },
  {
    id: 3,
    slug: 'saas-subscription-manager',
    title: 'SaaS Subscription Manager',
    number: '_03.',
    description:
      'A self-serve subscription and billing portal for a growing SaaS, handling plans, upgrades, invoices, and usage metering.',
    longDescription:
      'This customer-facing billing portal integrates deeply with Stripe Billing to expose plan management, prorated upgrades, invoice history, and usage-based billing in a clean, branded interface.',
    techStack: ['Next.js', 'Stripe API', 'Tailwind CSS', 'Prisma', 'tRPC', 'TypeScript'],
    role: 'Full-Stack Frontend Engineer',
    liveUrl: '#',
    sourceUrl: '#',
    thumbnail: '/projects/images/saas-subscription-manager.jpg',
    images: [
      '/projects/images/saas-subscription-manager.jpg',
      '/projects/images/saas-subscription-manager-2.jpg',
    ],
    problem:
      "The client's support team handled 200+ billing questions per month manually. There was no self-serve portal, so every plan change required a support ticket.",
    solution:
      'Built a fully self-serve billing portal with instant plan upgrades, downloadable invoices, and usage dashboards — all synced with Stripe Billing webhooks.',
    result:
      'Support tickets related to billing dropped by 80% in the first month. MRR expansion improved by 23% as upgrades became frictionless.',
    metrics: '80% fewer support tickets · 23% MRR uplift · 0 manual billing ops',
    featured: true,
  },
  {
    id: 4,
    slug: 'llm-prompt-studio',
    title: 'LLM Prompt Studio',
    number: '_04.',
    description:
      'A developer-facing prompt engineering tool with version control, A/B testing, latency tracking, and team collaboration.',
    longDescription:
      'Prompt Studio helps AI teams manage, test, and iterate on prompts across GPT-4, Claude, and Gemini. Features include prompt versioning, side-by-side comparison, cost estimation, and shareable prompt libraries.',
    techStack: ['Next.js', 'OpenAI API', 'LangChain', 'Vector Databases', 'Tailwind CSS', 'TypeScript'],
    role: 'Product Engineer (Frontend Lead)',
    liveUrl: '#',
    sourceUrl: '#',
    thumbnail: '/projects/images/llm-prompt-studio.jpg',
    images: [
      '/projects/images/llm-prompt-studio.jpg',
      '/projects/images/llm-prompt-studio-2.jpg',
    ],
    problem:
      "AI teams were managing prompts in Google Docs and Notion, with no version control, no performance data, and no collaboration tooling.",
    solution:
      'Built a Git-inspired prompt management system with branching, diffs, and a live test runner that benchmarks prompts across providers simultaneously.',
    result:
      'Adopted by 3 enterprise teams within 6 weeks of private beta. Reduced prompt iteration cycles from days to hours.',
    metrics: '3 enterprise teams in 6 weeks · 5× faster iteration · 40% avg cost reduction',
    featured: true,
  },
];

// ── Experience ────────────────────────────────────────
export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Fintech Startup',
    role: 'Frontend Engineer',
    duration: '2024 – Present',
    description:
      'Leading frontend development for a B2B payment platform. Architecting component systems, optimising render performance, and collaborating directly with product and design.',
    highlights: [
      'Built real-time transaction dashboard processing 50K+ events/day',
      'Reduced initial bundle size by 42% through code splitting and lazy loading',
      'Established frontend architecture patterns adopted across 3 product teams',
    ],
  },
  {
    id: 2,
    company: 'AI SaaS Platform',
    role: 'UI Engineer',
    duration: '2023 – 2024',
    description:
      'Shipped pixel-perfect interfaces for an AI productivity suite used by 10,000+ users. Focused on performance, accessibility, and developer experience.',
    highlights: [
      'Delivered AI chat interface from zero to launch in 8 weeks',
      'Achieved Lighthouse scores of 95+ across all core pages',
      'Built design system of 60+ components with full Storybook documentation',
    ],
  },
];

// ── Skills ────────────────────────────────────────────
export const skills: SkillCategory[] = [
  {
    category: 'frontend',
    items: [
      { name: 'JavaScript', logo: '/logo/js.png' },
      { name: 'TypeScript', logo: '/logo/ts.png' },
      { name: 'React', logo: '/logo/react.png' },
      { name: 'Next.js', logo: '/logo/next.png' },
      { name: 'Redux', logo: '/logo/redux.png' },
      { name: 'Tailwind CSS', logo: '/logo/tailwind.png' },
      { name: 'GSAP', logo: '/logo/gsap.png' },
      { name: 'Framer Motion', logo: '/logo/framer-motion.png' },
    ],
  },
  {
    category: 'backend',
    items: [
      { name: 'Node.js', logo: '/logo/node.png' },
      { name: 'Express.js', logo: '/logo/express.png' },
      { name: 'tRPC', logo: '/logo/trpc.png' },
    ],
  },
  {
    category: 'database',
    items: [
      { name: 'PostgreSQL', logo: '/logo/postgreSQL.png' },
      { name: 'MongoDB', logo: '/logo/mongodb.svg' },
      { name: 'Prisma', logo: '/logo/prisma.png' },
    ],
  },
  {
    category: 'AI/ML',
    items: [
      { name: 'LangChain', logo: '/logo/langchain.png' },
      { name: 'OpenAI API', logo: '/logo/openai.png' },
      { name: 'Vector DBs', logo: '/logo/vectordb.png' },
    ],
  },
  {
    category: 'tools',
    items: [
      { name: 'Git', logo: '/logo/git.png' },
      { name: 'Docker', logo: '/logo/docker.svg' },
      { name: 'AWS', logo: '/logo/aws.png' },
    ],
  },
];

// ── Testimonials ──────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'PayFlow (Fintech)',
    avatar: '/testimonials/sarah.jpg',
    content:
      'Kaizen delivered our fintech dashboard ahead of schedule and above spec. The real-time data layer and the attention to performance were exactly what we needed — our ops team went from dreading Monday reports to checking the dashboard first thing every morning. Genuinely impressive work.',
  },
  {
    id: 2,
    name: 'Marcus Reid',
    role: 'Founder',
    company: 'Promptly AI',
    avatar: '/testimonials/marcus.jpg',
    content:
      "We brought Kaizen in to build our prompt engineering tool from scratch. What stood out was not just the code quality but the product thinking. He asked the right questions, pushed back on scope that didn't serve the user, and shipped a product our enterprise customers call 'the best UI they've used for AI tooling.' Would hire again without hesitation.",
  },
];
