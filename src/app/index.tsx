import { FC, useState } from 'react';
import { getUserCfg, updateUserCfg } from '../config';
import { IPetition, IUserStats, TriggerMode } from '../interfaces';
import { addPetition } from '../utils/common';
import Query from './components/Query';

interface ResponseProps {
  submitElement: Element;
  inputQuestion: string;
  inputSolution: string;
  topics: string[];
  triggerMode: TriggerMode;
}

const App: FC<ResponseProps> = (props) => {
  const { submitElement, inputQuestion, inputSolution, topics, triggerMode } = props;
  const [currentQuestion, setCurrentQuestion] = useState('');

  submitElement.addEventListener('click', function () {
    (async () => {
      const cfg = await getUserCfg();
      const stats = cfg.userStats;
      const reminderParts = cfg.userReminder.split(':');

      const sDate = new Date();
      sDate.setHours(parseInt(reminderParts[0]), parseInt(reminderParts[1]));
      const beforeMidnight = new Date();
      beforeMidnight.setHours(23, 59, 59, 0);

      const len = stats.length;

      if (len > 0) {
        const diff = Math.abs(new Date(stats[len - 1].startDate).getTime() - sDate.getTime());
        const roundedDiff = Math.round(diff / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);

        if (roundedDiff === 0) {
          const newStats = stats.slice(); // shallow copy

          let desc = newStats[len - 1].description;
          if (!desc.includes(location.href)) {
            desc += ` ${location.href}`;
          }

          let title = newStats[len - 1].title;

          topics.forEach((v) => {
            if (!title.includes(v)) {
              title += `; ${v}`;
            }
          });

          newStats[len - 1].description = desc;
          newStats[len - 1].title = title;

          await updateUserCfg({
            userStats: newStats,
          });
        }

        return;
      }

      await updateUserCfg({
        userStats: [
          ...stats,
          {
            id: stats.length,
            title: topics.join('; '),
            startDate: sDate.toISOString(),
            endDate: beforeMidnight.toISOString(),
            description: location.href,
            resourcesId: 1,
          } as IUserStats,
        ],
      });
    })();
  });

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
