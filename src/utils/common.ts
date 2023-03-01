import Browser from 'webextension-polyfill';
import { ASSISTANCE } from '../config';
import { EngineModes } from '../engine';
import { IPetition, TriggerMode } from '../interfaces';

const PREFIX_PETITION =
  'Can you please emphasize that you will act as my helper or teacher and provide me with advice only,' +
  ' and not complete solutions. Your mission is to guide me into the right direction for solving the problem I am currently stuck on, ' +
  'using my current solution code as a starting point. After receiving your advice,' +
  ' I should be able to understand the important concepts needed to solve this problem completely. Additionally, ' +
  'could you please provide me with any important points I should remember in oreder not to get stuck on this problem in the future: \n';
const PETITION_QUESTION = '\n\nHere is the question I am stuck on: \n';
const PETITION_SOLUTION = '\n\nHere is my current incomplete solution: \n';
const M_B_PETITION_SOLUTION = '\n\nHere is my current incomplete solution towards a bruteforce solution: \n';
const M_O_PETITION_SOLUTION = '\n\nHere is my current incomplete solution towards an optimal solution: \n';

const customNavigator: Navigator & { brave?: { isBrave: () => Promise<void> } } = navigator;

export const isBraveBrowser = () =>
  typeof customNavigator.brave !== 'undefined' && typeof customNavigator.brave.isBrave() !== 'undefined';

export const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAppVersion = () => Browser.runtime.getManifest().version;

export const addPetition = (opts: IPetition): string => {
  const { question, solution, mode } = opts;

  if (mode) {
    if (mode === ASSISTANCE.manual.types[0]) {
      // bruteforce
      return PREFIX_PETITION + PETITION_QUESTION + question + M_B_PETITION_SOLUTION + solution;
    }

    if (mode === ASSISTANCE.manual.types[1]) {
      // optmize
      return PREFIX_PETITION + PETITION_QUESTION + question + M_O_PETITION_SOLUTION + solution;
    }
  }

  return PREFIX_PETITION + PETITION_QUESTION + question + PETITION_SOLUTION + solution;
};

export function querySelectElement<T extends Element>(possibleItems: string[]): T | undefined {
  possibleItems.forEach((val) => {
    const item = document.querySelector(val);
    if (item) return item as T;
  });

  return;
}

export const generateTriggerMode = () => {
  const submissionRegex = new RegExp(Object.keys(EngineModes).join('.*'));

  return submissionRegex.test(location.hostname) ? TriggerMode.Submission : TriggerMode.Problem;
};

export const getQuestionElement = () => {
  const qElem = document.getElementById('__next');
  const qChild = qElem?.getElementsByClassName('_1l1MA')[0];

  return qChild;
};

export const getSolutionElement = () => {
  const sElem = document.getElementById('qd-content');
  const sChild = sElem?.getElementsByClassName('view-lines')[0];

  return sChild;
};

export const secondsInStorage = async () => {
  const item = await Browser.storage.local.get('seconds');

  return item.seconds as number;
};
