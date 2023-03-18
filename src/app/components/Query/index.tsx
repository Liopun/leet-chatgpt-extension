import { QuestionAnswer } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Grid, SelectChangeEvent, Typography } from '@mui/material';
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from 'react-spinners';
import rehypeHighlight from 'rehype-highlight';
import Browser from 'webextension-polyfill';
import { ASSISTANCE } from '../../../config';
import { ChatMessageObj } from '../../../interfaces/chat';
import { ClientError } from '../../../utils/errors';
import { useChat } from '../../hooks';
import theme from '../../theme';
import Loading from '../Loading';
import ChatPanel from './ChatPanel';
import ErrorPanel from './ErrorPanel';
import NavBar from './NavBar';

interface Props {
  question: string;
  onModeChange: (mode?: string) => void;
  resetQuestion: () => void;
}

const Query: FC<Props> = (props) => {
  const { question, onModeChange, resetQuestion } = props;
  const [answer, setAnswer] = useState<ChatMessageObj | null>(null);
  const [error, setError] = useState<ClientError | null>(null);
  const [retries, setRetries] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startedChat, setStartedChat] = useState(false);

  // timer
  const [timeStarted, setTimerStarted] = useState(false);
  const [timerInProgress, setTimerInProgress] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('10 min');
  const [timerId, setTimerId] = useState<NodeJS.Timer>();
  const TIME_OPTIONS = ['10 min', '15 min', '20 min', '25 min', '30 min', '35 min'];

  const chatgptChat = useChat('chatgpt');

  const generating = useMemo(() => chatgptChat.generating, [chatgptChat.generating]);

  const resetConvo = useCallback(() => {
    if (!chatgptChat.generating) chatgptChat.resetConversation();
  }, [chatgptChat.resetConversation]);

  const stopConvo = useCallback(() => {
    if (generating) chatgptChat.stopGenerating();
  }, [chatgptChat.stopGenerating]);

  const oneTimeUseAI = () => {
    setLoading(true);
    setError(null);
    resetConvo();
    chatgptChat.sendMessage(question);
  };

  const handleTimerSelect = (event: SelectChangeEvent) => {
    setSelectedTimer(event.target.value);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (cRef: RefObject<HTMLDivElement>) => {
    if (cRef.current) cRef.current.scrollIntoView({ block: 'end' });
  };

  const handleTimerStart = () => {
    setTimerStarted(true);
    setMinimized(false);
    setAnswer(null);
    setShowAnswer(false);
    setLoading(false);
    setStartedChat(false);
    setTimerInProgress(`${selectedTimer.split(' ')[0]}:00`);
  };

  const handleStopTimer = () => {
    setTimerStarted(false);
    setMinimized(false);
    setAnswer(null);
    setShowAnswer(false);
    setLoading(false);
    setStartedChat(false);
    setTimerInProgress('');
  };

  const handleManualBRClick = () => {
    resetQuestion();
    handleStopTimer();
    setTimeout(() => {
      // wait for resetQuestion effect
      onModeChange(ASSISTANCE.manual.types[0]);
    }, 0);
  };

  const handleManualOPClick = () => {
    resetQuestion();
    handleStopTimer();
    setTimeout(() => {
      // wait for resetQuestion effect
      onModeChange(ASSISTANCE.manual.types[1]);
    }, 0);
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
        // timer done -> ask AI
        onModeChange();
      }
    }, 1000);
    setTimerId(currentTimerId);
  };

  useEffect(() => {
    if (question.length > 10) oneTimeUseAI();
  }, [question, onModeChange]);

  useEffect(() => {
    if (chatgptChat.messages.length > 1) {
      const curr = chatgptChat.messages[1];

      if (curr.error) {
        setError(curr.error);
        return;
      }

      if (curr.text !== question) {
        // ignore input_question echoing
        setShowAnswer(true);
        setAnswer(curr);
        setLoading(false);
        scrollToBottom(containerRef);
      }
    }
  }, [chatgptChat.messages]);

  useEffect(() => {
    if (answer && showAnswer && !loading && !startedChat && !minimized) scrollToBottom(containerRef);
  }, [generating]);

  useEffect(() => {
    if (error) {
      const onFocus = () => {
        setRetries((r) => ++r);
        window.location.reload();
      };

      const timer = setTimeout(() => {
        window.addEventListener('focus', onFocus);
      }, 1000);

      return () => {
        window.removeEventListener('focus', onFocus);
        clearTimeout(timer);
      };
    }
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

  if (error) {
    return <ErrorPanel retries={retries} error={error} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar
        selectedTimer={selectedTimer}
        timeStarted={timeStarted}
        disableManuals={generating}
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

      {(!answer && timeStarted && !minimized) === true ? (
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

      {answer && showAnswer && !loading && !startedChat && !minimized ? (
        <Box
          className='markdown-body gpt-markdown'
          id='gpt-answer'
          sx={{
            scrollbarWidth: 'thin',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.info.main,
              borderRadius: '6px',
            },
          }}>
          {answer.text && answer.text.length > 0 ? (
            <>
              {generating && (
                <Typography
                  component='a'
                  variant='body2'
                  sx={{ color: 'red', opacity: 0.5, textDecoration: 'none !important' }}
                  onClick={(e) => {
                    e.preventDefault();
                    stopConvo();
                  }}>
                  <CancelIcon sx={{ color: 'red', opacity: 0.5 }} /> {' stop generating'}
                </Typography>
              )}
              <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>{answer.text}</ReactMarkdown>
            </>
          ) : (
            !answer.error && (
              <Box
                sx={{
                  borderRadius: '15px',
                  minHeight: '3rem',
                  width: '100%',
                  mt: '1rem',
                }}>
                <Grid container direction='row' justifyContent='center' alignItems='center'>
                  <Typography component='div' variant='body1' sx={{ mt: '1rem' }}>
                    <BeatLoader size={10} className='leading-tight' />
                  </Typography>
                </Grid>
              </Box>
            )
          )}

          {!generating ? (
            <Button variant='outlined' size='medium' endIcon={<QuestionAnswer />} onClick={() => setStartedChat(true)}>
              I Have follow-up question(s)
            </Button>
          ) : null}
          <Box ref={containerRef}></Box>
        </Box>
      ) : null}

      {loading && !startedChat ? <Loading /> : null}

      {startedChat === true ? <ChatPanel clientId='chatgpt' /> : null}
    </Box>
  );
};

export default Query;
