import { v4 as uuid } from 'uuid';
import { ISSEChatGPTResponse } from '../../interfaces';
import { ClientError, ErrorCode } from '../../utils/errors';
import { parseSSE } from '../../utils/sse';
import { AbstractClient, IGenerateResponseParams } from '../abstract';
import { chatGPTClient } from './client';

interface ConversationContext {
  conversationId: string;
  lastMessageId: string;
}

export class ChatGPTApiClient extends AbstractClient {
  private accessToken: string | undefined;

  private conversationCtx: ConversationContext | undefined;

  private modelName: string | undefined;

  async doAskAI(params: IGenerateResponseParams): Promise<void> {
    if (!this.accessToken) this.accessToken = await chatGPTClient.getAccessToken();

    const currentModel = await this.getCurrentModel();

    const resp = await chatGPTClient.fetch('https://chat.openai.com/backend-api/conversation', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify({
        action: 'next',
        messages: [
          {
            id: uuid(),
            author: { role: 'user' },
            content: {
              content_type: 'text',
              parts: [params.prompt],
            },
          },
        ],
        model: currentModel,
        conversation_id: this.conversationCtx?.conversationId || undefined,
        parent_message_id: this.conversationCtx?.lastMessageId || uuid(),
      }),
    });

    const respClone = resp.clone();

    await parseSSE(respClone, (message) => {
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' });
        return;
      }
      let data;
      try {
        data = JSON.parse(message) as ISSEChatGPTResponse;
      } catch (err) {
        console.error('parseSSE', err);
        return;
      }

      if (data.error) {
        console.error('parseSSE', data.error);
        throw new ClientError(data.error, ErrorCode.UNKOWN_ERROR);
      }
      const text = data.message?.content?.parts?.[0];
      if (text && data.message) {
        this.conversationCtx = {
          conversationId: data.conversation_id,
          lastMessageId: data.message.id,
        };
        params.onEvent({
          type: 'ANSWER',
          data: { text },
        });
      }
    });
  }

  resetConvo() {
    this.conversationCtx = undefined;
  }

  private async getCurrentModel(): Promise<string> {
    if (this.modelName) return this.modelName;

    try {
      const models = await chatGPTClient.getModels(this.accessToken!);
      this.modelName = models[0].slug;
      return this.modelName;
    } catch (error) {
      console.error(error);
      return 'text-davinci-002-render';
    }
  }
}
