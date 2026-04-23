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
  tagline: 'FULL-STACK DEVELOPER',
  positioning:
    'I help SaaS and fintech companies ship high-performance, conversion-optimised interfaces.',
  email: 'chiemeried321@gmail.com',
  calendlyUrl: 'https://calendly.com/chiemeried321/30min', // Replace with your Calendly URL
  upworkUrl: 'https://www.upwork.com/freelancers/~01f6ce82d55eb7345d?mp_source=share', // Replace with your Upwork profile
  whatsappGroupUrl: 'https://chat.whatsapp.com/YOUR_GROUP_LINK', // ← replace with real link
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
    company: 'Personal Projects / Freelance',
    role: 'Frontend Engineer',
    duration: '2024 – Present',
    description:
      'Building and refining frontend systems for web applications with a focus on performance, scalability, and clean architecture. Working independently on real-world projects, translating ideas into production-ready interfaces.',
    highlights: [
      'Developed responsive dashboards with dynamic data rendering and optimized state management',
      'Improved load performance using code splitting, lazy loading, and asset optimization techniques',
      'Designed reusable component structures to maintain consistency across multiple projects',
    ],
  },
  {
    id: 2,
    company: 'Self-Directed Learning / Projects',
    role: 'UI Engineer',
    duration: '2023 – 2024',
    description:
      'Focused on mastering modern frontend development by building and iterating on multiple UI-heavy applications. Emphasis on design precision, usability, and developer workflow.',
    highlights: [
      'Built and deployed interactive web interfaces, including chat-style UIs and productivity tools',
      'Achieved high performance and accessibility standards through testing and optimization',
      'Created reusable UI components and documented them for scalability and reuse',
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
