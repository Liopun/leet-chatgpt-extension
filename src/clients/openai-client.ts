import ExpiryMap from "expiry-map";
import { v4 as uuidv4 } from 'uuid';
import { fetchSSE } from "../background/fetch-sse";
import { IClient, IModels, IGenerateResponseParams, ISSEOpenAI } from "../interfaces";
import { request } from "./request";

class OpenAIClient implements IClient {
    constructor(private token: string, private model: string) {
        this.token = token;
        this.model = model;
    }

    private preparePrompt = (prompt: string): string => this.model.startsWith("text-chat-davinci") ? 
        `Respond conversationally.<|im_end|>\n\nUser: ${prompt}<|im_sep|>\nChatGPT:` :
        prompt;

    async askAI(params: IGenerateResponseParams): Promise<{ cleanUp?: () => void; }> {
        const completionsURL = "https://api.openai.com/v1/completions"
        const bodyObj: ISSEOpenAI =  {
            model: this.model,
            prompt: this.preparePrompt(params.prompt),
            stream: true,
            max_tokens: 2048,
        }
        let result = "";

        await fetchSSE(completionsURL, {
            method: "POST",
            signal: params.signal,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify(bodyObj),
            onMessage(msg: string) {
                console.debug('sse message', msg);
                if(msg === "[DONE]") {
                    params.onEvent({ type: 'done' });
                    return;
                }

                try {
                    const data = JSON.parse(msg)
                    const text = data.choices[0].text

                    if (text === '<|im_end|>' || text === '<|im_sep|>') {
                        return;
                    }
                    
                    params.onEvent({
                        type: "answer",
                        data: {
                            text,
                            messageId: data.id,
                            conversationId: data.id
                        }
                    });

                } catch (error) {
                    console.error(error);
                    return;
                }
            },
        });

        return { }
    }
}

export { OpenAIClient }
