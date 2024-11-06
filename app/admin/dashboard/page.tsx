'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionManager } from '@/components/admin/QuestionManager';
import { EmployeeScores } from '@/components/admin/EmployeeScores';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    //
  }, [status, session, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="scores">Employee Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <QuestionManager />
        </TabsContent>

        <TabsContent value="scores">
          <EmployeeScores />
        </TabsContent>
      </Tabs>
    </div>
  );
}
