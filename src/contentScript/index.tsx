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
  inpQ?: string;
  solutionElem: Element;
  submitElem?: Element;
}

const mount = (arg: IMountArg) => {
  const { trigger, engCfg, inpQ, solutionElem, submitElem } = arg;
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
      <App
        submitElement={submitElem!}
        inputQuestion={inpQ!.replace(/\n{3,}/g, '\n\n')}
        inputElement={solutionElem}
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
    console.debug('Re-mounting ChatGPT on a different use case');
    mount({
      trigger: tMode,
      engCfg: engCfg,
      inpQ: inputQuestion.textContent!,
      solutionElem: inputSolution,
      submitElem: buttonSubmit,
    });
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  const inputQuestion = getQuestionElement(tMode);
  const inputSolution = getSolutionElement(tMode);
  const buttonSubmit = getSubmitElement(tMode);

  if (inputQuestion && inputSolution && buttonSubmit && inputsReady(inputQuestion, inputSolution, buttonSubmit)) {
    mount({
      trigger: tMode,
      engCfg: engCfg,
      inpQ: inputQuestion.textContent!,
      solutionElem: inputSolution,
      submitElem: buttonSubmit,
    });
    console.debug(`Mounting ChatGPT on ${tMode} trigger`);

    mutationObserver.disconnect();
  }
});

mutationObserver.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

if (engCfg.watchRouteChange) engCfg.watchRouteChange(run);
