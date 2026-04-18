import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!process.env.REVALIDATION_TOKEN || token !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    revalidateTag('changelogs', 'max');
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(err) },
      { status: 500 },
    );
  }
}
