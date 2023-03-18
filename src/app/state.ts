import { atomWithImmer } from 'jotai-immer';
import { atomFamily } from 'jotai/utils';
import { clientClasses, ClientId } from '../clients';
import { ChatMessageObj } from '../interfaces/chat';

type Param = { clientId: ClientId };

export const chatThread = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      clientId: param.clientId,
      client: new clientClasses[param.clientId](),
      messages: [] as ChatMessageObj[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
    });
  },
  (a, b) => a.clientId === b.clientId
);
