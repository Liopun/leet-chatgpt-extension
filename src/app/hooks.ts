import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { ClientId } from '../clients';
import { ChatMessageObj } from '../interfaces/chat';
import { chatThread } from './state';

export function useChat(clientId: ClientId) {
  const chatAtom = useMemo(() => chatThread({ clientId }), [clientId]);
  const [chatState, setChatState] = useAtom(chatAtom);

  const updateMessage = useCallback(
    (messageId: string, updater: (message: ChatMessageObj) => void) => {
      setChatState((draft) => {
        const message = draft.messages.find((m) => m.id === messageId);
        if (message) {
          updater(message);
        }
      });
    },
    [setChatState]
  );

  const sendMessage = useCallback(
    async (input: string) => {
      const botMessageId = uuid();
      setChatState((draft) => {
        draft.messages.push(
          { id: uuid(), text: input.replaceAll('\n', '\n\n'), author: 'user' },
          { id: botMessageId, text: '', author: clientId }
        );
      });
      const abortController = new AbortController();
      setChatState((draft) => {
        draft.generatingMessageId = botMessageId;
        draft.abortController = abortController;
      });
      await chatState.client.askAI({
        prompt: input,
        signal: abortController.signal,
        onEvent(event) {
          if (event.type === 'ANSWER') {
            updateMessage(botMessageId, (message) => {
              message.text = event.data.text;
            });
          } else if (event.type === 'ERROR') {
            console.error('sendMessage error', event.error.code, event.error);
            updateMessage(botMessageId, (message) => {
              message.error = event.error;
            });
            setChatState((draft) => {
              draft.abortController = undefined;
              draft.generatingMessageId = '';
            });
          } else if (event.type === 'DONE') {
            setChatState((draft) => {
              draft.abortController = undefined;
              draft.generatingMessageId = '';
            });
          }
        },
      });
    },
    [clientId, chatState.client, setChatState, updateMessage]
  );

  const resetConversation = useCallback(() => {
    chatState.client.resetConvo();
    setChatState((draft) => {
      draft.abortController = undefined;
      draft.generatingMessageId = '';
      draft.messages = [];
    });
  }, [chatState.client, setChatState]);

  const stopGenerating = useCallback(() => {
    chatState.abortController?.abort();
    if (chatState.generatingMessageId) {
      updateMessage(chatState.generatingMessageId, (message) => {
        if (!message.text && !message.error) {
          message.text = 'Cancelled';
        }
      });
    }
    setChatState((draft) => {
      draft.generatingMessageId = '';
    });
  }, [chatState.abortController, chatState.generatingMessageId, setChatState, updateMessage]);

  return {
    messages: chatState.messages,
    sendMessage,
    resetConversation,
    generating: !!chatState.generatingMessageId,
    stopGenerating,
  };
}
