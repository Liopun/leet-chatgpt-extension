import { IModel } from '../../interfaces';
import { RequestParams } from '../../interfaces/request';
import { ClientError, ErrorCode } from '../../utils/errors';
import { IRequest, questionRequest } from './request';

export class Client {
  request: IRequest;

  constructor() {
    this.request = questionRequest;
  }

  switchRequest(newRequest: IRequest) {
    console.debug('client switching request to', newRequest);
    this.request = newRequest;
  }

  async fetch(url: string, options?: RequestParams): Promise<Response> {
    return this.request.fetch(url, options);
  }

  async getAccessToken(): Promise<string> {
    const resp = await this.fetch('https://chat.openai.com/api/auth/session');
    if (resp.status === 403) {
      throw new ClientError('Please pass Cloudflare check', ErrorCode.CHATGPT_CLOUDFLARE);
    }

    const data = (await resp.json().catch(() => ({}))) as { accessToken: string };
    if (!data.accessToken) {
      throw new ClientError('UNAUTHORIZED', ErrorCode.CHATGPT_UNAUTHORIZED);
    }
    return data.accessToken;
  }

  async getModels(token: string): Promise<IModel[]> {
    const resp = (await this.backendAPIWithToken(token, 'GET', '/models').then((r) => r.json())) as {
      models: IModel[];
    };
    return resp.models;
  }

  private async backendAPIWithToken(token: string, method: string, path: string, data?: unknown) {
    return this.fetch(`https://chat.openai.com/backend-api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  }
}

export const chatGPTClient = new Client();
