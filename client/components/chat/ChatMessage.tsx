'use client';

import { useState } from 'react';
import { Message, useChatStore } from '@/store/useChatStore';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/lib/markdown';
import { Bot, User, Pencil, RotateCcw, X, Check, Trash2, Copy, CheckCheck } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
  onResend?: (content: string) => void;
}

export function ChatMessage({ message, onResend }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);
  const { updateMessage, removeMessage } = useChatStore();

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateMessage(message.id, { content: editContent.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleResend = () => {
    if (onResend) {
      onResend(message.content);
    }
  };

  const handleEditAndResend = () => {
    if (editContent.trim() && onResend) {
      updateMessage(message.id, { content: editContent.trim() });
      setIsEditing(false);
      onResend(editContent.trim());
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex gap-3 group',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={cn(
        'flex-1 max-w-[80%] space-y-1',
        isUser && 'flex flex-col items-end'
      )}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 relative',
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-md'
              : 'bg-muted rounded-tl-md',
            message.error && 'bg-destructive/10 border border-destructive/30'
          )}
        >
          {isEditing ? (
            <div className="space-y-2 min-w-[300px]">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] bg-background/80 border-none text-foreground resize-none text-sm"
                autoFocus
              />
              <div className="flex items-center gap-1 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-7 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  className="h-7 px-2 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                {onResend && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleEditAndResend}
                    className="h-7 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Resend
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={cn(
              'text-sm leading-relaxed',
              !isUser && 'prose prose-sm dark:prose-invert prose-p:my-1 prose-pre:my-2 max-w-none'
            )}>
              {isUser ? (
                <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
              ) : (
                <MarkdownRenderer content={message.content} />
              )}
            </div>
          )}
        </div>
        
        {/* Actions & Timestamp Row */}
        <div className={cn(
          'flex items-center gap-2 px-1',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          
          {/* Action buttons - show on hover */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-accent transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
                {isUser && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 rounded hover:bg-accent transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => removeMessage(message.id)}
                      className="p-1 rounded hover:bg-destructive/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </>
                )}
                {message.error && message.retryable && (
                  <button
                    onClick={handleResend}
                    className="p-1 rounded hover:bg-accent transition-colors"
                    title="Retry"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        {message.error && (
          <p className="text-xs text-destructive px-1">
            {message.retryable ? 'Failed to send. Click retry to try again.' : 'Message could not be delivered.'}
          </p>
        )}
      </div>
    </div>
  );
}
