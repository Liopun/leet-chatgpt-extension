import React, { FC } from "react";
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import WorkIcon from '@mui/icons-material/Work';
import { useCallback, useState } from "react";
import browser from "webextension-polyfill";

interface FeedbackProps {
    msg: string
    msgId: string
    convoId: string
}

const Feedback: FC<FeedbackProps> = (props) => {
    const { msg, msgId, convoId } = props
    const [copied, setCopied] = useState(false)
    const [action, setAction] = useState<'learningMode' | 'interviewMode' | null>(null)

    const learningModeHandler = useCallback(async () => {
        setAction("learningMode")
        await browser.runtime.sendMessage({
            key: "LEARNING_MODE",
            data: {
                conversation_id: convoId,
                message_id: msgId,
            }
        })
    }, [action, convoId, msgId])

    const interviewModeHandler = useCallback(async () => {
        setAction('interviewMode')
        await browser.runtime.sendMessage({
            key: 'INTERVIEW_MODE',
            data: {
                conversation_id: convoId,
                message_id: msgId,
            },
        })
    }, [action, convoId, msgId])

    return (
        <div className="gpt-feedback">
            <span
                onClick={learningModeHandler}
                className={action === 'learningMode' ? 'gpt-feedback-selected' : undefined}
            >
                <LocalLibraryIcon style={{ fontSize: 14 }}/>
            </span>
            <span
                onClick={interviewModeHandler}
                className={action === 'interviewMode' ? 'gpt-feedback-selected' : undefined}
            >
                <WorkIcon style={{ fontSize: 14 }}/>
            </span>
        </div>
    )
}

export default Feedback;