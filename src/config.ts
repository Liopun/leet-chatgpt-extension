import { defaults } from "lodash-es";
import Browser from "webextension-polyfill";
import { TriggerMode, AssistanceMode, IClientCfgs, ClientType, Theme, Language } from "./interfaces";

export const TRIGGERS = {
    [TriggerMode.Problem]: { 
        title: 'Problem',
        desc: 'Assistance is provided per a question' 
    },
    [TriggerMode.Submission]: {
        title: 'Submission',
        desc: 'Assistance is provided after you submit your solution',
    }
}

export const ASSISTANCE = {
    [AssistanceMode.Learning]: { 
        title: 'Learning',
        desc: 'ChatGPT provides all it can for you to arrive to an optimal solution' 
    },
    [AssistanceMode.Interview]: {
        title: 'Interview',
        desc: 'ChatGPT provides limited and strict help for you to arrive to an optimal solution',
    }
}

export const ASSISTANCE_TEXT = {
    [AssistanceMode.Learning]: "Learning",
    [AssistanceMode.Interview]: "Interview",
}

const userDefaultCfg = {
    assistanceMode: AssistanceMode.Learning || AssistanceMode.Interview,
    theme: Theme.Auto,
    language: Language.Auto
}

export type UserCfg = typeof userDefaultCfg

const getUserCfg = async (): Promise<UserCfg> => {
    const res = await Browser.storage.local.get(Object.keys(userDefaultCfg))
    return defaults(res, userDefaultCfg)
}

const updateUserCfg = async (inp: Partial<UserCfg>) => {
    console.debug("updating cfg", inp)
    return Browser.storage.local.set(inp)
}

const setClientCfgs = async (client: ClientType, cfgs: IClientCfgs["configs"]) => Browser.storage.local.set({
    client,
    [`client:${ClientType.GPT3}`]: cfgs[ClientType.GPT3]
})

const getClientCfgs = async (): Promise<IClientCfgs> => {
    const { client = ClientType.ChatGPT } = await Browser.storage.local.get("client")
    const cfgKey = `client:${ClientType.GPT3}`
    const res = await Browser.storage.local.get(cfgKey)

    return {
        client,
        configs: {
            [ClientType.GPT3]: res[cfgKey],
        }
    }
}

export { getUserCfg, updateUserCfg, setClientCfgs, getClientCfgs }