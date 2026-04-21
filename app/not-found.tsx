import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '404 — Page Not Found' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-primary text-sm mb-4 tracking-widest">404</p>
      <h1 className="text-5xl md:text-7xl font-bold mb-6">Page not found.</h1>
      <p className="text-muted-foreground mb-10 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
