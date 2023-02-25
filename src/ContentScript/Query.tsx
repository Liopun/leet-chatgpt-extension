import React, { FC, useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import SettingsIcon from '@mui/icons-material/Settings';
import browser from "webextension-polyfill";
import { AssistanceMode, IResponse, QueryStatus, IQueryEventRec, IQueryEvent } from "../interfaces";
import { isBraveBrowser, isTipNeeded } from "../utils/common";
import Feedback from "./Feedback";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";

interface QueryProps {
    question: string
    assistanceMode: AssistanceMode
    onStatusChange?: (status: QueryStatus) => void
}

const Query: FC<QueryProps> = (props) => {
    const { question, assistanceMode, onStatusChange } = props
    const [answer, setAnswer] = useState<IResponse | null>(null)
    const [error, setError] = useState('')
    const [retries, setRetries] = useState(0)
    const [done, setDone] = useState(false)
    const [status, setStatus] = useState<QueryStatus>()

    const port = browser.runtime.connect({ name: "leet-gpt-main"})

    useEffect(() => {
        if(onStatusChange) onStatusChange(status)
    }, [props, status])

    useEffect(() => {
        const listener = (message: any) => {
            const {event, data} = message as IQueryEventRec
            console.debug(`Received: ${event} ${data.text}`)

            if(event === "RESPONSE_OUTPUT") {
                setAnswer(data)
                setStatus("success")
                return
            }

            if(event === "ERROR" && data.text) {
                setError(data.text)
                setStatus("error")
            }

            if(event === "DONE") {
                setDone(true)
                return
            }
        }
        port.onMessage.addListener(listener)
        const msg: IQueryEvent = {
            event: "ASK",
            value: question
        }
        port.postMessage(msg)

        return () => {
            port.onMessage.removeListener(listener)
            port.disconnect()
        }
    }, [question, retries])

    useEffect(() => {
        const onFocus = () => {
            if(error && error === "UNAUTHORIZED" || error === "CLOUDFLARE") {
                setError("")
                setRetries((r) => ++r)
            }
        }
        window.addEventListener("focus", onFocus)

        return () => window.removeEventListener("focus", onFocus)
    }, [error])

    // useEffect(() => {
    //     isTipNeeded().then((show) => setShowTip(show))
    // }, [])
    
    // const openOptionsPage = useCallback(() => {
    //     const msg: IQueryEvent = {
    //         event: "OPEN_OPTIONS_PAGE",
    //         value: ""
    //     }
    //     browser.runtime.sendMessage(msg)
    // }, [])

    if(answer) {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="transparent">
                    <Toolbar variant="dense">
                        <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
                            ChatGP | {assistanceMode}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
                    {answer.text}
                </ReactMarkdown>
            </Box>
        )
    }

    if(error === "UNAUTHORIZED" || error === "CLOUDFLARE") {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '2rem',
                    width: '100%',
                }}
            >
                <Typography variant="body1" paragraph>
                    Please login and pass Cloudflare check at{' '}
                    <Link href="https://chat.openai.com" underline="none" target="_blank" rel="noreferrer">chat.openai.com</Link>
                    {retries > 0 && (() => {
                        return isBraveBrowser() ?  (
                                <Typography mt={2} variant="body2">
                                    Still not working? Follow{' '}
                                    <a href="https://github.com/liopun/leet-gpt-extension#troubleshooting">
                                        Brave Troubleshooting
                                    </a>
                                </Typography>
                            ) : (
                                <Typography mt={2} variant="body2" className="italic block mt-2 text-xs">
                                    OpenAI requires passing a security. If this annoys you, change AI provider to OpenAI API in the extension options.
                                </Typography>
                            )
                    })()}
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '3rem',
                width: '100%',
            }}
        >
            <Typography fontSize="1rem" sx={{ color: '#808080', pr: '2rem' }}>waiting for ChatGPT response{'   '}| {'   '} {assistanceMode} mode</Typography>
            <CircularProgress size='1.5rem' sx={{ color: '#fff' }} />
        </Box>
    )
}

export default Query;