'use client';

import { useEffect, useState } from 'react';
import { OnboardingModule } from '@/components/onboarding/OnboardingModule';
import { Quiz } from '@/components/onboarding/Quiz';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Module {
  id: number;
  title: string;
  description: string | null;
  content: {
    videoUrl?: string;
    readingMaterial?: string;
  };
  order: number;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizResult {
  score: number;
  passed: boolean;
  completedAt: string;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const [onboardingResponse, quizResultResponse] = await Promise.all([
          fetch('/api/onboarding/data'),
          fetch('/api/onboarding/quiz-result'),
        ]);

        if (!onboardingResponse.ok) {
          throw new Error('Failed to fetch onboarding data');
        }

        const onboardingData = await onboardingResponse.json();
        setModules(onboardingData.modules);
        setQuestions(onboardingData.questions);

        if (quizResultResponse.ok) {
          const resultData = await quizResultResponse.json();
          setQuizResult(resultData);
        }
      } catch (error) {
        setError('Failed to load onboarding content');
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, session, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Employee Onboarding</h1>
        {quizResult && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">Previous Quiz Result</h2>
            <div className="space-y-1">
              <p className="text-sm">
                Score: <span className="font-medium">{quizResult.score}%</span>
              </p>
              <p className="text-sm">
                Status:{' '}
                <span
                  className={`font-medium ${
                    quizResult.passed ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {quizResult.passed ? 'Passed' : 'Failed'}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Completed on:{' '}
                {new Date(quizResult.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {modules.map((module) => (
          <OnboardingModule
            key={module.id}
            module={{
              ...module,
              description: module.description ?? '',
              content: module.content,
            }}
            onComplete={async (moduleId) => {
              try {
                await fetch('/api/onboarding/complete-module', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ moduleId }),
                });
              } catch (error) {
                console.error('Error completing module:', error);
              }
            }}
          />
        ))}
      </div>

      {questions.length > 0 && !quizResult?.passed && (
        <Quiz
          questions={questions}
          onComplete={async (score, passed) => {
            try {
              const response = await fetch('/api/onboarding/submit-quiz', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score, passed }),
              });

              if (response.ok) {
                const result = await response.json();
                setQuizResult(result);
                if (passed) {
                  router.push(`/onboarding/complete?score=${score}`);
                }
              }
            } catch (error) {
              console.error('Error submitting quiz:', error);
            }
          }}
        />
      )}
    </div>
  );
}
