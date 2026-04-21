import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/lib/data';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.description,
    keywords: project.techStack,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      images: [{ url: project.thumbnail, alt: project.title }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <article className="pt-28 pb-0 px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Back */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          ← Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-16">
          <p className="section-number mb-4">{project.number} Case Study</p>
          <h1 className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight leading-none mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {project.longDescription}
          </p>
        </header>

        {/* Meta row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 pb-16 border-b border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Role</p>
            <p className="font-semibold text-sm">{project.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Stack</p>
            <p className="font-semibold text-sm">{project.techStack.slice(0, 3).join(', ')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Live Demo</p>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
               className="font-semibold text-primary hover:underline underline-offset-4 text-sm">
              View Live →
            </a>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Source</p>
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
               className="font-semibold text-primary hover:underline underline-offset-4 text-sm">
              GitHub →
            </a>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border mb-20">
          <Image
            src={project.thumbnail}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          />
        </div>

        {/* Tech stack */}
        <div className="mb-20">
          <h2 className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Full Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech}
                className="px-3 py-1.5 text-sm border border-border rounded-full text-muted-foreground bg-background-light">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Case Study cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-xl border border-border bg-background-light">
            <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center mb-4">
              <span className="text-error text-xs font-bold">!</span>
            </div>
            <h2 className="font-bold text-foreground mb-3">The Problem</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
          </div>
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-primary text-xs font-bold">→</span>
            </div>
            <h2 className="font-bold text-foreground mb-3">The Solution</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
          </div>
          <div className="p-6 rounded-xl border border-success/30 bg-success/5">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center mb-4">
              <span className="text-success text-xs font-bold">✓</span>
            </div>
            <h2 className="font-bold text-foreground mb-3">The Result</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.result}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-20 text-center">
          <p className="text-xs text-primary uppercase tracking-widest mb-2">Impact Metrics</p>
          <p className="text-lg md:text-xl font-semibold text-foreground">{project.metrics}</p>
        </div>

        {/* Extra screenshots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {project.images.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-border">
              <Image
                src={img}
                alt={`${project.title} screenshot ${i + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          ))}
        </div>

        {/* Next project */}
        <div className="border-t border-border/50 pt-12 pb-20">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Next Project</p>
          <Link href={`/projects/${nextProject.slug}`}
            className="group flex items-center justify-between gap-4 hover:text-primary transition-colors">
            <h3 className="text-2xl md:text-4xl font-bold group-hover:text-primary transition-colors">
              {nextProject.title}
            </h3>
            <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
