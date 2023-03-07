import { defaults } from 'lodash-es';
import Browser from 'webextension-polyfill';
import { AssistanceMode, Language, TriggerMode } from './interfaces';

export const TRIGGERS = {
  [TriggerMode.Problem]: {
    title: 'Problem',
    desc: 'Assistance is provided per a question',
  },
  [TriggerMode.Submission]: {
    title: 'Submission',
    desc: 'Assistance is provided after you submit your solution',
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
  triggerMode: TriggerMode.Problem,
  language: Language.Auto,
};

export type UserCfg = typeof userDefaultCfg;

const getUserCfg = async (): Promise<UserCfg> => {
  const res = await Browser.storage.local.get(Object.keys(userDefaultCfg));
  return defaults(res, userDefaultCfg);
};

const updateUserCfg = async (inp: Partial<UserCfg>) => {
  return Browser.storage.local.set(inp);
};

export { getUserCfg, updateUserCfg };
