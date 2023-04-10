import { FC, useCallback, useState } from 'react';
import { IPetition, TriggerMode } from '../interfaces';
import { addPetition } from '../utils/common';
import Query from './components/Query';

interface ResponseProps {
  submitElement: Element;
  inputQuestion: string;
  inputElement: Element;
  topics: string[];
  triggerMode: TriggerMode;
}

const App: FC<ResponseProps> = (props) => {
  const { submitElement, inputQuestion, inputElement, topics, triggerMode } = props;
  const [currentQuestion, setCurrentQuestion] = useState('');

  const updateQuestion = useCallback(
    (mode?: string) => {
      const currText = inputElement.textContent;
      if (currText) {
        const petitionOpts: IPetition = {
          question: inputQuestion,
          solution: currText,
          mode: mode,
        };
        const newQuestion = addPetition(petitionOpts);
        setCurrentQuestion(newQuestion);
      }
    },
    [inputQuestion, inputElement]
  );

  const resetQuestion = useCallback(() => {
    setCurrentQuestion('');
  }, []);

  return (
    <div className='chat-gpt-container'>
      <div className='chat-gpt-card'>
        <Query
          question={currentQuestion}
          topics={topics}
          submitElement={submitElement}
          onModeChange={updateQuestion}
          resetQuestion={resetQuestion}
        />
      </div>
    </div>
  );
};

export default App;
