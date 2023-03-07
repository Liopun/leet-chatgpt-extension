import ExpiryMap from 'expiry-map';
import { v4 as uuidv4 } from 'uuid';
import { fetchSSE } from '../background/fetch-sse';
import { IClient, IGenerateResponseParams, IModels, ISSEChatGPT, ISSEChatGPTResponse } from '../interfaces';
import { request } from './request';

const KEY_ACCESS_TOKEN = 'accessToken';
const CHATGPT_URL = 'https://chat.openai.com/api/auth/session';
const cache = new ExpiryMap(10 * 1000);

const SubmitMessageFeedback = async (token: string, data: unknown) => {
  await request(token, 'POST', '/conversation/message_feedback', data);
};

const setConversation = async (token: string, convoId: string, propertyObj: object) => {
  await request(token, 'PATCH', `/conversation/${convoId}`, propertyObj);
};

const GetAuthAccessToken = async (): Promise<string> => {
  if (cache.get(KEY_ACCESS_TOKEN)) return cache.get(KEY_ACCESS_TOKEN) as string;

  const res = await fetch(CHATGPT_URL);
  if (res.status === 403) throw new Error('CLOUDFLARE');

  const data = (await res.json().catch(() => ({}))) as { accessToken: string };
  if (!data.accessToken) throw new Error('UNAUTHORIZED');

  cache.set(KEY_ACCESS_TOKEN, data.accessToken);

  return data.accessToken;
};

class ChatGPTClient implements IClient {
  constructor(private token: string) {
    this.token = token;
  }

  private getModels = async (): Promise<IModels[]> => {
    const response = (await request(this.token, 'GET', '/models').then((r) => r.json())) as IModels[];
    return response;
  };

  private getModelName = async (): Promise<string> => {
    try {
      const models = await this.getModels();
      return models[0].slug;
    } catch (error) {
      console.error(error);
      return 'text-davinci-002-render';
    }
  };

  async askAI(params: IGenerateResponseParams): Promise<{ cleanUp?: () => void }> {
    let convoId: string | undefined;
    const convoURL = 'https://chat.openai.com/backend-api/conversation';

    const cleanUp = () => {
      if (convoId && convoId.length > 0) setConversation(this.token, convoId, { is_visible: false });
    };

    const modelName = await this.getModelName();

    const sseBodyObj: ISSEChatGPT = {
      action: 'next',
      messages: [
        {
          id: uuidv4(),
          role: 'user',
          content: {
            content_type: 'text',
            parts: [params.prompt],
          },
        },
      ],
      model: modelName,
      parent_message_id: uuidv4(),
    };

    await fetchSSE(convoURL, {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(sseBodyObj),
      onMessage(msg: string) {
        if (msg === '[DONE]') {
          params.onEvent({ type: 'done' });
          cleanUp();
          return;
        }

        try {
          const data = JSON.parse(msg) as ISSEChatGPTResponse;
          const text = data.message?.content?.parts[0];

          if (text && data.message) {
            convoId = data.conversation_id;
            params.onEvent({
              type: 'answer',
              data: {
                text,
                messageId: data.message.id,
                conversationId: data.conversation_id,
              },
            });
          }
        } catch (error) {
          console.error(error);
          return;
        }
      },
    });

    return { cleanUp };
  }
}

export { SubmitMessageFeedback, GetAuthAccessToken, ChatGPTClient };
