'use client';

import { ReactNode } from 'react';

import { CodeLanguageProvider } from './code-language-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <CodeLanguageProvider>{children}</CodeLanguageProvider>
    </>
  );
}
