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
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
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
      if (editingQuestion) {
        const response = await fetch(
          `/api/admin/questions/${editingQuestion.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuestion),
          }
        );

        if (!response.ok) throw new Error('Failed to update question');
      } else {
        const response = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newQuestion),
        });

        if (!response.ok) throw new Error('Failed to create question');
      }

      await fetchQuestions();
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      });
      setEditingQuestion(null);
    } catch (error) {
      setError(
        editingQuestion
          ? 'Failed to update question'
          : 'Failed to create question'
      );
      console.error(error);
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setNewQuestion({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
    });
  };

  const handleCancel = () => {
    setEditingQuestion(null);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
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
      {!editingQuestion && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
            <CardDescription>Create a new quiz question</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionForm
              question={newQuestion}
              setQuestion={setNewQuestion}
              onSubmit={handleSubmit}
              isEditing={false}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Existing Questions</h2>
        {questions.map((question) => (
          <Card key={question.id}>
            {editingQuestion?.id === question.id ? (
              <>
                <CardHeader>
                  <CardTitle>Edit Question</CardTitle>
                  <CardDescription>Update existing question</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuestionForm
                    question={newQuestion}
                    setQuestion={setNewQuestion}
                    onSubmit={handleSubmit}
                    isEditing={true}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </>
            ) : (
              <>
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
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(question)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

interface QuestionFormProps {
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  setQuestion: (question: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
  onCancel: () => void;
}

function QuestionForm({
  question,
  setQuestion,
  onSubmit,
  isEditing,
  onCancel,
}: QuestionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Question</label>
        <Textarea
          value={question.question}
          onChange={(e) =>
            setQuestion({ ...question, question: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Options</label>
        {question.options.map((option, index) => (
          <Input
            key={index}
            value={option}
            onChange={(e) => {
              const newOptions = [...question.options];
              newOptions[index] = e.target.value;
              setQuestion({ ...question, options: newOptions });
            }}
            placeholder={`Option ${index + 1}`}
            required
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correct Answer</label>
        <select
          value={question.correctAnswer}
          onChange={(e) =>
            setQuestion({
              ...question,
              correctAnswer: e.target.value,
            })
          }
          className="w-full border rounded-md p-2"
          required
        >
          <option value="">Select correct answer</option>
          {question.options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {isEditing ? 'Update Question' : 'Add Question'}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
