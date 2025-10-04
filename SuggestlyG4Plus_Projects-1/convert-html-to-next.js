const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');

const veridianDir = path.join(__dirname, '..', 'veridian');
const appDir = path.join(__dirname, '..', 'src', 'app');

function convertHtmlToNext() {
    console.log('Starting conversion from HTML to Next.js pages...');

    // Ensure target directory exists
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    // 1. Read the source index.html
    const htmlPath = path.join(veridianDir, 'index.html');
    if (!fs.existsSync(htmlPath)) {
        console.error('Error: index.html not found in veridian directory.');
        return;
    }
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const root = parse(htmlContent);

    // 2. Extract <head> and <body> content
    const headContent = root.querySelector('head').innerHTML;
    const bodyContent = root.querySelector('body').innerHTML;

    // 3. Create src/app/layout.tsx
    const layoutContent = `
import type { Metadata } from 'next';
import './globals.css'; // Assuming you will create this

export const metadata: Metadata = {
  title: 'Veridian Private Concierge',
  description: "Experience unparalleled luxury with Veridian's AI-powered private concierge service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        ${headContent.replace(/<title>.*<\/title>/, '')}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
    `;
    fs.writeFileSync(path.join(appDir, 'layout.tsx'), layoutContent.trim());
    console.log('Successfully created src/app/layout.tsx');

    // 4. Create src/app/page.tsx
    const pageContent = `
'use client'; // Add this for client-side interactivity

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { ProfileModal } from '@/components/ProfileModal';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const navActions = document.querySelector('.nav-actions');
      if (navActions) {
        navActions.innerHTML = \`
          <button class="btn-primary" id="myAccountBtn">
            <i class="fas fa-user-circle"></i> My Account
          </button>
        \`;
        document.getElementById('myAccountBtn')?.addEventListener('click', () => setProfileModalOpen(true));
      }
    }
  }, [isAuthenticated]);

  return (
    <>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <div dangerouslySetInnerHTML={{ __html: \`${bodyContent.replace(/`/g, '\\`')}\` }} />
    </>
  );
}
    `;
    fs.writeFileSync(path.join(appDir, 'page.tsx'), pageContent.trim());
    console.log('Successfully created src/app/page.tsx');

    console.log('Conversion complete! Your project is now using Next.js for rendering.');
}

convertHtmlToNext();
