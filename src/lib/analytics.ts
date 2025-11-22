interface AnalyticsParams {
  [key: string]: any;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: AnalyticsParams): void => {
  const consent = localStorage.getItem('cookie_consent');
  if (consent !== 'accepted') {
    console.log(`Analytics blocked by user consent: ${eventName}`, params);
    return;
  }
  
  // Placeholder for analytics integration (e.g., GA4, Meta Pixel)
  console.log(`[Analytics Event] Name: ${eventName}`, params);
  
  if (typeof window.gtag === 'function') {
    // window.gtag('event', eventName, params);
  }
  
  if (typeof window.fbq === 'function') {
    // window.fbq('track', eventName, params);
  }
};
