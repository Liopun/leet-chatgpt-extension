import { ClientId } from '../clients';
import { ClientError } from '../utils/errors';

export interface ChatMessageObj {
  id: string;
  author: ClientId | 'user';
  text: string;
  error?: ClientError;
  timestamp: number;
}

export interface IUserChats {
  [key: string]: ChatMessageObj[];
}

export interface ConversationModel {
  messages: ChatMessageObj[];
}
