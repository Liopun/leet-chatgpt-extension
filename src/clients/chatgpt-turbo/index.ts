import { getUserCfg } from '../../config';
import { ISSEOpenAIResponse } from '../../interfaces';
import { ClientError, ErrorCode } from '../../utils/errors';
import { parseSSE } from '../../utils/sse';
import { AbstractClient, IGenerateResponseParams } from '../abstract';
import { CHATGPT_SYSTEM_MESSAGE, ChatMessage } from './constants';
import { updateTokenUsage } from './token';

interface ConversationContext {
  messages: ChatMessage[];
}

export class ChatGPTTurboClient extends AbstractClient {
  private conversationCtx: ConversationContext | undefined;

  async doAskAI(params: IGenerateResponseParams) {
    const { openaiApiKey, openaiApiHost } = await getUserCfg();

    if (!openaiApiKey) {
      throw new ClientError('OpenAI API key not set', ErrorCode.API_KEY_NOT_SET);
    }

    if (!this.conversationCtx) {
      this.conversationCtx = {
        messages: [{ role: 'system', content: CHATGPT_SYSTEM_MESSAGE }],
      };
    }

    this.conversationCtx.messages.push({ role: 'user', content: params.prompt });

    const resp = await fetch(`${openaiApiHost}/v1/chat/completions`, {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: this.conversationCtx.messages,
        temperature: 0.6,
        stream: true,
      }),
    });

    const result: ChatMessage = { role: 'assistant', content: '' };

    await parseSSE(resp, (message) => {
      if (message === '[DONE]') {
        params.onEvent({ type: 'DONE' });
        const messages = this.conversationCtx!.messages;
        messages.push(result);
        updateTokenUsage(messages).catch(console.error);
        return;
      }

      let data;
      try {
        data = JSON.parse(message) as ISSEOpenAIResponse;
      } catch (err) {
        console.error('parseSSE', err);
        return;
      }

      if (data?.choices?.length) {
        const delta = data.choices[0].delta;
        if (delta?.content) {
          result.content += delta.content;
          params.onEvent({
            type: 'ANSWER',
            data: { text: result.content },
          });
        }
      }
    });
  }

  resetConvo(): void {
    this.conversationCtx = undefined;
  }
}
