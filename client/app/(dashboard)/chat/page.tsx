'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { sendMessage } from '@/lib/api';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { ChatInput } from '@/components/chat/ChatInput';

// Helper function to generate unique IDs
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const { addMessage, setLoading, isLoading } = useChatStore();

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
    const userMessage = {
      id: generateUniqueId(),
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
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: `error-${generateUniqueId()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant' as const,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
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
      />
    </div>
  );
}
