// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// FestiWise-specific tracking
export const trackQuizStart = () => {
  event({
    action: 'quiz_started',
    category: 'engagement'
  });
};

export const trackQuizComplete = (recommendationCount: number) => {
  event({
    action: 'quiz_completed',
    category: 'conversion',
    value: recommendationCount
  });
};

export const trackFestivalClick = (festivalName: string) => {
  event({
    action: 'festival_clicked',
    category: 'engagement',
    label: festivalName
  });
};

export const trackConversionBanner = () => {
  event({
    action: 'conversion_banner_clicked',
    category: 'conversion',
    label: 'urgency_banner'
  });
};

export const trackExitIntent = () => {
  event({
    action: 'exit_intent_popup',
    category: 'retention',
    label: 'popup_triggered'
  });
};

// Window interface is already declared in global.d.ts
