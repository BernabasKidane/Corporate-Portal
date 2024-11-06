'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, passed: boolean) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // If there are no questions, don't render the quiz
  if (!questions || questions.length === 0) {
    return null;
  }

  const handleNext = () => {
    setAnswers([...answers, selectedAnswer]);
    setSelectedAnswer('');

    if (currentQuestion === questions.length - 1) {
      // Calculate score including the last answer
      const finalAnswers = [...answers, selectedAnswer];
      const score = finalAnswers.reduce((acc, answer, index) => {
        return answer === questions[index].correctAnswer ? acc + 1 : acc;
      }, 0);

      const passed = score / questions.length >= 0.7; // 70% passing threshold
      onComplete((score / questions.length) * 100, passed);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Final Quiz</h2>
      <p className="text-gray-600">
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <div className="space-y-4">
        <p className="text-lg">{currentQuestionData.question}</p>

        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          {currentQuestionData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <label htmlFor={`option-${index}`} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedAnswer}
        className="w-full"
      >
        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
      </Button>
    </Card>
  );
}
