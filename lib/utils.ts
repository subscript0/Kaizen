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

/**
 * Fired by the primary "Hire me now" CTA, which opens WhatsApp.
 *
 * Renamed from `trackBookACall`/`book_a_call_click` when the CTA stopped being
 * a Calendly booking — leaving the old event name on a button that no longer
 * books anything would have quietly poisoned the funnel report. GA treats this
 * as a NEW event, so historical `book_a_call_click` data stays where it is
 * rather than being merged with clicks that mean something different.
 */
export function trackHireMeNow(location: string) {
  trackEvent('hire_me_now_click', { location });
}

export function trackProjectView(projectSlug: string) {
  trackEvent('project_view', { project_slug: projectSlug });
}

export function trackExternalLink(url: string, label: string) {
  trackEvent('external_link_click', { url, label });
}
