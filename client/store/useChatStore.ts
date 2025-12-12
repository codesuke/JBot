import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  error?: boolean;
  retryable?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  
  // Conversation management
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setActiveConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  
  // Message management
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  removeMessage: (id: string) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  
  // Helpers
  getActiveConversation: () => Conversation | undefined;
  messages: Message[]; // Computed from active conversation
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (firstUserMessage) {
    const title = firstUserMessage.content.slice(0, 40);
    return title.length < firstUserMessage.content.length ? `${title}...` : title;
  }
  return 'New Chat';
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isLoading: false,
      
      // Computed messages from active conversation
      get messages() {
        const state = get();
        const activeConvo = state.conversations.find(c => c.id === state.activeConversationId);
        return activeConvo?.messages || [];
      },
      
      createConversation: () => {
        const newConvo: Conversation = {
          id: generateId(),
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          conversations: [newConvo, ...state.conversations],
          activeConversationId: newConvo.id,
        }));
        return newConvo.id;
      },
      
      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter(c => c.id !== id);
          const newActiveId = state.activeConversationId === id 
            ? (newConversations[0]?.id || null)
            : state.activeConversationId;
          return {
            conversations: newConversations,
            activeConversationId: newActiveId,
          };
        });
      },
      
      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },
      
      renameConversation: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map(c =>
            c.id === id ? { ...c, title, updatedAt: new Date() } : c
          ),
        }));
      },
      
      addMessage: (message) => {
        set((state) => {
          let activeId = state.activeConversationId;
          let conversations = state.conversations;
          
          // Create new conversation if none exists
          if (!activeId) {
            const newConvo: Conversation = {
              id: generateId(),
              title: 'New Chat',
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            conversations = [newConvo, ...conversations];
            activeId = newConvo.id;
          }
          
          // Add message to active conversation
          conversations = conversations.map(c => {
            if (c.id === activeId) {
              const newMessages = [...c.messages, message];
              return {
                ...c,
                messages: newMessages,
                title: c.title === 'New Chat' ? generateTitle(newMessages) : c.title,
                updatedAt: new Date(),
              };
            }
            return c;
          });
          
          return { conversations, activeConversationId: activeId };
        });
      },
      
      updateMessage: (id, updates) => {
        set((state) => ({
          conversations: state.conversations.map(c => {
            if (c.id === state.activeConversationId) {
              return {
                ...c,
                messages: c.messages.map(msg =>
                  msg.id === id ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date(),
              };
            }
            return c;
          }),
        }));
      },
      
      removeMessage: (id) => {
        set((state) => ({
          conversations: state.conversations.map(c => {
            if (c.id === state.activeConversationId) {
              return {
                ...c,
                messages: c.messages.filter(msg => msg.id !== id),
                updatedAt: new Date(),
              };
            }
            return c;
          }),
        }));
      },
      
      clearChat: () => {
        const newId = get().createConversation();
        set({ activeConversationId: newId });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      getActiveConversation: () => {
        const state = get();
        return state.conversations.find(c => c.id === state.activeConversationId);
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
      // Custom storage to handle Date serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          const parsed = JSON.parse(str);
          
          // Convert date strings back to Date objects
          if (parsed.state?.conversations) {
            parsed.state.conversations = parsed.state.conversations.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            }));
          }
          
          return parsed;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
