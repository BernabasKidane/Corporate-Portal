'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '../ui/modeToggle';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Employee Portal
        </Link>

        <div className="flex items-center gap-4">
          <ModeToggle />
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user?.name}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
