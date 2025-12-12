'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatMessage } from './ChatMessage';
import { Loader } from '@/components/ui/Loader';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ChatHistoryProps {
  onResend?: (content: string) => void;
}

export function ChatHistory({ onResend }: ChatHistoryProps) {
  const { conversations, activeConversationId, isLoading } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get messages from active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

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
      <div className="max-w-3xl mx-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Ask me anything! I can help with coding, writing, analysis, and more.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {['Explain a concept', 'Write code', 'Debug an issue', 'Brainstorm ideas'].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-3 py-1.5 text-sm rounded-full border border-border hover:bg-accent transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onResend={onResend}
              />
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start mt-4">
            <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3">
              <Loader />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
