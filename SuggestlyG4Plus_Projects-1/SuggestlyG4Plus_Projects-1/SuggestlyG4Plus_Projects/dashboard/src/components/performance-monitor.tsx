'use client';

import { ReactNode, useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  memoryUsage: number;
  loadTime: number;
}

export function PerformanceMonitor({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Check if performance API is available
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        const newMetrics: Partial<PerformanceMetrics> = {};

        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              newMetrics.fcp = entry.startTime;
            }
          } else if (entry.entryType === 'largest-contentful-paint') {
            newMetrics.lcp = entry.startTime;
          } else if (entry.entryType === 'layout-shift') {
            newMetrics.cls = (newMetrics.cls || 0) + (entry as any).value;
          } else if (entry.entryType === 'first-input') {
            newMetrics.fid = (entry as any).processingStart - entry.startTime;
          } else if (entry.entryType === 'navigation') {
            newMetrics.ttfb = (entry as any).responseStart - (entry as any).requestStart;
            newMetrics.loadTime = entry.duration;
          }
        });

        if (Object.keys(newMetrics).length > 0) {
          setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
        }
      });

      // Observe performance entries
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input', 'navigation'] });

      // Get memory usage if available
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize
        } as PerformanceMetrics));
      }

      // Fallback for basic load time
      const loadTime = performance.now();
      setMetrics(prev => ({
        ...prev,
        loadTime
      } as PerformanceMetrics));

      return () => observer.disconnect();
    }
  }, []);

  // Log performance metrics for monitoring
  useEffect(() => {
    if (metrics) {
      console.log('Performance Metrics:', metrics);

      // Send to analytics service in production
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'performance_metric', {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          cls: metrics.cls,
          fid: metrics.fid,
        });
      }
    }
  }, [metrics]);

  return <>{children}</>;
}
