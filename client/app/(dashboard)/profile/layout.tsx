'use client';

import { MainNav } from '@/components/nav/MainNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
