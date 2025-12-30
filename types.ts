export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WebhookResponse {
  content: {
    parts: Array<{
      text: string;
    }>;
    role?: string;
  };
  finishReason?: string;
  index?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}