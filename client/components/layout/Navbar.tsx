'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare, User } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
