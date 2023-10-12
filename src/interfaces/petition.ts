import { TriggerMode } from './client';

export interface IPetition {
  solution: string;
  mode?: string;
  triggerMode: TriggerMode;
}
