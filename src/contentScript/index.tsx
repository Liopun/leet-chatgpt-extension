import ReactDOM from 'react-dom';
import App from '../app';
import { EngineModes } from '../config/engine';
import { Engine } from '../interfaces';
import {
  generateTriggerMode,
  getHolderElement,
  getQuestionElement,
  getQuestionTopics,
  getSolutionElement,
  getSubmitElement,
  retryHolderElement,
} from '../utils/common';

import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from '../app/theme';
import { TriggerMode } from '../interfaces/client';
import './styles.scss';

interface IMountArg {
  trigger: TriggerMode;
  engCfg: Engine;
  solutionElem: Element;
  submitElem?: Element;
  topics: string[];
}

const mount = (arg: IMountArg) => {
  const { trigger, engCfg, solutionElem, submitElem, topics } = arg;
  let container = document.getElementsByClassName('chat-gpt-container')[0];
  if (!container) {
    container = document.createElement('div');
    container.className = 'chat-gpt-container';
    container.classList.add('gpt-dark');

    const sbContainer = document.getElementsByClassName(engCfg.sidebarContainer[0])[0];

    if (sbContainer) {
      sbContainer.prepend(container);
    } else {
      container.classList.add('sidebar-free');
      let appendContainer = getHolderElement(trigger);

      if (appendContainer) {
        appendContainer.insertAdjacentElement('beforebegin', container);
      } else {
        appendContainer = retryHolderElement(trigger);
        container.classList.add('leetcode-cn');
        if (appendContainer) appendContainer.insertBefore(container, appendContainer.lastChild);
      }
    }
  }

  const responseComponent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App submitElement={submitElem!} inputElement={solutionElem} topics={topics} triggerMode={trigger} />
    </ThemeProvider>
  );

  ReactDOM.render(responseComponent, container);
};

const inputsReady = (topics: string[], qElem?: Element, sElem?: Element, bElem?: Element): boolean => {
  if (
    qElem &&
    sElem &&
    bElem &&
    qElem.textContent &&
    qElem.textContent.length > 5 &&
    sElem.textContent &&
    sElem.textContent.length > 5 &&
    bElem.textContent &&
    topics.length > 0
  )
    return true;

  return false;
};

const tMode = generateTriggerMode();
if (!tMode) {
  throw new Error(`err:TriggerMode could not be generated`);
}

console.debug(`MODE ACTIVATION::: ${tMode}`);
const engCfg = EngineModes[tMode];

const run = () => {
  const inputQuestion = getQuestionElement(tMode);
  const inputSolution = getSolutionElement(tMode);
  const buttonSubmit = getSubmitElement(tMode);
  const inputTopics = getQuestionTopics(tMode);

  if (
    inputQuestion &&
    inputSolution &&
    buttonSubmit &&
    inputsReady(inputTopics, inputQuestion, inputSolution, buttonSubmit)
  ) {
    console.debug('Re-mounting ChatGPT on a different use case');
    mount({
      trigger: tMode,
      engCfg: engCfg,
      solutionElem: inputSolution,
      submitElem: buttonSubmit,
      topics: inputTopics,
    });
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  const inputQuestion = getQuestionElement(tMode);
  const inputSolution = getSolutionElement(tMode);
  const buttonSubmit = getSubmitElement(tMode);
  const inputTopics = getQuestionTopics(tMode);

  if (
    inputQuestion &&
    inputSolution &&
    buttonSubmit &&
    inputsReady(inputTopics, inputQuestion, inputSolution, buttonSubmit)
  ) {
    mount({
      trigger: tMode,
      engCfg: engCfg,
      solutionElem: inputSolution,
      submitElem: buttonSubmit,
      topics: inputTopics,
    });
    console.debug(`Mounting ChatGPT on ${tMode} trigger`);

    mutationObserver.disconnect();
  }
});

mutationObserver.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

if (engCfg.watchRouteChange) engCfg.watchRouteChange(run);
