import { db } from '@/lib/db';
import { quizResults } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, parseInt(session.user?.id as string)))
      .orderBy(desc(quizResults.completedAt))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      score: result[0].score,
      passed: result[0].passed,
      completedAt: result[0].completedAt,
    });
  } catch (error) {
    console.error('Failed to fetch quiz result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz result' },
      { status: 500 }
    );
  }
}
