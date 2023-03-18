import { ClientId } from '../clients';
import { ClientError } from '../utils/errors';

export interface ChatMessageObj {
  id: string;
  author: ClientId | 'user';
  text: string;
  error?: ClientError;
}

export interface ConversationModel {
  messages: ChatMessageObj[];
}
