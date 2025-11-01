'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import React from 'react';

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-center px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 absolute left-4">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-lg sm:inline">JBot</span>
        </div>

        {/* Center: Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/chat" className={navigationMenuTriggerStyle()}>
                  Chat
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/profile" className={navigationMenuTriggerStyle()}>
                  Profile
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent className="left-0">
                <ul className="grid w-[200px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/settings"
                        className="block rounded-md p-2 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Settings className="h-4 w-4" />
                          Settings
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/help"
                        className="block rounded-md p-2 hover:bg-accent transition-colors"
                      >
                        <div className="text-sm font-medium">Help & Support</div>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right: Theme Toggle & User Menu */}
        <div className="flex items-center gap-2 absolute right-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
