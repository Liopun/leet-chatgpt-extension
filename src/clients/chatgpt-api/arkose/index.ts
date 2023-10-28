import { fetchArkoseToken } from './server';

export async function getArkoseToken() {
  const token = await fetchArkoseToken();
  if (!token) {
    return '';
  }

  return token;
}
