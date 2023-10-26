export interface Engine {
  host: string;
  input_question: string[];
  input_question_alt: string[];
  input_topics: string[];
  input_topics_alt: string[];
  input_code: string[];
  input_code_alt: string[];
  submit_button: string[];
  sidebarContainer: string[];
  appendContainerRight: string[];
  appendContainerLeft: string[];
  appendContainerDL: string[];
  watchRouteChange?: (callback: () => Promise<void> | void) => void;
}
