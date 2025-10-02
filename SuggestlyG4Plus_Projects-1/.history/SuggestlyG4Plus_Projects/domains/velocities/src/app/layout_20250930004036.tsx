import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Velocities - Luxury Chauffeur Service',
  description: 'Premium chauffeur service with luxury vehicles and professional drivers',
  keywords: ['chauffeur', 'luxury', 'transportation', 'professional drivers', 'velocities'],
  authors: [{ name: 'SuggestlyG4Plus Team' }],
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased quantum-theme">
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
          />
        </Providers>
      </body>
    </html>
  );
}
