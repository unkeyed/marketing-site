'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-w-0 flex-col items-center justify-center py-20 text-center">
      <p className="text-lg tracking-tight text-muted-foreground">Something went wrong.</p>
      <button
        className="mt-4 text-sm underline underline-offset-4"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
