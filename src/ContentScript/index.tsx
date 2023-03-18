import ReactDOM from 'react-dom';
import App from '../app';
import { EngineModes } from '../config/engine';
import { Engine } from '../interfaces';
import { generateTriggerMode, getHolderElement, getQuestionElement, getSolutionElement } from '../utils/common';

import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import theme from '../app/theme';
import { TriggerMode } from '../interfaces/client';
import './styles.scss';

const mount = (inpQ: string, inpS: string, trigger: TriggerMode, engCfg: Engine) => {
  const container = document.createElement('div');
  container.className = 'chat-gpt-container';
  container.classList.add('gpt-dark');

  const sbContainer = document.getElementsByClassName(engCfg.sidebarContainer[0])[0];

  if (sbContainer) {
    sbContainer.prepend(container);
  } else {
    container.classList.add('sidebar-free');
    const appendContainer = getHolderElement(trigger);

    if (appendContainer) {
      appendContainer.insertBefore(container, appendContainer.firstChild);
    }
  }

  const responseComponent = (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App inputQuestion={inpQ} inputSolution={inpS} triggerMode={trigger} />
    </ThemeProvider>
  );

  ReactDOM.render(responseComponent, container);
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

  if (
    inputQuestion !== undefined &&
    inputQuestion.textContent &&
    inputQuestion.textContent.length > 5 &&
    inputSolution !== undefined &&
    inputSolution.textContent &&
    inputSolution.textContent.length > 5
  ) {
    console.debug('Re-mounting ChatGPT on a different route');
    mount(inputQuestion.textContent, inputSolution.textContent, tMode, engCfg);
  }
};

const mutationObserver = new MutationObserver((mutations) => {
  const inputQuestion = getQuestionElement(tMode);
  const inputSolution = getSolutionElement(tMode);

  if (
    inputQuestion !== undefined &&
    inputQuestion.textContent &&
    inputQuestion.textContent.length > 5 &&
    inputSolution !== undefined &&
    inputSolution.textContent &&
    inputSolution.textContent.length > 5
  ) {
    mount(inputQuestion.textContent, inputSolution.textContent, tMode, engCfg);
    console.debug(`Mounting ChatGPT on ${tMode} trigger`);
    mutationObserver.disconnect();
  }
});

mutationObserver.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });

if (engCfg.watchRouteChange) engCfg.watchRouteChange(run);
