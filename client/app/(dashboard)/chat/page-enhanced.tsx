'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore-enhanced';
import { sendMessage, APIError } from '@/lib/api-enhanced';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInput } from '@/components/chat/ChatInput';
import { useToast } from '@/components/ui/toast-provider';
import { useEffect, useState } from 'react';

// Helper function to generate unique IDs
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { addMessage, updateMessageStatus, setLoading, isLoading } = useChatStore();
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connection restored', 'success', 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are offline. Messages will be sent when connection is restored.', 'warning', 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

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
    // Check if offline
    if (!isOnline) {
      showToast('Cannot send message while offline', 'error', 4000);
      return;
    }

    const userMessageId = generateUniqueId();
    const userMessage = {
      id: userMessageId,
      content,
      role: 'user' as const,
      timestamp: new Date(),
      status: 'sent' as const,
    };

    addMessage(userMessage);
    setLoading(true);

    const assistantMessageId = `assistant-${generateUniqueId()}`;
    const loadingMessage = {
      id: assistantMessageId,
      content: 'Thinking...',
      role: 'assistant' as const,
      timestamp: new Date(),
      status: 'sending' as const,
    };
    addMessage(loadingMessage);

    try {
      const response = await sendMessage(content, session.user?.email || '', model);
      
      // Update with actual response
      updateMessageStatus(assistantMessageId, 'sent');
      
      const assistantMessage = {
        id: assistantMessageId,
        content: response.content,
        role: 'assistant' as const,
        timestamp: new Date(response.timestamp),
        status: 'sent' as const,
      };

      // Replace loading message with actual response
      useChatStore.setState((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === assistantMessageId ? assistantMessage : msg
        ),
      }));

    } catch (error) {
      console.error('Failed to send message:', error);
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      let toastMessage = 'Failed to send message';
      let duration = 5000;

      if (error instanceof APIError) {
        errorMessage = error.message;
        toastMessage = error.message;

        if (error.errorCode === 'RATE_LIMIT_EXCEEDED' && error.retryAfter) {
          toastMessage = `Rate limit exceeded. Try again in ${error.retryAfter} seconds.`;
          duration = 7000;
        } else if (error.retryable) {
          toastMessage = `${error.message} (You can retry)`;
        }
      }

      // Remove loading message and show error
      useChatStore.setState((state) => ({
        messages: state.messages.filter((msg) => msg.id !== assistantMessageId),
      }));

      const errorMsg = {
        id: `error-${generateUniqueId()}`,
        content: errorMessage,
        role: 'assistant' as const,
        timestamp: new Date(),
        status: 'error' as const,
        error: error instanceof APIError ? error.errorCode : 'UNKNOWN_ERROR',
      };
      addMessage(errorMsg);

      showToast(toastMessage, 'error', duration);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <ChatHistory />
      <ChatInput 
        onSend={handleSendMessage} 
        isLoading={isLoading}
        disabled={!isOnline}
      />
      {!isOnline && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-4 py-2 rounded-full text-sm">
          Offline - Messages will queue
        </div>
      )}
    </div>
  );
}
