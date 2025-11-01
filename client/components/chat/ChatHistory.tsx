'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from './ChatMessage';
import { Loader } from '@/components/ui/Loader';

export function ChatHistory() {
  const { messages, isLoading } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto bg-background"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-3">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm opacity-70">
                Select a model and type your message below
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-accent/10 rounded-xl p-4 animate-pulse border border-accent/20">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
