export enum ErrorCode {
  CONVERSATION_LIMIT = 'CONVERSATION_LIMIT',
  UNKOWN_ERROR = 'UNKOWN_ERROR',
  CHATGPT_CLOUDFLARE = 'CHATGPT_CLOUDFLARE',
  CHATGPT_UNAUTHORIZED = 'CHATGPT_UNAUTHORIZED',
  API_KEY_NOT_SET = 'API_KEY_NOT_SET',
}

export class ClientError extends Error {
  code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}
