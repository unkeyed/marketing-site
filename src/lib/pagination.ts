import { notFound } from 'next/navigation';

export function getPaginationPage(value: string): number {
  const page = Number(value);

  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(page) || page < 2) {
    notFound();
  }

  return page;
}
