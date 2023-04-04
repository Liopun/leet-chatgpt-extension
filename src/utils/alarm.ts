import dayjs from 'dayjs';
import Browser from 'webextension-polyfill';
import { REMINDER_MESSAGES } from '../app/constants';
import { getUserCfg } from '../config';
import { loadAppLocales } from './locales';

export const alarmInit = () => {
  const alarmTime = dayjs();
  alarmTime.set('hour', 12);
  alarmTime.set('minute', 1);

  Browser.alarms.create('bootstrap', { when: alarmTime.valueOf(), periodInMinutes: 24 * 60 });
};

export const dailyReminderSetup = async () => {
  const cfg = await getUserCfg();
  if (cfg.userDays.length === 0 || cfg.userReminder.length === 0) return;

  const reminderParts = cfg.userReminder.split(':');

  const alarmTime = dayjs();
  alarmTime.set('hour', parseInt(reminderParts[0]));
  alarmTime.set('minute', parseInt(reminderParts[1]));

  const todayString = alarmTime.format('dddd');

  if (cfg.userDays.indexOf(todayString) === -1) return;

  const diffMs = alarmTime.diff(dayjs());

  return Browser.alarms.create(todayString, { when: Date.now() + diffMs });
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

export const clearAlarm = () => {
  (async () => {
    await Browser.alarms.clear(dayjs().format('dddd'));
  })();
};
