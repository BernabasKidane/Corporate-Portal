'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EmployeeScore {
  id: number;
  name: string;
  email: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

export function EmployeeScores() {
  const [scores, setScores] = useState<EmployeeScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/admin/scores');
        if (!response.ok) throw new Error('Failed to fetch scores');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        setError('Failed to load scores');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.name}</TableCell>
              <TableCell>{score.email}</TableCell>
              <TableCell>{score.score}%</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    score.passed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {score.passed ? 'Passed' : 'Failed'}
                </span>
              </TableCell>
              <TableCell>
                {new Date(score.completedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
