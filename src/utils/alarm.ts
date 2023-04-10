import dayjs from 'dayjs';
import Browser from 'webextension-polyfill';
import { REMINDER_MESSAGES } from '../app/constants';
import { getUserCfg } from '../config';
import { loadAppLocales } from './locales';

export const clearAlarm = () => {
  (async () => {
    await Browser.alarms.clear(dayjs().format('dddd'));
  })();
};

export const alarmInit = () => {
  const alarmTime = new Date();
  alarmTime.setHours(12, 1);

  Browser.alarms.create('bootstrap', { when: alarmTime.getTime(), periodInMinutes: 24 * 60 });
};

export const dailyReminderSetup = async () => {
  const cfg = await getUserCfg();
  if (cfg.userDays.length === 0 || cfg.userReminder.length === 0) return;

  const reminderParts = cfg.userReminder.split(':');

  const alarmTime = new Date();
  alarmTime.setHours(parseInt(reminderParts[0]), parseInt(reminderParts[1]));

  const todayString = alarmTime.toLocaleDateString('en-US', { weekday: 'long' });

  if (cfg.userDays.indexOf(todayString) === -1) return;

  if (alarmTime.getTime() - Date.now() < 0) return;

  return Browser.alarms.create(todayString, { when: alarmTime.getTime() });
};

export const showStreakNotification = async (msg?: string, cxtMsg?: string) => {
  const langBasedAppStrings = loadAppLocales();
  const cfg = await getUserCfg();

  await Browser.notifications.create({
    type: 'basic',
    iconUrl: 'logo-notification.png',
    title: `LeetChatGPT ${langBasedAppStrings.appStreak} - ${cfg.userStats.length}`,
    message: msg || langBasedAppStrings.appStreakAddedNotification,
    contextMessage: cxtMsg || langBasedAppStrings.appStreakNotification,
  });
};

export const alarmHandler = () => {
  Browser.alarms.onAlarm.addListener(function (alarm: Browser.Alarms.Alarm) {
    (async () => {
      const { name } = alarm;
      const cfg = await getUserCfg();

      if (name === 'bootstrap') {
        clearAlarm();
        await dailyReminderSetup();
      } else if (cfg.userDays.indexOf(name) > -1) {
        await showStreakNotification(
          REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)],
          undefined
        );

        await Browser.alarms.clear(name).then((v) => {
          Browser.tabs.create({ url: 'https://leetcode.com/problemset/all/' });
        });
      }
    })();
  });
};
