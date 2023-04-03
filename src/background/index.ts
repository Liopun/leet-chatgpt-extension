import Browser from 'webextension-polyfill';
import { alarmHandler, alarmInit, clearAlarm, dailyReminderSetup } from '../utils/alarm';
import { executorInit } from '../utils/question-fetch';

executorInit();
alarmHandler();
alarmInit();

Browser.runtime.onMessage.addListener((message) => {
  const msg = message as { action: string; streak: number | undefined };
  if (msg.action === 'OPEN_OPTIONS') {
    Browser.tabs.create({ url: 'options.html' });
  } else if (msg.action === 'SET_REMINDER') {
    dailyReminderSetup();
  } else if (msg.action === 'REMOVE_REMINDER') {
    clearAlarm();
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
