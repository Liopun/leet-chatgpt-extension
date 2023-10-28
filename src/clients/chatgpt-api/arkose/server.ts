import { isEmpty } from 'lodash-es';

export async function fetchArkoseToken(): Promise<string | undefined> {
  try {
    const resp = await fetch('https://arkose-bypass-api.vercel.app/api/token');

    if (!resp.ok) {
      const error = (await resp.json().catch(() => ({}))) as Error;
      const errorMessage = await resp.text();
      throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${errorMessage || resp.statusText}`);
    }

    const data = (await resp.json()) as { token: string };

    return data.token;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
