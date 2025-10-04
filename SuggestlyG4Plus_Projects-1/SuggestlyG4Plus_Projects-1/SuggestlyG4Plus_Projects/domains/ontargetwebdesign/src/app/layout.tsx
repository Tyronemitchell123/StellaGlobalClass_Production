import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OnTarget Web Design - AI-Powered Web Design & Development',
  description: 'Transform your digital presence with cutting-edge web design and development services. We create stunning, high-performance websites that captivate audiences and drive results.',
  keywords: 'web design, web development, AI-powered, Next.js, React, TypeScript, responsive design, UI/UX design',
  authors: [{ name: 'OnTarget Web Design' }],
  creator: 'OnTarget Web Design',
  publisher: 'OnTarget Web Design',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ontargetwebdesign.com'),
  openGraph: {
    title: 'OnTarget Web Design - AI-Powered Web Design & Development',
    description: 'Transform your digital presence with cutting-edge web design and development services.',
    url: 'https://ontargetwebdesign.com',
    siteName: 'OnTarget Web Design',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OnTarget Web Design - AI-Powered Web Design & Development',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnTarget Web Design - AI-Powered Web Design & Development',
    description: 'Transform your digital presence with cutting-edge web design and development services.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
