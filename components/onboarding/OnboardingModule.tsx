'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OnboardingModuleProps {
  module: {
    id: number;
    title: string;
    description: string;
    content: {
      videoUrl?: string;
      readingMaterial?: string;
    };
  };
  onComplete: (moduleId: number) => void;
}

export function OnboardingModule({
  module,
  onComplete,
}: OnboardingModuleProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = async () => {
    try {
      const response = await fetch('/api/onboarding/complete-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleId: module.id }),
      });

      if (response.ok) {
        setIsCompleted(true);
        onComplete(module.id);
      }
    } catch (error) {
      console.error('Failed to mark module as complete:', error);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">{module.title}</h2>
      <p className="text-gray-600">{module.description}</p>

      {module.content.videoUrl && (
        <div className="aspect-video">
          <video
            src={module.content.videoUrl}
            controls
            className="w-full h-full"
          />
        </div>
      )}

      {module.content.readingMaterial && (
        <div className="prose max-w-none">{module.content.readingMaterial}</div>
      )}

      <Button
        onClick={handleComplete}
        disabled={isCompleted}
        className="w-full"
      >
        {isCompleted ? 'Completed' : 'Mark as Complete'}
      </Button>
    </Card>
  );
}
