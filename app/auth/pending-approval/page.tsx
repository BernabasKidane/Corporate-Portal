import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Pending Approval | Employee Portal',
  description: 'Your registration is pending approval',
};

export default function PendingApprovalPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Registration Pending
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Your registration is currently pending approval from a manager. You
            will receive an email once your account has been approved.
          </p>
        </div>
        <div className="space-x-4">
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
