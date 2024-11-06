'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuestionManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      setError('Failed to load questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error('Failed to create question');

      await fetchQuestions();
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      });
    } catch (error) {
      setError('Failed to create question');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete question');
      await fetchQuestions();
    } catch (error) {
      setError('Failed to delete question');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
          <CardDescription>Create a new quiz question</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <Textarea
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Options</label>
              {newQuestion.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Correct Answer
              </label>
              <select
                value={newQuestion.correctAnswer}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correctAnswer: e.target.value,
                  })
                }
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select correct answer</option>
                {newQuestion.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">Add Question</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Questions</h2>
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {question.options.map((option, index) => (
                  <li
                    key={index}
                    className={
                      option === question.correctAnswer
                        ? 'text-green-600 font-medium'
                        : ''
                    }
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => handleDelete(question.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
