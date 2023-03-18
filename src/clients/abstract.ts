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
      if (err instanceof ClientError) {
        params.onEvent({ type: 'ERROR', error: err });
      } else if (!params.signal?.aborted) {
        // ignore user abort exception
        const parsedError = JSON.parse((err as Error).message) as { error: { message: string; code: string } };
        const code =
          parsedError.error.code.toUpperCase() === ErrorCode.INVALID_API_KEY
            ? ErrorCode.INVALID_API_KEY
            : ErrorCode.UNKOWN_ERROR;
        params.onEvent({
          type: 'ERROR',
          error: new ClientError(parsedError.error.message || (err as Error).message, code),
        });
      }
    }
  }

  abstract doAskAI(params: IGenerateResponseParams): Promise<void>;
  abstract resetConvo(): void;
}
