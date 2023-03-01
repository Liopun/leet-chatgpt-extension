import { FC, useState } from 'react';
import { IPetition, QueryStatus, TriggerMode } from '../../interfaces';
import { addPetition } from '../../utils/common';
import Query from '../Query';

interface ResponseProps {
  inputQuestion: string;
  inputSolution: string;
  triggerMode: TriggerMode;
}

const Response: FC<ResponseProps> = (props) => {
  const { inputQuestion, inputSolution, triggerMode } = props;
  const [queryStatus, setQueryStatus] = useState<QueryStatus>();
  const [currentQuestion, setCurrentQuestion] = useState(
    addPetition({ question: inputQuestion, solution: inputSolution })
  );

  const updateQuestion = (mode?: string) => {
    const petitionOpts: IPetition = {
      question: inputQuestion,
      solution: inputSolution,
      mode: mode,
    };
    const newQuestion = addPetition(petitionOpts);
    setCurrentQuestion(newQuestion);
  };

  return (
    <div className='chat-gpt-container'>
      <div className='chat-gpt-card'>
        <Query question={currentQuestion} onModeChange={updateQuestion} onStatusChange={setQueryStatus} />
      </div>
    </div>
  );
};

export default Response;
