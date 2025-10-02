import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'OnTarget Couriers - AI-Powered Delivery Service',
  description: 'Fast, reliable courier service with real-time tracking and AI-powered route optimization',
  keywords: ['courier', 'delivery', 'logistics', 'tracking', 'AI-powered'],
  authors: [{ name: 'SuggestlyG4Plus Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased quantum-theme">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--quantum-dark)',
                color: 'var(--quantum-light)',
                border: '1px solid var(--quantum-primary)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--quantum-primary)',
                  secondary: 'var(--quantum-light)',
                },
                style: {
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '1px solid var(--quantum-primary)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--quantum-secondary)',
                  secondary: 'var(--quantum-light)',
                },
                style: {
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid var(--quantum-secondary)',
                },
              },
            }}
