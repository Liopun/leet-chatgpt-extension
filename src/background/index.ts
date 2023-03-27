import Browser from 'webextension-polyfill';
import { executorInit } from '../utils/question-fetch';

executorInit();

Browser.runtime.onMessage.addListener((message) => {
  const msg = message as { action: string };
  if (msg.action === 'OPEN_OPTIONS') {
    Browser.tabs.create({ url: 'options.html' });
  }
});

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.tabs.create({ url: 'options.html' });

    Browser.notifications.create({
      type: 'basic',
      iconUrl: 'logo.png',
      title: 'LeetChatGPT',
      message: 'For more stable connection with ChatGPT, keep chat.openai.com tab open',
    });
  }
});
