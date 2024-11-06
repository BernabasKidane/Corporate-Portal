'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '../ui/modeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  const roleBasedLinks = () => {
    switch (session?.user?.role) {
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Admin Dashboard' },
          { href: '/manager/pending-approvals', label: 'Pending Approvals' },
        ];
      case 'manager':
        return [
          { href: '/manager/pending-approvals', label: 'Pending Approvals' },
        ];
      case 'employee':
        return [{ href: '/onboarding', label: 'Onboarding' }];
      default:
        return [];
    }
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    {session.user?.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {roleBasedLinks().map((link) => (
                    <DropdownMenuItem key={link.href}>
                      <Link href={link.href} className="w-full">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
