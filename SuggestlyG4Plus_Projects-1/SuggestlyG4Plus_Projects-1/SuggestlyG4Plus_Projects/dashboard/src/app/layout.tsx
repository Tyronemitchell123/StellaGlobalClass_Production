import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/theme-provider';
import { Toaster } from '../components/ui/toaster';
import { QueryProvider } from '../components/query-provider';
import { Analytics } from '../components/analytics';
import { ErrorBoundary } from '../components/error-boundary';
import { PerformanceMonitor } from '../components/performance-monitor';
import { MonetizationProvider } from '../components/monetization-provider';
import { AIAssistant } from '../components/ai-assistant';
import { GlobalNotificationSystem } from '../components/global-notification-system';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Quantum Vision AI - Ultra Premium Camera Bot Dashboard',
  description: 'Advanced AI-powered camera monitoring and analytics platform with real-time insights and predictive analytics',
  keywords: ['AI', 'Computer Vision', 'Analytics', 'Real-time', 'Camera Monitoring', 'Machine Learning', 'Enterprise', 'SaaS'],
  authors: [{ name: 'Quantum Vision AI Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quantumvision.ai',
    siteName: 'Quantum Vision AI',
    title: 'Quantum Vision AI - Enterprise-Grade AI Camera Analytics',
    description: 'Advanced AI-powered camera monitoring and analytics platform with predictive intelligence',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quantum Vision AI Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum Vision AI - Enterprise AI Analytics',
    description: 'Advanced AI-powered camera monitoring and analytics platform',
    images: ['/og-image.png'],
  },
  other: {
    'twitter:creator': '@quantumvisionai',
    'twitter:site': '@quantumvisionai',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans antialiased`}>
      <head>
        {/* Advanced performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.quantumvision.ai" />
        <link rel="dns-prefetch" href="https://ws.quantumvision.ai" />
        <link rel="dns-prefetch" href="https://cdn.quantumvision.ai" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="modulepreload" href="/src/app/dashboard/page.tsx" as="script" />
        
        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://cdn.quantumvision.ai;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' data: https: blob: *;
          font-src 'self' data: https://fonts.gstatic.com;
          connect-src 'self' wss: https://api.quantumvision.ai https://ws.quantumvision.ai https://mcp.quantumvision.ai;
          media-src 'self' blob: *;
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
        " />
        
        {/* PWA and advanced features */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Quantum Vision AI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Quantum Vision AI" />
        <meta name="theme-color" content="#8B5CF6" />
        
        {/* Advanced SEO and discovery */}
        <link rel="canonical" href="https://quantumvision.ai" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Monetization and payment support */}
        <meta name="monetization" content="$ilp.uphold.com/quantumvisionai" />
        <link rel="payment" href="https://stripe.com/payments/quantumvisionai" type="text/html" />
        
        {/* Web monetization */}
        <meta name="web-monetization" content="$ilp.uphold.com/quantumvisionai" />
      </head>
      
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <PerformanceMonitor>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange={false}
              storageKey="quantum-vision-theme"
            >
              <QueryProvider>
                <MonetizationProvider>
                  <GlobalNotificationSystem />
                  <AIAssistant />
                  {children}
                  <Toaster />
                  <Analytics />
                </MonetizationProvider>
              </QueryProvider>
            </ThemeProvider>
          </PerformanceMonitor>
        </ErrorBoundary>
        
        {/* Service Worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
