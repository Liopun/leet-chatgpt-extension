import { createParser } from 'eventsource-parser';
import { isEmpty } from 'lodash-es';
import { streamAsyncIterable } from './stream-async-iterable.js';

export async function parseSSE(response: Response, onMessage: (message: string) => void) {
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as Error;
    throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${response.status} ${response.statusText}`);
  }

  const parser = createParser((event) => {
    if (event.type === 'event') onMessage(event.data);
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  for await (const chunk of streamAsyncIterable(response.body!)) {
    const str = new TextDecoder().decode(chunk as BufferSource | undefined);
    parser.feed(str);
  }
}
