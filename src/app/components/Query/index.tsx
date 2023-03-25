import { QuestionAnswer } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Grid, SelectChangeEvent, Typography } from '@mui/material';
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from 'react-spinners';
import rehypeHighlight from 'rehype-highlight';
import Browser from 'webextension-polyfill';
import { ChatMessageObj } from '../../../interfaces/chat';
import { loadAppLocales } from '../../../utils/common';
import { ClientError } from '../../../utils/errors';
import { TIME_OPTIONS } from '../../constants';
import { useChat } from '../../hooks';
import theme from '../../theme';
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
  const [selectedTimer, setSelectedTimer] = useState(TIME_OPTIONS[0]);
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  const chatgptChat = useChat('chatgpt');
  const langBasedAppStrings = loadAppLocales();

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
      onModeChange(langBasedAppStrings.appBruteforce);
    }, 0);
  };

  const handleManualOPClick = () => {
    resetQuestion();
    handleStopTimer();
    setTimeout(() => {
      // wait for resetQuestion effect
      onModeChange(langBasedAppStrings.appOptimize);
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
              {langBasedAppStrings.appTimerDesc}
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
              <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>{answer.text}</ReactMarkdown>
              {generating && (
                <Typography
                  component='a'
                  variant='body2'
                  sx={{ color: 'red', opacity: 0.5, textDecoration: 'none !important' }}
                  onClick={(e) => {
                    e.preventDefault();
                    stopConvo();
                  }}>
                  <CancelIcon sx={{ color: 'red', opacity: 0.5 }} /> {' cancel'}
                </Typography>
              )}
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
                    <BeatLoader color='#808080' size={10} className='leading-tight' />
                  </Typography>
                </Grid>
              </Box>
            )
          )}

          {!generating ? (
            <Button
              sx={{ textTransform: 'capitalize' }}
              variant='outlined'
              size='medium'
              endIcon={<QuestionAnswer />}
              onClick={() => setStartedChat(true)}>
              {langBasedAppStrings.appLetsChat}
            </Button>
          ) : null}
          <Box ref={containerRef}></Box>
        </Box>
      ) : null}

      {startedChat === true ? <ChatPanel clientId='chatgpt' /> : null}
    </Box>
  );
};

export default Query;
