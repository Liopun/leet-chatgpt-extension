import Browser from 'webextension-polyfill';
import { executorInit } from '../utils/question-fetch';

executorInit();

Browser.runtime.onMessage.addListener((message) => {
  if ((message as { action: string }).action === 'OPEN_OPTIONS') {
    Browser.tabs.create({ url: 'options.html' });
  }
});

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') Browser.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
});
