import { RequestParams } from '../../interfaces/request';
import { questionFetch } from '../../utils/question-fetch';

export interface IRequest {
  fetch(url: string, options?: RequestParams): Promise<Response>;
}

class BasicRequest implements IRequest {
  fetch(url: string, options?: RequestParams) {
    return fetch(url, options);
  }
}

class QuestionRequest implements IRequest {
  async fetch(url: string, options?: RequestParams) {
    return questionFetch(url, options);
  }
}

export const basicRequest = new BasicRequest();
export const questionRequest = new QuestionRequest();
