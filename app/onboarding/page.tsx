import { OnboardingModule } from '@/components/onboarding/OnboardingModule';
import { Quiz } from '@/components/onboarding/Quiz';
import { db } from '@/lib/db';
import { onboardingModules, quizQuestions } from '@/lib/schema';
import { asc } from 'drizzle-orm';

export default async function OnboardingPage() {
  const modules = await db
    .select()
    .from(onboardingModules)
    .orderBy(asc(onboardingModules.order));
  const questions = (await db.select().from(quizQuestions).execute()).map(
    (q) => ({
      ...q,
      options: q.options as string[],
    })
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Employee Onboarding</h1>

      <div className="space-y-8">
        {modules.map((module) => (
          <OnboardingModule
            key={module.id}
            module={{
              ...module,
              description: module.description ?? '',
              content: module.content as {
                videoUrl?: string;
                readingMaterial?: string;
              },
            }}
            onComplete={(moduleId) => {
              // Handle module completion
            }}
          />
        ))}
      </div>

      <Quiz
        questions={questions}
        onComplete={(score, passed) => {
          // Handle quiz completion
        }}
      />
    </div>
  );
}
