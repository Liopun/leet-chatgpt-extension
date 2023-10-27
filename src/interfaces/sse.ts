export type SSEMessage = {
  id: string;
  role: string;
  content: {
    content_type: string;
    parts: string[];
  };
};

export interface ISSEChatGPT {
  action: string;
  messages: SSEMessage[];
  model: string;
  parent_message_id: string;
}

export interface ISSEChatGPTResponse {
  conversation_id: string;
  error?: string;
  message?: {
    id: string;
    content?: {
      parts: string[];
    };
  };
}

export interface ISSEOpenAI {
  model: string;
  prompt: string;
  stream: boolean;
  max_tokens: number;
}

export interface ISSEOpenAIResponse {
  id: string;
  choices: [
    {
      delta: {
        content: string;
      };
      index: number;
    }
  ];
}
