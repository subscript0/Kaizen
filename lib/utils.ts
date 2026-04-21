import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Analytics helpers ─────────────────────────────────
// To enable tracking, set NEXT_PUBLIC_GA_ID in .env.local
// and call these functions on user interactions.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export function trackBookACall(location: string) {
  trackEvent('book_a_call_click', { location });
}

export function trackProjectView(projectSlug: string) {
  trackEvent('project_view', { project_slug: projectSlug });
}

export function trackExternalLink(url: string, label: string) {
  trackEvent('external_link_click', { url, label });
}
