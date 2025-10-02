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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
