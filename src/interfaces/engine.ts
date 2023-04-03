export interface Engine {
  host: string;
  input_question: string[];
  input_topics: string[];
  input_code: string[];
  submit_button: string[];
  sidebarContainer: string[];
  appendContainerRight: string[];
  appendContainerLeft: string[];
  watchRouteChange?: (callback: () => Promise<void> | void) => void;
}
