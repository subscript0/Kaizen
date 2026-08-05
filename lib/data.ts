import type {
  Project,
  Experience,
  SkillCategory,
  Testimonial,
  SocialLink,
} from '@/types';
import { capabilities } from '@/components/skills/capabilities';

// ========== CONTENTLAYER / SANITY PLACEHOLDER ==========
// To move to a CMS, replace these arrays with fetch() calls.
// Example: const projects = await sanityClient.fetch(groq`*[_type == "project"]`)
// =========================================================

// ── Personal Info ─────────────────────────────────────
export const personalInfo = {
  name: 'Kaizen',
  tagline: 'FULL-STACK DEVELOPER',
  positioning:
    'I help SaaS and fintech companies ship high-performance, conversion-optimised interfaces.',
  email: 'chiemeried321@gmail.com',
  /** The single WhatsApp line every "Hire me now" CTA opens. */
  whatsappNumber: '2349117564724',
  /**
   * Primary CTA target. Built with the same `api.whatsapp.com/send` shape the
   * idea form already uses, so it hands off to the installed app on mobile and
   * to WhatsApp Web on desktop rather than dead-ending on a `wa.me` redirect.
   * The message is pre-filled so the first line of the chat already says why.
   */
  hireWhatsappUrl:
    'https://api.whatsapp.com/send/?phone=2349117564724&text=' +
    encodeURIComponent("Hi Kaizen — I'd like to hire you. Are you free to talk?") +
    '&type=phone_number&app_absent=0',
  upworkUrl: 'https://www.upwork.com/freelancers/~01f6ce82d55eb7345d?mp_source=share', // Replace with your Upwork profile
  whatsappGroupUrl: 'https://chat.whatsapp.com/DxS7V5kzZhC0WRyjwQXCCG', // ← replace with real link
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

// ── Projects — real builds ────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    id: 1,
    slug: 'spendwise',
    title: 'SpendWise',
    number: '_01.',
    description:
      'A personal finance tracker that helps you monitor income, expenses, and savings goals — built for everyday use.',
    longDescription:
      'SpendWise is a full-stack budgeting app I built to solve my own problem of losing track of daily spending. It lets users log transactions by category, set monthly budgets, and visualise spending patterns over time. Firebase handles auth and real-time sync, so data updates instantly across devices.',
    techStack: ['Next.js', 'TypeScript', 'Firebase', 'Recharts', 'Tailwind CSS'],
    role: 'Solo Full Stack Developer',
    liveUrl: '#',
    sourceUrl: 'https://github.com/subscript0',
    thumbnail: '/projects/images/spendwise.jpg',
    images: ['/projects/images/spendwise.jpg', '/projects/images/spendwise-2.jpg'],
    problem:
      'I kept overspending without realising it until end of month. Spreadsheets were too slow and existing apps felt bloated or needed a subscription.',
    solution:
      'Built a lightweight web app with a fast transaction input flow, auto-categorisation, and a monthly overview dashboard. Firebase Realtime Database keeps it synced instantly.',
    result:
      'Used it myself daily for 6+ months. Helped me cut unnecessary spending by tracking where money was actually going. Shared with friends who started using it too.',
    metrics: 'Personal use · 6+ months · Shared with 10+ users',
    featured: true,
  },
  {
    id: 2,
    slug: 'devboard',
    title: 'DevBoard',
    number: '_02.',
    description:
      'A developer-focused Kanban board for managing freelance projects, tasks, and client work — without the bloat.',
    longDescription:
      'DevBoard is a project management tool I built specifically for developers doing freelance or solo work. It supports drag-and-drop task cards across columns, per-project notes, and deadline tracking. Built with Next.js and MongoDB, with a clean interface that gets out of the way.',
    techStack: ['Next.js', 'TypeScript', 'MongoDB', 'Node.js', 'Tailwind CSS'],
    role: 'Solo Full Stack Developer',
    liveUrl: '#',
    sourceUrl: 'https://github.com/subscript0',
    thumbnail: '/projects/images/devboard.jpg',
    images: ['/projects/images/devboard.jpg', '/projects/images/devboard-2.jpg'],
    problem:
      'Trello and Jira are overkill for solo freelance work. I needed something simple — just boards, tasks, and notes — without paying for a subscription or drowning in features.',
    solution:
      'Built a minimal Kanban board with drag-and-drop, project grouping, status columns (Backlog, In Progress, Review, Done), and a quick-add task flow.',
    result:
      'Now my primary tool for managing all freelance work. Reduced context-switching between tools and improved how I scope and deliver client projects.',
    metrics: 'Daily personal use · Freelance projects managed · 0 missed deadlines',
    featured: true,
  },
  {
    id: 3,
    slug: 'quickinvoice',
    title: 'QuickInvoice',
    number: '_03.',
    description:
      'An invoice generator for freelancers — create professional invoices in under a minute and send them straight to clients.',
    longDescription:
      'QuickInvoice lets freelancers create, customise, and export PDF invoices without a complex accounting setup. You fill in client details, add line items, and the app calculates totals, VAT, and due dates. Built with Next.js, jsPDF for export, and Node.js for email delivery.',
    techStack: ['Next.js', 'Node.js', 'TypeScript', 'jsPDF', 'Tailwind CSS', 'Nodemailer'],
    role: 'Solo Full Stack Developer',
    liveUrl: '#',
    sourceUrl: 'https://github.com/subscript0',
    thumbnail: '/projects/images/quickinvoice.jpg',
    images: ['/projects/images/quickinvoice.jpg', '/projects/images/quickinvoice-2.jpg'],
    problem:
      'As a freelancer I was manually typing up invoices in Google Docs and converting to PDF. It was slow, inconsistent, and looked unprofessional.',
    solution:
      'Built a form-based invoice creator with real-time preview, automatic total/tax calculation, PDF export, and optional email-to-client. Branding stays consistent every time.',
    result:
      'Cut invoice creation time from 15 minutes to under 2. Started sending more consistent, professional invoices which improved payment turnaround.',
    metrics: 'Invoice time: 15min → 2min · Used for all freelance billing',
    featured: true,
  },
  {
    id: 4,
    slug: 'studytrack',
    title: 'StudyTrack',
    number: '_04.',
    description:
      'A learning tracker for developers studying courses, certifications, or programmes — built to stay consistent.',
    longDescription:
      'StudyTrack is a React Native app I built while doing the Go Sabi cybersecurity programme to keep myself accountable. It lets you set study goals, log daily sessions, track module completion per course, and see weekly streaks. Firebase keeps data synced across phone and web.',
    techStack: ['React Native', 'Firebase', 'TypeScript', 'Expo'],
    role: 'Solo Full Stack Developer',
    liveUrl: '#',
    sourceUrl: 'https://github.com/subscript0',
    thumbnail: '/projects/images/studytrack.jpg',
    images: ['/projects/images/studytrack.jpg', '/projects/images/studytrack-2.jpg'],
    problem:
      'I kept starting courses and dropping off after a few weeks. There was no friction-free way to log progress or visualise how consistent I was being.',
    solution:
      'Built a mobile-first learning log with course modules, daily session timer, streak counter, and a simple progress bar per course. Notifications remind you to study if you miss a day.',
    result:
      'Used it to track my Go Sabi cybersecurity programme. Hit 5/10 modules and still going. The streak mechanic keeps me showing up consistently.',
    metrics: 'Active personal use · Go Sabi programme tracked · Streak maintained',
    featured: true,
  },
];

// ── Experience ────────────────────────────────────────
export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Personal Projects / Independent Development',
    role: 'Full-Stack Developer',
    duration: '2023 – Present',
    description:
      'Designing and developing end-to-end web applications from concept to deployment. Working across frontend, backend, databases, and cloud infrastructure to build scalable, maintainable, and user-focused products.',
    highlights: [
      'Built responsive web applications using React, Next.js, TypeScript, JavaScript, HTML, CSS, and Tailwind CSS',
      'Developed scalable backend services and REST APIs with Node.js, Express, PHP, and Python',
      'Designed and managed SQL and NoSQL databases using PostgreSQL, Neon, MongoDB, Supabase, and Firebase',
      'Integrated authentication, real-time features, database management, and third-party APIs',
      'Optimized applications through code splitting, lazy loading, caching, and performance optimization',
      'Deployed and managed applications using Docker, Git, GitHub, Linux, and AWS',
    ],
  },
  {
    id: 2,
    company: 'Product Design & Development',
    role: 'Product Engineer',
    duration: '2026 – Present',
    description:
      'Designing and building complete digital products from concept to deployment. Combining product strategy, modern UI design, and engineering to create intuitive, scalable, and high-performance digital experiences.',
    highlights: [
      'Designed complete product experiences using Figma',
      'Created user flows, wireframes, interactive prototypes, and scalable design systems',
      'Built reusable design systems and component libraries',
      'Designed responsive interfaces for web and mobile applications',
      'Focused on usability, accessibility, consistency, and polished user experiences',
      'Collaborated between design thinking and implementation to create production-ready products',
    ],
  },
  {
    id: 3,
    company: 'Infrastructure & Deployment',
    role: 'Cloud, DevOps & Infrastructure',
    duration: '2025 – Present',
    description:
      'Building practical experience with cloud infrastructure, Linux systems, containerization, deployment workflows, and modern development environments.',
    highlights: [
      'Deploying applications and services on AWS',
      'Using Docker for containerized development and deployment',
      'Managing projects with Git and GitHub',
      'Working daily in Linux environments',
      'Configuring development environments and deployment workflows',
      'Learning modern infrastructure and cloud engineering practices',
    ],
  },
  {
    id: 4,
    company: 'Security Research & Hands-on Learning',
    role: 'Cybersecurity',
    duration: '2025 – Present',
    description:
      'Expanding my understanding of cybersecurity through practical labs, Linux administration, networking, and secure software development.',
    highlights: [
      'Working extensively in Linux environments',
      'Learning networking fundamentals and web security',
      'Exploring OSINT and security research techniques',
      'Practicing secure development principles',
      'Studying system administration and infrastructure security',
      'Continuously improving security knowledge through hands-on experimentation',
    ],
  },
  {
    id: 5,
    company: 'Continuous Learning & Engineering',
    role: 'Open Source & Personal Projects',
    duration: '2024 – Present',
    description:
      'Building projects to explore new technologies, strengthen engineering skills, and solve real-world problems through modern software development.',
    highlights: [
      'Built full-stack applications, dashboards, developer tools, and productivity platforms',
      'Explored cross-platform development with React Native',
      'Worked across frontend, backend, databases, cloud, and product design',
      'Experimented with scalable architectures, reusable components, and modern development workflows',
      'Continuously refined coding standards, software architecture, and engineering best practices',
    ],
  },
];


// ── Skills ────────────────────────────────────────────
/**
 * DERIVED, not authored. The disciplines and their tools live in
 * `components/skills/capabilities.ts`, which /skills already reads for its
 * chapters, notes and brand marks.
 *
 * They used to be two hand-maintained lists, and they drifted: this array was
 * still advertising Redux, tRPC, Prisma and an AI/ML section on the home page
 * after /skills had been rewritten around the real stack. Deriving costs one
 * import and makes that class of bug impossible — add a tool in one place and
 * both surfaces show it.
 */
export const skills: SkillCategory[] = capabilities.map((capability) => ({
  category: capability.id,
  items: capability.techs.map((tech) => ({ name: tech.name })),
}));

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
