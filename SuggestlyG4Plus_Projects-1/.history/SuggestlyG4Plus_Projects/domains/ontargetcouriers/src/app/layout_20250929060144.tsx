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
