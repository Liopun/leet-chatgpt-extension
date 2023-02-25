import browser from "webextension-polyfill"
import { ChatGPTClient, OpenAIClient, GetAuthAccessToken } from "../clients";
import { getClientCfgs } from "../config";
import { IClient, ClientType, IQueryEvent, IQueryEventRec } from "../interfaces";

async function askAI(port: browser.Runtime.Port, question: string) {
    const clientCfgs = await getClientCfgs()
    let client: IClient

    switch (clientCfgs.client) {
        case ClientType.ChatGPT:
            const token = await GetAuthAccessToken()
            client = new ChatGPTClient(token)
            break;
    
        case ClientType.GPT3:
            const { apiKey, model } = clientCfgs.configs[ClientType.GPT3]!
            client = new OpenAIClient(apiKey, model)
            break;
    
        default:
            throw new Error(`Invalid client ${clientCfgs.client}`)
    }

    const ctl = new AbortController()
    port.onDisconnect.addListener(() => {
        ctl.abort()
        cleanUp?.()
    })

    const { cleanUp } = await client.askAI({
        prompt: question,
        signal: ctl.signal,
        onEvent(e) {
            if(e.type === "done") {
                port.postMessage({ event: "DONE", value: "" } as IQueryEvent)
                return
            }
            port.postMessage({ event: "RESPONSE_OUTPUT", data: e.data } as IQueryEventRec)
        },
    })
}

browser.runtime.onConnect.addListener((port) => {
    console.assert(port.name === "leet-gpt-main");
    port.onMessage.addListener(async (msg) => {
        console.debug("incoming msg", msg)
        const { value } = msg as IQueryEvent

        try {
            await askAI(port, value)
        } catch (error: any) {
            console.error(error)
            const err: IQueryEventRec = {
                event: "ERROR",
                data: {
                    text: error.message,
                    messageId: "",
                    conversationId: ""
                }
            }
            port.postMessage(err)
        }
    })
})

browser.runtime.onMessage.addListener(async (msg) => {
    const { event } = msg as IQueryEvent
    alert(event)
    switch (event) {
        // case "FEEDBACK":
        //     const token = await GetAuthAccessToken()
        //     await SubmitMessageFeedback(token, data)
        //     break;
        case "OPEN_OPTIONS_PAGE":
            browser.runtime.openOptionsPage()
            break;
        case "GET_ACCESS_TOKEN":
            return GetAuthAccessToken()
    }
})

browser.runtime.onInstalled.addListener((details) => {
    if(details.reason === "install") browser.runtime.openOptionsPage()
})