import Browser from 'webextension-polyfill';
import { getUserCfg, updateUserCfg } from '../config';
import { IUserStats } from '../interfaces';

export const addStreak = async (topics: string[]) => {
  const cfg = await getUserCfg();
  const stats = cfg.userStats;
  const reminderParts = cfg.userReminder.split(':');

  const sDate = new Date();
  sDate.setHours(parseInt(reminderParts[0]), parseInt(reminderParts[1]));
  const beforeMidnight = new Date();
  beforeMidnight.setHours(23, 59, 59, 0);

  const len = stats.length;

  if (len > 0) {
    const diff = Math.abs(new Date(stats[len - 1].startDate).getTime() - sDate.getTime());
    const roundedDiff = Math.round(diff / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    const newStats = stats.slice(); // shallow copy

    if (roundedDiff === 0) {
      // today's streak already started

      let desc = newStats[len - 1].description;
      if (!desc.includes(location.href)) {
        desc += ` ${location.href}`;
      }

      let title = newStats[len - 1].title;

      topics.forEach((v, i) => {
        if (!title.includes(v)) {
          const newAppend = i === topics.length - 1 ? `${v}; | ` : `${v}; `;
          title += newAppend;
        }
      });

      newStats[len - 1].description = desc;
      newStats[len - 1].title = title;

      await updateUserCfg({
        userStats: newStats,
      });

      return;
    }
  }

  await updateUserCfg({
    userStats: [
      ...stats,
      {
        id: stats.length,
        title: `${topics.join('; ')}; | `,
        startDate: sDate.toISOString(),
        endDate: beforeMidnight.toISOString(),
        description: location.href,
        resourcesId: 1,
      } as IUserStats,
    ],
  });

  await Browser.runtime.sendMessage({ action: 'SHOW_STREAK' });

  return;
};
