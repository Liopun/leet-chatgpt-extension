import Browser from 'webextension-polyfill';
import {
  RequestParams,
  RequestParamsMessage,
  RequestResponseBodyChunkMessage,
  RequestResponseMetadataMessage,
} from '../interfaces/request';
import { streamAsyncIterable } from './stream-async-iterable';

export const executorInit = () => {
  Browser.runtime.onConnect.addListener((port) => {
    const abortCtlr = new AbortController();
    port.onDisconnect.addListener(() => {
      abortCtlr.abort();
    });
    port.onMessage.addListener((message: RequestParamsMessage) => {
      (async () => {
        console.debug('fetch executor', message.url, message.options);
        const resp = await fetch(message.url, {
          ...message.options,
          signal: abortCtlr.signal,
        });
        port.postMessage({
          type: 'RESPONSE_METADATA',
          metadata: {
            status: resp.status,
            statusText: resp.statusText,
            headers: Object.fromEntries(resp.headers.entries()),
          },
        } as RequestResponseMetadataMessage);
        for await (const chunk of streamAsyncIterable(resp.body!)) {
          port.postMessage({
            type: 'RESPONSE_BODY_CHUNK',
            value: new TextDecoder().decode(chunk as BufferSource | undefined),
            done: false,
          } as RequestResponseBodyChunkMessage);
        }
        port.postMessage({ type: 'RESPONSE_BODY_CHUNK', done: true } as RequestResponseBodyChunkMessage);
      })().catch((err) => {
        console.error(err);
      });
    });
  });
};
export const questionFetch = (url: string, options?: RequestParams): Promise<Response> => {
  return new Promise((resolve) => {
    const port = Browser.runtime.connect({ name: 'leet-chatgpt-main' });

    port.onDisconnect.addListener(() => {
      throw new DOMException('question fetch aborted', 'QAbortError');
    });

    options?.signal?.addEventListener('abort', () => port.disconnect());

    const body = new ReadableStream({
      start(controller) {
        port.onMessage.addListener(function onMessage(
          message: RequestResponseMetadataMessage | RequestResponseBodyChunkMessage
        ) {
          if (message.type === 'RESPONSE_METADATA') {
            const response = new Response(body, message.metadata);
            resolve(response);
          } else if (message.type === 'RESPONSE_BODY_CHUNK') {
            if (message.done) {
              controller.close();
              port.onMessage.removeListener(onMessage);
              port.disconnect();
            } else {
              const chunk = new TextEncoder().encode(message.value);
              controller.enqueue(chunk);
            }
          }
        });
        port.postMessage({ url, options } as RequestParams);
      },
      cancel(_reason: string) {
        port.disconnect();
      },
    });
  });
};
