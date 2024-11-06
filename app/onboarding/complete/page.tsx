'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function OnboardingComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const hasPassed = score >= 70;

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">
          {hasPassed ? '🎉 Congratulations!' : '😔 Not Quite There'}
        </h1>
        <p className="text-xl mb-4">
          {hasPassed
            ? "You've successfully completed the onboarding process."
            : "Unfortunately, you didn't meet the minimum required score."}
        </p>
        <div className="text-2xl font-semibold">
          Your Score:{' '}
          <span
            className={`${hasPassed ? 'text-primary' : 'text-destructive'}`}
          >
            {score}%
          </span>
        </div>
        <p className="mt-6 text-muted-foreground">
          {hasPassed
            ? "You're now ready to start using the platform."
            : 'Please try the onboarding process again. You need 70% to pass.'}
        </p>

        {!hasPassed && (
          <Button className="mt-6" onClick={() => router.push('/onboarding')}>
            Try Again
          </Button>
        )}
      </Card>
    </div>
  );
}
