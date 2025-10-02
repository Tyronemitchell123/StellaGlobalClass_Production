import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veridian Private Concierge',
  description: 'Premium AI-powered concierge services for elite clients worldwide',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
