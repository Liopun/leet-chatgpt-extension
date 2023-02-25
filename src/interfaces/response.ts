export interface IResponse {
    text: string
    messageId: string
    conversationId: string
}

export type ResponseEvent = | {
    type: 'answer'
    data: IResponse
} | {
    type: 'done'
}

export interface IGenerateResponseParams {
    prompt: string
    onEvent: (e: ResponseEvent) => void
    signal?: AbortSignal
}
