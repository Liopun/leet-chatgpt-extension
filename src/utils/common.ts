import Browser from 'webextension-polyfill';
import { REMINDER_MESSAGES } from '../app/constants';
import { EngineModes } from '../config/engine';
import { IPetition, TriggerMode } from '../interfaces';
import { loadAppLocales } from './locales';

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

export const getReminderMessage = () => REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];

export const formatTopicQuery = (topic: string): string => PETITION_TOPIC_QUERY + topic + PETITION_TOPIC_QUERY_EOL;

export function querySelectElement<T extends Element>(possibleItems: string[]): T | undefined {
  possibleItems.forEach((val) => {
    const item = document.querySelector(val);
    if (item) return item as T;
  });

  return;
}

export const generateTriggerMode = (url?: string) => {
  for (const val of Object.keys(EngineModes)) {
    const currRegex = new RegExp(`${EngineModes[val].host}.*${val}`);
    if (currRegex.test(url || location.href)) return val as TriggerMode;
  }

  return null;
};

export const isElementVisible = (el: Element | null): boolean => {
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  // Check if the element is fully visible or partially visible in the viewport
  const isVisible = rect.top >= 0 && rect.bottom <= windowHeight;

  return isVisible;
};

export const isDynamicLayout = (): boolean => {
  const itemKey = 'used-dynamic-layout'; // Replace 'key' with the key of the item you want to retrieve
  const storedItemStr: string | null = localStorage.getItem(itemKey);

  if (!storedItemStr) return false;

  return JSON.parse(storedItemStr) as boolean;
};

export const getSubmitElement = (tMode: TriggerMode) => {
  let qChild: Element | undefined;
  const cfg = EngineModes[tMode];
  const qElem = document.getElementById(cfg.submit_button[0]);
  qChild =
    document.querySelectorAll(`[data-e2e-locator="${cfg.submit_button[1]}"]`)[0] ||
    qElem?.getElementsByClassName(cfg.submit_button[1])[0];

  if (tMode === TriggerMode.Problem && (!qElem || !qChild)) {
    const qParent = document.getElementById(cfg.submit_button[2]);
    qChild =
      qParent?.getElementsByClassName(cfg.submit_button[3])[0] ||
      qParent?.getElementsByClassName(cfg.submit_button[4])[0];
  }

  return qChild;
};

export const getQuestionElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  const qElem = document.getElementById(cfg.input_question[0]);
  let qChild = qElem?.getElementsByClassName(cfg.input_question[1])[0];
  // if (tMode === TriggerMode.Problem && (!qElem || !qChild)) {
  //   const qParent = document.getElementById(cfg.input_question[2]);
  //   const q = qParent?.getElementsByClassName(cfg.input_question[3])[0];
  //   qChild = q?.getElementsByClassName(cfg.input_question[4])[0];
  //   console.debug("IDS:::", cfg.input_question[2], cfg.input_question[3], cfg.input_question[4])
  // }

  if (qChild === undefined) {
    // try dynamic layout setup
    // const qElem = document.getElementById(cfg.input_question_alt[0]);
    // const qDescription = document.getElementById(cfg.input_question_alt[1]);
    qChild = document.querySelectorAll(cfg.input_question_alt[2])[0];
  }

  return qChild;
};

export const getQuestionTopics = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];

  const qElem = document.getElementById(cfg.input_topics[0]);
  const qChild = qElem?.getElementsByClassName(cfg.input_topics[1])[0];
  const qPX = qChild?.getElementsByClassName('px-5');
  let topicAnchors: NodeListOf<HTMLAnchorElement> | undefined;

  if (tMode === TriggerMode.Problem && qPX !== undefined) {
    const topicCol = qPX[qPX.length - 2];
    topicAnchors = topicCol?.querySelectorAll('a') || [];

    const topics: string[] = [];
    topicAnchors.forEach((v) => {
      topics.push(v.innerText);
    });

    return topics;
  } else {
    const regex = new RegExp(`\\/${tMode}\\/(\\w+)\\/`);
    const match = regex.exec(location.href);

    if (match) return [match[0]];
  }

  return [];
};

export const getSolutionElement = (tMode: TriggerMode) => {
  const cfg = EngineModes[tMode];
  let sElem = document.getElementById(cfg.input_code[0]);
  let sChild = sElem?.getElementsByClassName(cfg.input_code[1])[0];
  if (tMode === TriggerMode.Problem && (!sElem || !sChild)) {
    sElem = document.getElementById(cfg.input_code[2]);
    sChild = sElem?.getElementsByClassName(cfg.input_code[3])[0];
  }

  if (sChild === undefined) {
    // try dynamic layout setup
    sChild = document.querySelectorAll(cfg.input_code_alt[2])[0];
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
      sElem?.getElementsByClassName(cfg.appendContainerLeft[0])[1] ||
      document.getElementById(cfg.appendContainerDL[0]);
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

export const prettifyQuestion = (question: string) => question.replace(/\n{3,}/g, '\n\n');

export const getQuestionText = (tMode: TriggerMode) => {
  const qChild = getQuestionElement(tMode);
  if (qChild) return prettifyQuestion(qChild.textContent!);

  return '';
};

export const addPetition = (opts: IPetition): string => {
  const { solution, mode, triggerMode } = opts;
  const question = getQuestionText(triggerMode);
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
