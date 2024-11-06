import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';

export default async function PendingApprovalsPage() {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'pending'));

  const handleApprove = async (userId: number) => {
    await db
      .update(users)
      .set({ role: 'employee' })
      .where(eq(users.id, userId));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Approvals</h1>

      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <Button onClick={() => handleApprove(user.id)}>Approve</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
