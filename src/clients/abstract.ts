import { ClientError, ErrorCode } from '../utils/errors';

export interface IResponse {
  text: string;
  messageId: string;
  conversationId: string;
}

export type ResponseEvent =
  | {
      type: 'ANSWER';
      data: {
        text: string;
      };
    }
  | {
      type: 'DONE';
    }
  | {
      type: 'ERROR';
      error: ClientError;
    };

export interface IGenerateResponseParams {
  prompt: string;
  onEvent: (e: ResponseEvent) => void;
  signal?: AbortSignal;
}

export abstract class AbstractClient {
  async askAI(params: IGenerateResponseParams) {
    try {
      await this.doAskAI(params);
    } catch (err) {
      console.debug(err instanceof ClientError, 'DOaskaIII:::', JSON.stringify(err));
      if (err instanceof ClientError) {
        params.onEvent({ type: 'ERROR', error: err });
      } else if (!params.signal?.aborted) {
        // ignore user abort exception
        console.debug('DOaskaIIIIIIIII:::', JSON.stringify(err));
        params.onEvent({ type: 'ERROR', error: new ClientError((err as Error).message, ErrorCode.UNKOWN_ERROR) });
      }
    }
  }

  abstract doAskAI(params: IGenerateResponseParams): Promise<void>;
  abstract resetConvo(): void;
}
