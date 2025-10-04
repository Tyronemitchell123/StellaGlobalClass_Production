'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
