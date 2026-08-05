import Projects from '@/components/Projects';

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6 lg:px-12 max-w-[980px] mx-auto" data-reveal>
      <div className="space-y-12">
        <p className="section-number mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary" data-reveal>
          03 — Projects
        </p>
        <h2 className="section-title mb-8 text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-foreground" data-reveal>
          Recent Work
        </h2>
        <Projects />
      </div>
    </section>
  );
}