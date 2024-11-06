import { db } from '@/lib/db';
import { quizResults, users } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export const revalidate = 0;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scores = await db
      .select({
        id: quizResults.id,
        name: users.name,
        email: users.email,
        score: quizResults.score,
        passed: quizResults.passed,
        completedAt: quizResults.completedAt,
      })
      .from(quizResults)
      .innerJoin(users, eq(users.id, quizResults.userId))
      .orderBy(desc(quizResults.completedAt));

    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}
