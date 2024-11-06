'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PendingApprovalsClientProps {
  pendingUsers: User[];
}

export function PendingApprovalsClient({
  pendingUsers: initialUsers,
}: PendingApprovalsClientProps) {
  const [pendingUsers, setPendingUsers] = useState(initialUsers);

  const handleApprove = async (userId: number) => {
    try {
      const response = await fetch('/api/users/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('Failed to approve user:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Approvals</h1>

      {pendingUsers.length === 0 ? (
        <p className="text-muted-foreground">No pending approvals</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button onClick={() => handleApprove(user.id)}>Approve</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
