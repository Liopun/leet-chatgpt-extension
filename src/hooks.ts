import useSWR from 'swr';
import Browser from 'webextension-polyfill';
import { IQueryEvent } from './interfaces';

export const useUserAuth = () => {
  const { data, error, isLoading } = useSWR<string, Error>(
    'accessToken',
    () => Browser.runtime.sendMessage({ event: 'GET_ACCESS_TOKEN' } as IQueryEvent),
    { shouldRetryOnError: false }
  );

  // console.debug("useHook", data, error, isLoading)
  const customErr = error && (error.message === 'UNAUTHORIZED' || error.message === 'CLOUDFLARE') ? 'AUTH_ERROR' : '';

  return {
    token: data,
    isLoading,
    authErr: customErr,
  };
};
