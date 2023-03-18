import { defaults } from 'lodash-es';
import Browser from 'webextension-polyfill';
import { AssistanceMode, Language, TriggerMode } from '../interfaces';

export const TRIGGERS = {
  [TriggerMode.Problem]: {
    title: 'Problem',
    desc: 'Assistance is provided per leetcode questions',
  },
  [TriggerMode.Challenge]: {
    title: 'Submission',
    desc: 'Assistance is provided for hacker-rank questions',
  },
};

export const ASSISTANCE = {
  [AssistanceMode.Timer]: {
    title: 'Timer',
    desc: 'Get feedback and help for your current solution when the timer runs out.',
  },
  [AssistanceMode.Manual]: {
    title: 'Manual',
    desc: 'Get feedback for your current solution towards a brute-force or optimal solution on demand.',
    types: ['bruteforce', 'optimize'],
  },
};

export const ASSISTANCE_TEXT = {
  [AssistanceMode.Timer]: 'Timer',
  [AssistanceMode.Manual]: 'Manual',
};

const userDefaultCfg = {
  openaiApiKey: '',
  openaiApiHost: 'https://api.openai.com',
  chatgptApiTemperature: 0.6,
  triggerMode: TriggerMode.Problem,
  language: Language.Auto,
};

export type UserCfg = typeof userDefaultCfg;

const getUserCfg = async (): Promise<UserCfg> => {
  const res = await Browser.storage.sync.get(Object.keys(userDefaultCfg));
  return defaults(res, userDefaultCfg);
};

const updateUserCfg = async (inp: Partial<UserCfg>) => {
  // return Browser.storage.local.set(inp);
  for (const [k, v] of Object.entries(inp)) {
    if (v !== undefined) await Browser.storage.sync.set({ k, v });
  }
};

const invalidateUserCfgToken = async (key: string) => {
  await Browser.storage.sync.remove(key);
};

export { getUserCfg, updateUserCfg, invalidateUserCfgToken };
