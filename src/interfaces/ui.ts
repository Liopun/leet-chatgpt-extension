import { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Dayjs } from 'dayjs';

export interface IAppStrings {
  appName: string;
  appTimerMode: string;
  appTimerTip: string;
  appTimerDesc: string;
  appManualMode: string;
  appManualTip: string;
  appBruteforce: string;
  appOptimize: string;
  appLetsChat: string;
  appSend: string;
  appStop: string;
  appReset: string;
  appOr: string;
  appOptions: string;
  appAIClient: string;
  appAuthLogin: string;
  appAuthSetApiKey: string;
  appErrCloudflare: string;
  appErrBraveNotWorking: string;
  appErrBraveTroubleshoot: string;
  appErrCloudflareDetails: string;
  appShuffle: string;
  appChatGpt: string;
  appChatGptTitle: string;
  appChatGptDesc: string;
  appChatGptPlusDesc: string;
  appChatGptPlusFooter: string;
  appChatGptPlusSave: string;
  appChatGptPlusLearnMore: string;
  appInstallNotification: string;
  appStreak: string;
  appStreakDesc: string;
  appStreakNotification: string;
  appStreakAddedNotification: string;
  appStreakAddedSubNotification: string;
  appStreakQuestions: string;
}

export interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  dayIsEvent: boolean;
  startsOn?: string;
  endsOn?: string;
}

export interface IUserStats {
  id: number;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  description: string;
  resourcesId: number;
}
