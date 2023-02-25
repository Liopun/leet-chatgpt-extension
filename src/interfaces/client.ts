import { IGenerateResponseParams } from './response.js';

export enum ClientType {
    ChatGPT = "chatgpt",
    GPT3 = "gpt3",
}

export interface IClient {
    askAI(params: IGenerateResponseParams): Promise<{ cleanUp?: () => void }>
}

export enum TriggerMode {
    Problem = "problem",
    Submission = "submission",
}

export enum AssistanceMode {
    Learning = "learning",
    Interview = "interview"
}

export interface IGPT3ClientCfg {
    model: string
    apiKey: string
}

export interface IClientCfgs {
    client: ClientType
    configs: {
        [ClientType.GPT3]: IGPT3ClientCfg | undefined
    }
}
