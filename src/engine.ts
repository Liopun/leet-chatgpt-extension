import { Engine } from './interfaces/engine';

export const EngineModes: Record<string, Engine> = {
  problem: {
    input_question: ['__next', '_1l1MA'],
    input_code: ['qd-content', 'view-lines'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['ssg__qd-console-position--right'],
    appendContainerLeft: ['ssg__qd-console-position--left'],
  },
  submission: {
    input_question: ["input[name='']"],
    input_code: ["input[name='']"],
    sidebarContainer: ['#rhs'],
    appendContainerRight: ['ssg__qd-console-position--right'],
    appendContainerLeft: ['ssg__qd-console-position--left'],
  },
};
