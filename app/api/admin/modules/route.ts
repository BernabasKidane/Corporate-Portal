import { db } from '@/lib/db';
import { onboardingModules } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { asc } from 'drizzle-orm';

export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const modules = await db
      .select()
      .from(onboardingModules)
      .orderBy(asc(onboardingModules.order));

    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const module = await db.insert(onboardingModules).values(body);
    return NextResponse.json(module);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
