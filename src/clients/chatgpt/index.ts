import { getUserCfg } from '../../config';
import { AbstractClient, IGenerateResponseParams } from '../abstract';
import { ChatGPTApiClient } from '../chatgpt-api';
import { ChatGPTTurboClient } from '../chatgpt-turbo';

export class ChatGPTClient extends AbstractClient {
  private client: ChatGPTApiClient | ChatGPTTurboClient;

  constructor() {
    super();
    this.client = new ChatGPTApiClient();

    getUserCfg().then(({ openaiApiKey }) => {
      if (openaiApiKey) this.client = new ChatGPTTurboClient();
    });
  }

  doAskAI(params: IGenerateResponseParams): Promise<void> {
    return this.client.doAskAI(params);
  }

  resetConvo(): void {
    return this.client.resetConvo();
  }
}
