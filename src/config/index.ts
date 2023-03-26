import { defaults } from 'lodash-es';
import Browser from 'webextension-polyfill';
import { CHATGPT_API_MODELS } from '../app/constants';
import { ClientType } from '../interfaces';

const userDefaultCfg = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  openaiApiModel: CHATGPT_API_MODELS[0],
  clientMode: ClientType.ChatGPT,
  chatgptApiTemperature: 0.6,
  language: Browser.i18n.getUILanguage(),
};

export type UserCfg = typeof userDefaultCfg;

const getUserCfg = async (): Promise<UserCfg> => {
  const res = await Browser.storage.local.get(Object.keys(userDefaultCfg));
  return defaults(res, userDefaultCfg);
};

const updateUserCfg = async (inp: Partial<UserCfg>) => {
  await Browser.storage.local.set(defaults(inp, userDefaultCfg));
};

const invalidateUserCfgToken = async (key: string) => {
  await Browser.storage.local.remove(key);
};

export { getUserCfg, updateUserCfg, invalidateUserCfgToken };
