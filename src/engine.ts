import { Engine } from './interfaces/engine';

export const EngineModes: Record<string, Engine> = {
  problem: {
    // leetcode
    host: 'leetcode',
    input_question: ['__next', '_1l1MA'],
    input_code: ['qd-content', 'view-lines'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['ssg__qd-console-position--right'],
    appendContainerLeft: ['ssg__qd-console-position--left'],
  },
  challenge: {
    // hacker-rank
    host: 'hackerrank',
    input_question: ['content', 'challenge-body-html'],
    input_code: ['content', 'view-lines'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['hr-monaco-editor-statusbar'],
    appendContainerLeft: ['hr-monaco-custom-input-wrapper'],
  },
};
