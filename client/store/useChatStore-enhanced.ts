import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  error?: string;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  updateMessageStatus: (id: string, status: 'sending' | 'sent' | 'error', error?: string) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  retryMessage: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      updateMessageStatus: (id, status, error) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, status, error } : msg
          ),
        })),
      clearChat: () => set({ messages: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
      retryMessage: (id) => {
        // Mark message for retry
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, status: 'sending' as const, error: undefined } : msg
          ),
        }));
      },
    }),
    {
      name: 'chat-storage',
      // Only persist messages, not loading state
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
