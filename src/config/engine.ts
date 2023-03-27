import { Engine } from '../interfaces/engine';

export const EngineModes: Record<string, Engine> = {
  problem: {
    // leetcode
    host: 'leetcode',
    input_question: ['__next', '_1l1MA', 'lc-home', 'css-1qqaagl-layer1', 'notranslate'],
    input_code: ['qd-content', 'view-lines', 'lc-home', 'view-lines'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['ssg__qd-console-position--right', 'css-pwvbgl-CodeAreaContainer'],
    appendContainerLeft: ['ssg__qd-console-position--left', 'css-pwvbgl-CodeAreaContainer'],
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
