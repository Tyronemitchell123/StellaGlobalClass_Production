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
  title: 'Velocities - Luxury Chauffeur Service',
  description: 'Premium chauffeur service with luxury vehicles and professional drivers',
  keywords: ['chauffeur', 'luxury', 'transportation', 'professional drivers', 'velocities'],
