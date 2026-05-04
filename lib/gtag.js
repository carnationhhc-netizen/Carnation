export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Called on every client-side route change
export function pageview(url) {
  if (!GA_ID || typeof window === 'undefined') return;
  window.gtag('config', GA_ID, { page_path: url });
}

// Fire a custom GA4 event
export function event(action, params = {}) {
  if (!GA_ID || typeof window === 'undefined') return;
  window.gtag('event', action, params);
}
