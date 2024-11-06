import { db } from '@/lib/db';
import { onboardingModules, quizQuestions } from '@/lib/schema';
import { asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// revalidate every 10 seconds
export const revalidate = 10;

export async function GET() {
  try {
    const modules = await db
      .select()
      .from(onboardingModules)
      .orderBy(asc(onboardingModules.order));

    const questions = await db.select().from(quizQuestions);

    return NextResponse.json({
      modules,
      questions: questions.map((q) => ({
        ...q,
        options: q.options as string[],
      })),
    });
  } catch (error) {
    console.error('Failed to fetch onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding data' },
      { status: 500 }
    );
  }
}
