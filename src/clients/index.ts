import { ChatGPTClient } from './chatgpt';

export type ClientId = 'chatgpt'; // TODO: bing and bart support

export const clientClasses: Record<ClientId, typeof ChatGPTClient> = {
  chatgpt: ChatGPTClient,
};
