export interface Engine {
    input_question: string[]
    input_code: string[]
    sidebarContainer: string[]
    appendContainer: string[]
    watchRouteChange?: (callback: () => void) => void
}