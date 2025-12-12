'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Plus, MessageSquarePlus } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Anthropic from '@/components/kokonutui/anthropic';
import AnthropicDark from '@/components/kokonutui/anthropic-dark';
import { useChatStore } from '@/store/useChatStore';
import { useEffect, useState } from 'react';

export function ChatHeader() {
  const [isDark, setIsDark] = useState(false);
  const { createConversation, setActiveConversation, getActiveConversation } = useChatStore();
  const activeConversation = getActiveConversation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleNewChat = () => {
    const newId = createConversation();
    setActiveConversation(newId);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Toggle and Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="hover:bg-accent" />
          <div className="flex items-center gap-2">
            {isDark ? (
              <AnthropicDark className="h-5 w-5" />
            ) : (
              <Anthropic className="h-5 w-5" />
            )}
            <h1 className="text-lg font-semibold">JBot</h1>
          </div>
        </div>

        {/* Center - Conversation Title */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
            {activeConversation?.title || 'New Chat'}
          </span>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewChat}
            title="New Chat"
            className="hover:bg-accent"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
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
