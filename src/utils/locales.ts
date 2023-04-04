import Browser from 'webextension-polyfill';
import { IAppStrings } from '../interfaces';

export const loadAppLocales = (): IAppStrings => {
  const appStrings: IAppStrings = {
    appName: Browser.i18n.getMessage('appName'),
    appTimerMode: Browser.i18n.getMessage('appTimerMode'),
    appTimerTip: Browser.i18n.getMessage('appTimerTip'),
    appTimerDesc: Browser.i18n.getMessage('appTimerDesc'),
    appManualMode: Browser.i18n.getMessage('appManualMode'),
    appBruteforce: Browser.i18n.getMessage('appBruteforce'),
    appOptimize: Browser.i18n.getMessage('appOptimize'),
    appLetsChat: Browser.i18n.getMessage('appLetsChat'),
    appSend: Browser.i18n.getMessage('appSend'),
    appStop: Browser.i18n.getMessage('appStop'),
    appReset: Browser.i18n.getMessage('appReset'),
    appOr: Browser.i18n.getMessage('appOr'),
    appOptions: Browser.i18n.getMessage('appOptions'),
    appAIClient: Browser.i18n.getMessage('appAIClient'),
    appAuthLogin: Browser.i18n.getMessage('appAuthLogin'),
    appAuthSetApiKey: Browser.i18n.getMessage('appAuthSetApiKey'),
    appErrCloudflare: Browser.i18n.getMessage('appErrCloudflare'),
    appErrBraveNotWorking: Browser.i18n.getMessage('appErrBraveNotWorking'),
    appErrBraveTroubleshoot: Browser.i18n.getMessage('appErrBraveTroubleshoot'),
    appErrCloudflareDetails: Browser.i18n.getMessage('appErrCloudflareDetails'),
    appShuffle: Browser.i18n.getMessage('appShuffle'),
    appChatGpt: Browser.i18n.getMessage('appChatGpt'),
    appChatGptTitle: Browser.i18n.getMessage('appChatGptTitle'),
    appChatGptDesc: Browser.i18n.getMessage('appChatGptDesc'),
    appChatGptPlusDesc: Browser.i18n.getMessage('appChatGptPlusDesc'),
    appChatGptPlusFooter: Browser.i18n.getMessage('appChatGptPlusFooter'),
    appChatGptPlusSave: Browser.i18n.getMessage('appChatGptPlusSave'),
    appManualTip: Browser.i18n.getMessage('appManualTip'),
    appChatGptPlusLearnMore: Browser.i18n.getMessage('appChatGptPlusLearnMore'),
    appInstallNotification: Browser.i18n.getMessage('appInstallNotification'),
    appStreak: Browser.i18n.getMessage('appStreak'),
    appStreakDesc: Browser.i18n.getMessage('appStreakDesc'),
    appStreakNotification: Browser.i18n.getMessage('appStreakNotification'),
    appStreakAddedNotification: Browser.i18n.getMessage('appStreakAddedNotification'),
    appStreakAddedSubNotification: Browser.i18n.getMessage('appStreakAddedSubNotification'),
    appStreakQuestions: Browser.i18n.getMessage('appStreakQuestions'),
  };

  return appStrings;
};
