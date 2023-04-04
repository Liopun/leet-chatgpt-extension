import Browser from 'webextension-polyfill';
import { alarmHandler, alarmInit, clearAlarm, dailyReminderSetup, showStreakNotification } from '../utils/alarm';
import { loadAppLocales } from '../utils/locales';
import { executorInit } from '../utils/question-fetch';

executorInit();
alarmHandler();
alarmInit();

Browser.runtime.onMessage.addListener((message) => {
  const msg = message as { action: string; streak: number | undefined };
  switch (msg.action) {
    case 'OPEN_OPTIONS':
      Browser.tabs.create({ url: 'options.html' });
      break;
    case 'SET_REMINDER':
      dailyReminderSetup();
      break;
    case 'REMOVE_REMINDER':
      clearAlarm();
      break;
    case 'SHOW_STREAK': {
      const langBasedAppStrings = loadAppLocales();
      showStreakNotification(undefined, langBasedAppStrings.appStreakAddedSubNotification);
      break;
    }
  }
});

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    Browser.tabs.create({ url: 'options.html' });
    const langBasedAppStrings = loadAppLocales();

    Browser.notifications.create({
      type: 'basic',
      iconUrl: 'logo.png',
      title: 'LeetChatGPT',
      message: langBasedAppStrings.appInstallNotification,
    });
  }
});
