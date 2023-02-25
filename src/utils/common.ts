import Browser from 'webextension-polyfill';
import { AssistanceMode, IPetition, Theme, TriggerMode } from '../interfaces';

const PREFIX_PETITION = "Based on this question: \n"
const L_PETITION_PROBLEM = "\n\nI want you to act as my teacher, and provide me advice and help on how I could work my way from a brute force to an optimal solution, pretending that I am 5 year old \n"
const L_PETITION_SUBMISSION = "\n\nI want you to act as my teacher, and provide me advice and help on how I could work my way to an optimal solution based on the following code: \n"
// const LEARNING_PETITION_LONG = "\n\nI want you to act as my teacher, and provide me advice and help on how I could work my way to an optimal solution based on the following code: \n"
const I_PETITION_PROBLEM = "\nI want you to act as my interviewer, and provide me advice and help simulating real life interview, on how I could work my way from a brute force to an optimal solution, pretending that I am 5 year old \n"
const I_PETITION_SUBMISSION = "\nI want you to act as my interviewer, and provide me advice and help simulating real life interview, on how I could work my way to an optimal solution based on the following code: \n"

export const isBraveBrowser = () => (navigator as any).brave?.isBrave()

export const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false

export const isTipNeeded = async () => {
    const { tipStorage } = await Browser.storage.local.get("tipsNumber")
    const tipsNumber = tipStorage as number

    if(tipsNumber >= 5) return false

    await Browser.storage.local.set({ tipsNumber: tipsNumber+1})

    return tipsNumber >= 2
}

export const addPetition = (opts: IPetition): string => {
    const { question, assistanceMode, triggerMode, questionExtra} = opts

    if(assistanceMode === AssistanceMode.Learning) {
        if(triggerMode === TriggerMode.Problem) return PREFIX_PETITION + question + L_PETITION_PROBLEM
        if(triggerMode === TriggerMode.Submission) return PREFIX_PETITION + question + L_PETITION_SUBMISSION + questionExtra
    } 

    if(assistanceMode === AssistanceMode.Interview) {
        if(triggerMode === TriggerMode.Problem) return PREFIX_PETITION + question + I_PETITION_PROBLEM
        if(triggerMode === TriggerMode.Submission) return PREFIX_PETITION + question + I_PETITION_SUBMISSION + questionExtra
    }

    return ""
}

export function querySelectElement<T extends Element>(
    possibleItems: string[],
): T | undefined {
    possibleItems.forEach((val) => {
        const item = document.querySelector(val)
        if(item) return item as T
    })

    return
}

export const getQuestionElement = () => {
    const qElem = document.getElementById("__next")
    const qChild = qElem?.getElementsByClassName("_1l1MA")[0]

    return qChild
} 