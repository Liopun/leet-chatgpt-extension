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

const mount = (trigger: TriggerMode, engCfg: Engine, inpQ?: string, inpS?: string, submitElem?: Element) => {
  const container = document.createElement('div');
  container.className = 'chat-gpt-container';
  container.classList.add('gpt-dark');

  const sbContainer = document.getElementsByClassName(engCfg.sidebarContainer[0])[0];

  if (sbContainer) {
    sbContainer.prepend(container);
  } else {
    container.classList.add('sidebar-free');
    let appendContainer = getHolderElement(trigger);

    if (appendContainer) {
      appendContainer.insertBefore(container, appendContainer.firstChild);
    } else {
      appendContainer = retryHolderElement(trigger);
      container.classList.add('leetcode-cn');
      if (appendContainer) appendContainer.insertBefore(container, appendContainer.lastChild);
    }
  }

  const responseComponent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App
        submitElement={submitElem!}
        inputQuestion={inpQ!}
        inputSolution={inpS!}
        topics={getQuestionTopics(trigger)}
        triggerMode={trigger}
      />
    </ThemeProvider>
  );

  ReactDOM.render(responseComponent, container);
};

const inputsReady = (qElem?: Element, sElem?: Element, bElem?: Element): boolean => {
  if (
    qElem &&
    sElem &&
    bElem &&
    qElem.textContent &&
    qElem.textContent.length > 5 &&
    sElem.textContent &&
    sElem.textContent.length > 5 &&
    bElem.textContent
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

  if (inputQuestion && inputSolution && buttonSubmit && inputsReady(inputQuestion, inputSolution, buttonSubmit)) {
    console.debug('Re-mounting ChatGPT on a different route');
    mount(tMode, engCfg, inputQuestion.textContent!, inputSolution.textContent!, buttonSubmit);
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  const inputQuestion = getQuestionElement(tMode);
  const inputSolution = getSolutionElement(tMode);
  const buttonSubmit = getSubmitElement(tMode);

  if (inputQuestion && inputSolution && buttonSubmit && inputsReady(inputQuestion, inputSolution, buttonSubmit)) {
    mount(tMode, engCfg, inputQuestion.textContent!, inputSolution.textContent!, buttonSubmit);
    console.debug(`Mounting ChatGPT on ${tMode} trigger`);
    mutationObserver.disconnect();
  }
});

mutationObserver.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

if (engCfg.watchRouteChange) engCfg.watchRouteChange(run);
