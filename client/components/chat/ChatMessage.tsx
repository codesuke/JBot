'use client';

import { Message } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/lib/markdown';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3 mb-4',
        isUser && 'justify-end'
      )}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-5 w-5 text-accent" />
        </div>
      )}
      
      <div
        className={cn(
          'flex-1 max-w-[85%] rounded-xl px-4 py-3',
          isUser
            ? 'bg-linear-to-r from-primary to-primary/80 text-primary-foreground rounded-br-none'
            : 'bg-muted border border-border rounded-bl-none'
        )}
      >
        <div className="space-y-1">
          <p className="text-xs font-semibold opacity-75">
            {isUser ? 'You' : 'AI Assistant'}
          </p>
          <div className={cn(
            'text-sm leading-relaxed',
            !isUser && 'prose-sm dark:prose-invert'
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
          <p className="text-xs opacity-60 mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
          <User className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  );
}
