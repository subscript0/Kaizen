import Link from 'next/link';

export default function BlogsSection() {
  // Sample blog posts data - in a real app, this would come from a CMS or API
  const posts = [
    {
      id: 1,
      title: "Building Performant Web Applications",
      slug: "/blog/building-performant-web-applications",
      date: "Mar 15, 2025",
      excerpt: "Learn how to optimize your web applications for peak performance with modern techniques and tools.",
    },
    {
      id: 2,
      title: "The Future of State Management in React",
      slug: "/blog/future-state-management-react",
      date: "Feb 28, 2025",
      excerpt: "Exploring emerging patterns and libraries for managing application state in React ecosystems.",
    },
    {
      id: 3,
      title: "Design Systems: Building Consistent User Interfaces",
      slug: "/blog/design-systems-consistent-user-interfaces",
      date: "Feb 10, 2025",
      excerpt: "A comprehensive guide to creating and maintaining design systems that scale with your product.",
    },
  ];

  return (
    <section id="blog" className="py-24 px-6 lg:px-12 max-w-[980px] mx-auto" data-reveal>
      <p className="section-number mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary" data-reveal>
        09 — Blog
      </p>
      <h2 className="section-title mb-8 text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-none text-foreground" data-reveal>
        Latest Articles
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.slug}
            className="group block overflow-hidden rounded border border-border/30 bg-background-light/30 backdrop-blur-sm
                       transition-all duration-300 ease-[var(--ease-spring-2)] hover:border-primary/50
"
            data-reveal
          >
            <h3 className="mb-3 text-lg font-semibold text-foreground/80 hover:text-foreground transition-colors duration-300 ease-[var(--ease-spring-2)]">
              {post.title}
            </h3>
            <p className="text-xs text-muted-foreground/70 mb-2">
              {post.date}
            </p>
            <p className="flex-1 text-sm text-muted-foreground/70 line-clamp-3">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}