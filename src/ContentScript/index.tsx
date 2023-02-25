import React from "react";
import ReactDOM from "react-dom"
import { getUserCfg } from "../config";
import { EngineModes } from "../engine";
import { Engine, IPetition } from "../interfaces";
import { addPetition, getQuestionElement, isDarkMode, querySelectElement } from "../utils/common"
import Card from "./Card";
import Container from "./Container";

import './styles.scss'
import { AssistanceMode } from '../interfaces/client';

const mount = async (question: string, engCfg: Engine) => {
    const container = document.createElement('div')
    container.className = "chat-gpt-container"
    container.classList.add(isDarkMode ? "gpt-dark" : "gpt-light")
    
    const usrCfg = await getUserCfg()
    const sbContainer = document.getElementsByClassName(engCfg.sidebarContainer[0])[0]

    if(sbContainer) {
        sbContainer.prepend(container)
    } else {
        container.classList.add("sidebar-free")
        const appendContainer = document.getElementsByClassName(engCfg.appendContainer[0])[1]

        if(appendContainer) {
            appendContainer.insertBefore(container, appendContainer.firstChild)
        }
    }

    ReactDOM.render(
        <Container question={question} assistanceMode={usrCfg.assistanceMode || "learning"}/>,
        container
    )
}

const submissionRegex = new RegExp(Object.keys(EngineModes).join(".*"))

const triggerMode = submissionRegex.test(location.hostname) ? "submission" : "problem"

const engCfg = EngineModes[triggerMode]

const run = async () => {
    const inputQuestion = getQuestionElement()

    if(inputQuestion !== undefined && inputQuestion.textContent) {
        console.debug('Mount ChatGPT on problems')
        const usrCfg = await getUserCfg()
        const petitionOpts: IPetition = {
            question: inputQuestion.textContent,
            assistanceMode: usrCfg.assistanceMode,
            triggerMode: triggerMode
        }
        const cleanQuestion = addPetition(petitionOpts)
        mount(cleanQuestion, engCfg)
    }
}

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    //enter here the action you want to do once loaded 
    setTimeout(run, 2000)

}, false);

if(engCfg.watchRouteChange) engCfg.watchRouteChange(run)