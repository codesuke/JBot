'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Sparkles } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MODELS } from '@/lib/constants';
import Anthropic from '@/components/kokonutui/anthropic';
import AnthropicDark from '@/components/kokonutui/anthropic-dark';

interface ChatHeaderProps {
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function ChatHeader({ selectedModel, onModelChange }: ChatHeaderProps) {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Toggle and Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent" />
          <div className="flex items-center gap-2">
            {isDark ? (
              <AnthropicDark className="h-6 w-6" />
            ) : (
              <Anthropic className="h-6 w-6" />
            )}
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              JBot
            </h1>
          </div>
        </div>

        {/* Center - Model Selector */}
        <div className="flex flex-1 justify-center items-center gap-2 -ml-16">
          {onModelChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 hover:bg-accent px-6 min-w-[140px]"
                  title="Select AI Model"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {selectedModel?.split('-').pop() || 'Model'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {Object.values(MODELS).map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => onModelChange(model)}
                    className={`cursor-pointer gap-2 ${selectedModel === model ? 'bg-accent' : ''}`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">{model}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right side - Theme Toggle and Logout */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Sign out"
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
