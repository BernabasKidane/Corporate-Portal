import { db } from '@/lib/db';
import { onboardingProgress } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = await request.json();

    await db.insert(onboardingProgress).values({
      userId: (session.user as any).id,
      moduleId,
      completed: true,
      completedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to complete module:', error);
    return NextResponse.json(
      { error: 'Failed to complete module' },
      { status: 500 }
    );
  }
}
