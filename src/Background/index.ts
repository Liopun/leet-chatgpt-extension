import Browser from 'webextension-polyfill';
import { ChatGPTClient, GetAuthAccessToken, OpenAIClient } from '../clients';
import { ClientType, IClient, IQueryEvent, IQueryEventRec } from '../interfaces';
import { getClientCfgs } from './client';

async function askAI(port: Browser.Runtime.Port, question: string) {
  const clientCfgs = await getClientCfgs();
  let client: IClient;

  switch (clientCfgs.client) {
    case ClientType.ChatGPT: {
      const token = await GetAuthAccessToken();
      client = new ChatGPTClient(token);
      break;
    }

    case ClientType.GPT3: {
      const { apiKey, model } = clientCfgs.configs[ClientType.GPT3]!;
      client = new OpenAIClient(apiKey, model);
      break;
    }

    default:
      throw new Error(`Invalid client ${clientCfgs.client as string}`);
  }

  const ctl = new AbortController();

  const { cleanUp } = await client.askAI({
    prompt: question,
    signal: ctl.signal,
    onEvent(e) {
      switch (e.type) {
        case 'done':
          port.postMessage({ event: 'DONE', value: '' } as IQueryEvent);
          break;
        case 'answer':
          port.postMessage({ event: 'RESPONSE_OUTPUT', data: e.data } as IQueryEventRec);
          break;
        case 'error': {
          const err = JSON.parse(e.error.message) as { error: Error };
          port.postMessage({
            event: 'ERROR',
            data: {
              text: err.error.message,
              messageId: '',
              conversationId: '',
            },
          } as IQueryEventRec);
          break;
        }
      }
    },
  });

  port.onDisconnect.addListener(() => {
    ctl.abort();
    cleanUp?.();
  });
}

Browser.runtime.onConnect.addListener((port) => {
  console.assert(port.name === 'leet-gpt-main', 'LISTENER PORT');
  port.onMessage.addListener((msg) => {
    console.debug('incoming msg', msg);
    const { value } = msg as IQueryEvent;

    try {
      (async () => {
        await askAI(port, value);
      })();
    } catch (e: unknown) {
      const error = e as Error;
      const err: IQueryEventRec = {
        event: 'ERROR',
        data: {
          text: error.message,
          messageId: '',
          conversationId: '',
        },
      };
      port.postMessage(err);
    }
  });
});

Browser.runtime.onMessage.addListener(async (msg) => {
  const { event } = msg as IQueryEvent;
  console.debug(event);
  switch (event) {
    // case "FEEDBACK":
    //     const token = await GetAuthAccessToken()
    //     await SubmitMessageFeedback(token, data)
    //     break;
    case 'OPEN_OPTIONS_PAGE':
      Browser.tabs.create({ url: 'options.html' });
      break;
    case 'GET_ACCESS_TOKEN':
      return GetAuthAccessToken();
  }
});

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') Browser.runtime.openOptionsPage();
});
