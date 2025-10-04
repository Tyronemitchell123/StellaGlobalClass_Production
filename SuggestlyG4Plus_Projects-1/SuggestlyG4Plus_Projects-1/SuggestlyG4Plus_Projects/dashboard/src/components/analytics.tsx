'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams]);

  // Track user interactions
  useEffect(() => {
    const trackEvent = (eventName: string, parameters: any = {}) => {
      if (window.gtag) {
        window.gtag('event', eventName, {
          ...parameters,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Track camera interactions
    const handleCameraStart = () => trackEvent('camera_start', { action: 'start_recording' });
    const handleCameraStop = () => trackEvent('camera_stop', { action: 'stop_recording' });
    const handleAIDetection = () => trackEvent('ai_detection', { category: 'detection' });

    // Add event listeners (would be triggered by actual components)
    document.addEventListener('camera-start', handleCameraStart);
    document.addEventListener('camera-stop', handleCameraStop);
    document.addEventListener('ai-detection', handleAIDetection);

    return () => {
      document.removeEventListener('camera-start', handleCameraStart);
      document.removeEventListener('camera-stop', handleCameraStop);
      document.removeEventListener('ai-detection', handleAIDetection);
    };
  }, []);

  return null; // This component doesn't render anything
}
