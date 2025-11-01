interface ChatResponse {
  id: number;
  content: string;
  role: string;
  model: string;
  timestamp: string;
}

export async function sendMessage(content: string, userId: string, model: string = 'gemini-pro'): Promise<ChatResponse> {
  try {
    const res = await fetch('http://localhost:8080/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content, 
        userId, 
        model 
      }),
    });

    if (!res.ok) {
      throw new Error(`Backend error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to send message to backend');
  }
}

export async function getChatHistory(userId: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/chat/messages/${userId}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
