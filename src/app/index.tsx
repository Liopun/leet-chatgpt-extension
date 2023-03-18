import { FC, useState } from 'react';
import { IPetition, TriggerMode } from '../interfaces';
import { addPetition } from '../utils/common';
import Query from './components/Query';

interface ResponseProps {
  inputQuestion: string;
  inputSolution: string;
  triggerMode: TriggerMode;
}

const App: FC<ResponseProps> = (props) => {
  const { inputQuestion, inputSolution, triggerMode } = props;
  const [currentQuestion, setCurrentQuestion] = useState('');

  const updateQuestion = (mode?: string) => {
    const petitionOpts: IPetition = {
      question: inputQuestion,
      solution: inputSolution,
      mode: mode,
    };
    const newQuestion = addPetition(petitionOpts);
    setCurrentQuestion(newQuestion);
  };

  const resetQuestion = () => {
    setCurrentQuestion('');
  };

  return (
    <div className='chat-gpt-container'>
      <div className='chat-gpt-card'>
        <Query question={currentQuestion} onModeChange={updateQuestion} resetQuestion={resetQuestion} />
      </div>
    </div>
  );
};

export default App;
