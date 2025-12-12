'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useToastStore } from '@/store/useToastStore';
import { sendMessage, NetworkError, RateLimitError, APIError } from '@/lib/api';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInput } from '@/components/chat/ChatInput';
import { ToastContainer } from '@/components/ui/Toast';
import { MODELS } from '@/lib/constants';

// Helper function to generate unique IDs
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { addMessage, setLoading, isLoading } = useChatStore();
  const { toasts, addToast, removeToast } = useToastStore();
  const [isOnline, setIsOnline] = useState(true);
  const lastModelRef = useRef<string>(MODELS.GEMINI_FLASH);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast('Back online', 'success');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      addToast('You are offline. Messages will be sent when connection is restored.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addToast]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const handleSendMessage = async (content: string, model: string) => {
    lastModelRef.current = model; // Track last used model for resend
    const userMessageId = generateUniqueId();
    const userMessage = {
      id: userMessageId,
      content,
      role: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setLoading(true);

    try {
      const response = await sendMessage(content, session.user?.email || '', model);
      
      const assistantMessage = {
        id: `assistant-${response.id}-${generateUniqueId()}`,
        content: response.content,
        role: 'assistant' as const,
        timestamp: new Date(response.timestamp),
      };

      addMessage(assistantMessage);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      let errorContent = 'Sorry, I encountered an error. Please try again.';
      let retryable = true;
      
      if (error instanceof NetworkError) {
        errorContent = '🌐 ' + error.message;
        addToast(error.message, 'error');
      } else if (error instanceof RateLimitError) {
        errorContent = `⏳ Rate limit reached. Please wait ${error.retryAfter} seconds before trying again.`;
        addToast(`Rate limit: Please wait ${error.retryAfter} seconds`, 'warning');
      } else if (error instanceof APIError) {
        errorContent = error.message;
        retryable = error.retryable;
        
        if (error.errorCode === 'CONTENT_FILTERED') {
          addToast('Message blocked by safety filters. Please rephrase.', 'warning');
        } else if (error.errorCode === 'AUTH_ERROR') {
          addToast('Authentication error. Please check API configuration.', 'error');
        } else if (error.retryable) {
          addToast('Service temporarily unavailable. Retrying...', 'info');
        } else {
          addToast(error.message, 'error');
        }
      } else {
        addToast('Unexpected error occurred', 'error');
      }
      
      const errorMessage = {
        id: `error-${generateUniqueId()}`,
        content: errorContent,
        role: 'assistant' as const,
        timestamp: new Date(),
        error: true,
        retryable,
      };
      
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = (content: string) => {
    handleSendMessage(content, lastModelRef.current);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatHistory onResend={handleResend} />
      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading}
        disabled={!isOnline}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
