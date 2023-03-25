import Browser from 'webextension-polyfill';
import { EngineModes } from '../config/engine';
import { IAppStrings, IPetition, TriggerMode } from '../interfaces';

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
const PETITION_TOPIC_QUERY =
  'In 100 words, can you simply and meticulously explain the following data structure & algorithm pattern/technique ' +
  'and give important points on how to detect questions that can be solved using this pattern/technique. The pattern/technique is ';
const PETITION_TOPIC_QUERY_EOL = '\\n remember to only use 100 words';

const customNavigator: Navigator & { brave?: { isBrave: () => Promise<void> } } = navigator;

export const isBraveBrowser = () =>
  typeof customNavigator.brave !== 'undefined' && typeof customNavigator.brave.isBrave() !== 'undefined';

export const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false;

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAppVersion = () => Browser.runtime.getManifest().version;

export const loadAppLocales = (): IAppStrings => {
  const appStrings: IAppStrings = {
    appTimerMode: Browser.i18n.getMessage('appTimerMode'),
    appTimerTip: Browser.i18n.getMessage('appTimerTip'),
    appTimerDesc: Browser.i18n.getMessage('appTimerDesc'),
    appManualMode: Browser.i18n.getMessage('appManualMode'),
    appBruteforce: Browser.i18n.getMessage('appBruteforce'),
    appOptimize: Browser.i18n.getMessage('appOptimize'),
    appLetsChat: Browser.i18n.getMessage('appLetsChat'),
    appSend: Browser.i18n.getMessage('appSend'),
    appStop: Browser.i18n.getMessage('appStop'),
    appShuffle: Browser.i18n.getMessage('appShuffle'),
    appChatGpt: Browser.i18n.getMessage('appChatGpt'),
    appChatGptTitle: Browser.i18n.getMessage('appChatGptTitle'),
    appChatGptDesc: Browser.i18n.getMessage('appChatGptDesc'),
    appChatGptPlusDesc: Browser.i18n.getMessage('appChatGptPlusDesc'),
    appChatGptPlusFooter: Browser.i18n.getMessage('appChatGptPlusFooter'),
    appChatGptPlusSave: Browser.i18n.getMessage('appChatGptPlusSave'),
    appManualTip: Browser.i18n.getMessage('appManualTip'),
    appChatGptPlusLearnMore: Browser.i18n.getMessage('appChatGptPlusLearnMore'),
  };

  return appStrings;
};

export const addPetition = (opts: IPetition): string => {
  const { question, solution, mode } = opts;
  const langBasedAppStrings = loadAppLocales();

  if (mode) {
    if (mode === langBasedAppStrings.appBruteforce) {
      // bruteforce
      return PREFIX_PETITION + PETITION_QUESTION + question + M_B_PETITION_SOLUTION + solution;
    }

    if (mode === langBasedAppStrings.appOptimize) {
      // optmize
      return PREFIX_PETITION + PETITION_QUESTION + question + M_O_PETITION_SOLUTION + solution;
    }
  }

  return PREFIX_PETITION + PETITION_QUESTION + question + PETITION_SOLUTION + solution;
};

export const formatTopicQuery = (topic: string): string => PETITION_TOPIC_QUERY + topic + PETITION_TOPIC_QUERY_EOL;

export function querySelectElement<T extends Element>(possibleItems: string[]): T | undefined {
  possibleItems.forEach((val) => {
    const item = document.querySelector(val);
    if (item) return item as T;
  });

  return;
}

export const generateTriggerMode = () => {
  for (const val of Object.keys(EngineModes)) {
    const currRegex = new RegExp(`${EngineModes[val].host}.*${val}`);
    if (currRegex.test(location.href)) return val as TriggerMode;
  }

  return null;
};

export const getQuestionElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  const qElem = document.getElementById(cfg.input_question[0]);
  let qChild = qElem?.getElementsByClassName(cfg.input_question[1])[0];

  if (!qElem || !qChild) {
    const qParent = document.getElementById(cfg.input_question[2]);
    const q = qParent?.getElementsByClassName(cfg.input_question[3])[0];
    qChild = q?.getElementsByClassName(cfg.input_question[4])[0];
  }

  return qChild;
};

export const getSolutionElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  let sElem = document.getElementById(cfg.input_code[0]);
  let sChild = sElem?.getElementsByClassName(cfg.input_code[1])[0];
  if (!sElem || !sChild) {
    sElem = document.getElementById(cfg.input_code[2]);
    sChild = sElem?.getElementsByClassName(cfg.input_code[3])[0];
  }

  return sChild;
};

export const getHolderElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  const sElem = document.getElementById(cfg.input_code[0]);
  let sChild;

  if (tMode === TriggerMode.Problem) {
    sChild =
      sElem?.getElementsByClassName(cfg.appendContainerRight[0])[1] ||
      sElem?.getElementsByClassName(cfg.appendContainerLeft[0])[1];
  } else if (tMode === TriggerMode.Challenge) {
    sChild =
      sElem?.getElementsByClassName(cfg.appendContainerRight[0])[0] ||
      sElem?.getElementsByClassName(cfg.appendContainerLeft[0])[0];
  }

  return sChild;
};

export const retryHolderElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  const sElem = document.getElementById(cfg.input_code[2]);
  const sChild =
    sElem?.getElementsByClassName(cfg.appendContainerRight[1])[0] ||
    sElem?.getElementsByClassName(cfg.appendContainerLeft[1])[0];

  return sChild;
};
