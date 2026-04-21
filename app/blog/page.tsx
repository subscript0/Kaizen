import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on frontend engineering, performance, and building for SaaS and fintech.',
};

export default function BlogPage() {
  return (
    <>
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen flex flex-col items-start justify-center">
        <p className="section-number mb-4">Writing</p>
        <h1 className="section-title mb-6">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-md mb-10">
          Articles on frontend architecture, performance patterns, and building
          great products. Coming soon.
        </p>
        <Link href="/" className="btn-outline">
          ← Back Home
        </Link>
      </div>
      <Footer />
    </>
  );
}
