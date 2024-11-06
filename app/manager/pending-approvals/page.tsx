import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { PendingApprovalsClient } from './PendingApprovalsClient';

export default async function PendingApprovalsPage() {
  const pendingUsers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'pending'));

  return <PendingApprovalsClient pendingUsers={pendingUsers} />;
}
