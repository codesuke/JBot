'use client';

import Link from 'next/link';

export default function DesignPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-card p-8">
        <h2 className="text-2xl font-bold text-foreground">Welcome to the Design System</h2>
        <p className="mt-4 text-muted-foreground">
          This is a private design showcase page. Here you can explore the complete design system
          including colors, typography, and all available components used throughout the
          application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/design/colors"
          className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-primary group-hover:text-primary">
            🎨 Colors
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore the complete color palette including light and dark themes
          </p>
        </Link>

        <Link
          href="/design/components"
          className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-primary group-hover:text-primary">
            🧩 Components
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            View all available UI components and their variations
          </p>
        </Link>
      </div>
    </div>
  );
}
