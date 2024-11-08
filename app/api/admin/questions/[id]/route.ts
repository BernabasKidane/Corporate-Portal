import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizQuestions } from '@/lib/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/schema';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));

    if (user?.[0]?.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const data = await request.json();
    const questionId = parseInt(params.id);

    const [updatedQuestion] = await db
      .update(quizQuestions)
      .set({
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
      })
      .where(eq(quizQuestions.id, questionId))
      .returning();

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
