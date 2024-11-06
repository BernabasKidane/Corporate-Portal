import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { score, passed } = await request.json();

    await db.insert(quizResults).values({
      userId: (session.user as any).id,
      score,
      passed,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to submit quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz results' },
      { status: 500 }
    );
  }
}
