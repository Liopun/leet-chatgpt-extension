import { FC, useCallback, useState } from 'react';
import { IPetition, TriggerMode } from '../interfaces';
import { addPetition } from '../utils/common';
import Query from './components/Query';

interface ResponseProps {
  submitElement: Element;
  inputElement: Element;
  topics: string[];
  triggerMode: TriggerMode;
}

const App: FC<ResponseProps> = (props) => {
  const { submitElement, inputElement, topics, triggerMode } = props;
  const [currentQuestion, setCurrentQuestion] = useState('');

  const updateQuestion = useCallback(
    (mode?: string) => {
      const currText = inputElement.textContent;
      if (currText) {
        const petitionOpts: IPetition = {
          solution: currText,
          mode: mode,
          triggerMode: triggerMode,
        };
        const newQuestion = addPetition(petitionOpts);
        setCurrentQuestion(newQuestion);
      }
    },
    [inputElement, triggerMode]
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
