import React, { useState, FC } from "react";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { AssistanceMode, QueryStatus } from "../interfaces";
import Query from "./Query";

interface CardProps {
    question: string
    assistanceMode: AssistanceMode
    onStatusChange?: (status: QueryStatus) => void
}

const Card: FC<CardProps> = (props) => {
    const { question, assistanceMode, onStatusChange } = props
    const [manualTrigger, setManualTrigger] = useState(false)
    
    if(assistanceMode === AssistanceMode.Learning || assistanceMode === AssistanceMode.Interview || manualTrigger) {
        return (<Query question={question} assistanceMode={assistanceMode} onStatusChange={onStatusChange} />)
    }

    return (
        <Box sx={{ flexGrow: 0, borderRadius: '0px' }}>
            <Tooltip title={assistanceMode}>
                <IconButton onClick={() => setManualTrigger(true)} sx={{ p: 0, fontSize: 14 }}>
                    <QuestionAnswerIcon  style={{ marginRight: '1rem' }} /> Ask ChatGPT for help in {assistanceMode} mode
                </IconButton>
            </Tooltip>
        </Box>
    )
}

export default Card