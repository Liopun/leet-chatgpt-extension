import { Engine } from '../interfaces/engine';

export const EngineModes: Record<string, Engine> = {
  problem: {
    // leetcode
    host: 'leetcode',
    input_question: ['__next', 'ssg__qd-splitter-primary-w', '[data-track-load="description_content"]'],
    input_question_alt: ['__next', 'qd-content', '[data-track-load="description_content"]'],
    input_topics: ['__next', 'ssg__qd-splitter-primary-w'],
    input_topics_alt: [],
    input_code: ['qd-content', 'ssg__qd-splitter-secondary-w', '[data-track-load="code_editor"]', 'view-lines'],
    input_code_alt: ['qd-content', 'editor', '[data-track-load="code_editor"]'],
    submit_button: ['__next', 'console-submit-button', 'lc-home', 'submit__-6u9', 'ery7n2v0'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['ssg__qd-console-position--right', 'css-pwvbgl-CodeAreaContainer'],
    appendContainerLeft: ['ssg__qd-console-position--left', 'css-pwvbgl-CodeAreaContainer'],
    appendContainerDL: ['editor'],
  },
  challenge: {
    // hacker-rank
    host: 'hackerrank',
    input_question: ['content', 'challenge-body-html'],
    input_topics: [],
    input_code: ['content', 'view-lines'],
    submit_button: ['content', 'hr-monaco-submit'],
    sidebarContainer: ['rhs'],
    appendContainerRight: ['hr-monaco-editor-statusbar'],
    appendContainerLeft: ['hr-monaco-custom-input-wrapper'],
    input_question_alt: [],
    input_topics_alt: [],
    input_code_alt: [],
    appendContainerDL: [],
  },
};
