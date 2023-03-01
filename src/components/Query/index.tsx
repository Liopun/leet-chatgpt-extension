import { Box, SelectChangeEvent, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Browser from 'webextension-polyfill';
import { ASSISTANCE } from '../../config';
import { useUserAuth } from '../../hooks';
import { IQueryEvent, IQueryEventRec, IResponse, QueryStatus } from '../../interfaces';
import Loading from '../Loading';
import AuthRequired from './AuthRequired';
import NavBar from './NavBar';

interface QueryProps {
  question: string;
  onModeChange: (mode?: string) => void;
  onStatusChange?: (status: QueryStatus) => void;
}

const Query: FC<QueryProps> = (props) => {
  const { question, onModeChange, onStatusChange } = props;
  const [answer, setAnswer] = useState<IResponse | null>(null);
  const [error, setError] = useState('');
  const [retries, setRetries] = useState(0);
  const [authRetries, setAuthRetries] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [disableManuals, setDisableManuals] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [status, setStatus] = useState<QueryStatus>();

  // timer
  const [timeStarted, setTimerStarted] = useState(false);
  const [timerInProgress, setTimerInProgress] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('1 min');
  const [timerId, setTimerId] = useState<NodeJS.Timer>();
  const TIME_OPTIONS = ['1 min', '15 min', '20 min', '25 min', '30 min', '35 min'];

  const port = Browser.runtime.connect({ name: 'leet-gpt-main' });

  const { token, isLoading, authErr } = useUserAuth();

  const handleTimerSelect = (event: SelectChangeEvent) => {
    setSelectedTimer(event.target.value);
  };

  const handleTimerStart = () => {
    onModeChange();
    setTimerStarted(true);
    setMinimized(false);
    setAnswer(null);
    setShowAnswer(false);
    setTimerInProgress(`${selectedTimer.split(' ')[0]}:00`);
  };

  const handleStopTimer = () => {
    setTimerStarted(false);
    setDisableManuals(false);
    setMinimized(false);
    setAnswer(null);
    setShowAnswer(false);
    setTimerInProgress('');
  };

  const handleManualBRClick = () => {
    onModeChange(ASSISTANCE.manual.types[0]);
    handleStopTimer();
    setShowAnswer(true);
    setDisableManuals(true);
  };

  const handleManualOPClick = () => {
    onModeChange(ASSISTANCE.manual.types[1]);
    handleStopTimer();
    setShowAnswer(true);
    setDisableManuals(true);
  };

  const handleMinimizeClick = () => {
    setMinimized(!minimized);
  };

  const resetTimer = async (id: NodeJS.Timer) => {
    await Browser.storage.local.remove(['timer', 'seconds']);
    clearInterval(id);
  };

  const timerCountDown = (duration: number) => {
    let timer = duration,
      minutes,
      seconds;
    const currentTimerId = setInterval(function () {
      minutes = parseInt(`${timer / 60}`, 10);
      seconds = parseInt(`${timer % 60}`, 10);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      setTimerInProgress(`${minutes}:${seconds}`);

      if (--timer < 0) {
        handleStopTimer();
        setShowAnswer(true);
      }
    }, 1000);
    setTimerId(currentTimerId);
  };

  useEffect(() => {
    if (onStatusChange) onStatusChange(status);
  }, [onStatusChange, props, status]);

  useEffect(() => {
    // setAuthLoading(isLoading)
    setError(authErr);
  }, [token, isLoading, authErr, authRetries]);

  useEffect(() => {
    if (showAnswer) {
      const listener = (message: any) => {
        const { event, data } = message as IQueryEventRec;

        if (event === 'RESPONSE_OUTPUT') {
          setAnswer(data);
          setDisableManuals(true);
          setStatus('success');
          return;
        }

        if (event === 'ERROR' && data.text) {
          console.debug(`Error: ${event} ${data.text}`);
          setError(data.text);
          setDisableManuals(false);
          setStatus('error');
        }

        if (event === 'DONE') {
          setDone(true);
          setDisableManuals(false);
          return;
        }
      };
      port.onMessage.addListener(listener);
      const msg: IQueryEvent = {
        event: 'ASK',
        value: question,
      };
      port.postMessage(msg);

      return () => {
        port.onMessage.removeListener(listener);
        port.disconnect();
      };
    }
  }, [showAnswer, question, retries]);

  useEffect(() => {
    const onFocus = () => {
      if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
        setError('');
        setRetries((r) => ++r);
      }
      if (error === 'AUTH_ERROR') {
        setError('');
        setAuthRetries((r) => ++r);
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener('focus', onFocus);
    }, 1000);

    return () => {
      window.removeEventListener('focus', onFocus);
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    if (timeStarted) {
      timerCountDown(parseInt(selectedTimer.split(' ')[0], 10) * 60);
    } else {
      if (timerId !== undefined) {
        handleStopTimer();
        resetTimer(timerId);
      }
    }
  }, [timeStarted]);

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE' || error === 'AUTH_ERROR') {
    return <AuthRequired retries={retries} authRetries={authRetries} />;
  } else if (error.length > 0) {
    console.debug(':::::--::', error);
    return <AuthRequired retries={retries} authRetries={authRetries} customErr={error} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar
        selectedTimer={selectedTimer}
        timeStarted={timeStarted}
        disableManuals={disableManuals}
        minimized={minimized}
        showAnswer={showAnswer}
        handleTimerSelect={handleTimerSelect}
        options={TIME_OPTIONS}
        handleTimerStart={handleTimerStart}
        handleStopTimer={handleStopTimer}
        handleManualBRClick={handleManualBRClick}
        handleManualOPClick={handleManualOPClick}
        handleMinimizeClick={handleMinimizeClick}
      />
      {(!showAnswer && !minimized && timeStarted) === true ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '3rem',
            width: '100%',
            mt: '1rem',
          }}>
          {/* timer-in-progress view */}
          <Typography component='div' mt='1rem' textAlign='center' alignItems='center'>
            <Typography component='p' variant='h6'>
              {timerInProgress}
            </Typography>
            <Typography component='p' variant='body1'>
              try to solve this question, you will get feedback and help on your solution after this timer runs out.
            </Typography>
          </Typography>
        </Box>
      ) : null}
      {answer && showAnswer && !minimized ? (
        <Box className='markdown-body gpt-markdown' id='gpt-answer'>
          {answer.messageId.length > 0 && answer.conversationId.length > 0 ? (
            <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>{answer.text}</ReactMarkdown>
          ) : null}
        </Box>
      ) : null}
      {(!answer && showAnswer && !minimized) === true ? <Loading /> : null}
    </Box>
  );
};

export default Query;
