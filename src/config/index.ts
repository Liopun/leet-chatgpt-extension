import dayjs from 'dayjs';
import { defaults } from 'lodash-es';
import Browser from 'webextension-polyfill';
import { CHATGPT_API_MODELS } from '../app/constants';
import { ClientType, IUserStats } from '../interfaces';

const userDefaultCfg = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  openaiApiModel: CHATGPT_API_MODELS[0],
  clientMode: ClientType.ChatGPT,
  chatgptApiTemperature: 0.6,
  userReminder: dayjs().format('HH:mm'),
  userDays: [] as string[],
  userStats: [] as IUserStats[],
  userWeeklyTip: '',
  language: Browser.i18n.getUILanguage(),
};

export type UserCfg = typeof userDefaultCfg;

const getUserCfg = async (): Promise<UserCfg> => {
  const res = await Browser.storage.local.get(Object.keys(userDefaultCfg));
  return defaults(res, userDefaultCfg);
};

const updateUserCfg = async (inp: Partial<UserCfg>) => {
  const cfg = await getUserCfg();
  await Browser.storage.local.set({ ...cfg, ...inp });
};

const invalidateUserCfgToken = async (key: string) => {
  await Browser.storage.local.remove(key);
};

export { getUserCfg, updateUserCfg, invalidateUserCfgToken };
