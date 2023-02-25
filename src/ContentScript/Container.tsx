import { FC, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { AssistanceMode, QueryStatus } from '../interfaces'
import Card from './Card'

interface ContainerProps {
    question: string,
    assistanceMode: AssistanceMode
}

const Container: FC<ContainerProps> = (props) => {
    const { question, assistanceMode } = props
    const [queryStatus, setQueryStatus] = useState<QueryStatus>()

    return (
        <>
            <div className="chat-gpt-card">
                <Card question={question} assistanceMode={assistanceMode} onStatusChange={setQueryStatus} />
            </div>
        </>
    )
}

export default Container