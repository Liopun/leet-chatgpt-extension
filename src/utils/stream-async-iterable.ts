export async function* streamAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const res = await reader.read();
      if (res.done) return;

      yield res.value;
    }
  } finally {
    reader.releaseLock();
  }
}
