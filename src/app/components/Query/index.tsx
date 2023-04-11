import { QuestionAnswer, SaveOutlined } from '@mui/icons-material';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Fab, Grid, SelectChangeEvent, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from 'react-spinners';
import rehypeHighlight from 'rehype-highlight';
import Browser from 'webextension-polyfill';
import { getUserCfg, updateUserCfg, UserCfg } from '../../../config';
import { ChatMessageObj } from '../../../interfaces/chat';
import { ClientError } from '../../../utils/errors';
import { loadAppLocales } from '../../../utils/locales';
import { addStreak } from '../../../utils/streak';
import { TIME_OPTIONS } from '../../constants';
import { useChat } from '../../hooks';
import theme from '../../theme';
import ChatPanel from './ChatPanel';
import ErrorPanel from './ErrorPanel';
import NavBar from './NavBar';

interface Props {
  question: string;
  topics: string[];
  submitElement: Element;
  onModeChange: (mode?: string) => void;
  resetQuestion: () => void;
}

const Query: FC<Props> = (props) => {
  const { question, topics, submitElement, onModeChange, resetQuestion } = props;
  const [answer, setAnswer] = useState<ChatMessageObj | null>(null);
  const [error, setError] = useState<ClientError | null>(null);
  const [userConfig, setUserConfig] = useState<UserCfg | null>(null);
  const [streakCount, setStreakCount] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [startedChat, setStartedChat] = useState(false);
  const [isAddingStreak, setIsAddingStreak] = useState(true);
  const [renderFab, setRenderFab] = useState(true);

  const [chatSaved, setChatSaved] = useState(false);

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

  const openWebPage = useCallback(() => {
    Browser.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
  }, []);

  const oneTimeUseAI = () => {
    setError(null);
    setIsAddingStreak(true);
    resetConvo();
    chatgptChat.sendMessage(question);
  };

  const getUserConfig = () => {
    getUserCfg().then((config) => {
      setUserConfig(config);
    });
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
    setError(null);
    setShowAnswer(false);
    setStartedChat(false);
    setTimerInProgress(`${selectedTimer.split(' ')[0]}:00`);
  };

  const handleStopTimer = () => {
    setTimerStarted(false);
    setMinimized(false);
    setAnswer(null);
    setShowAnswer(false);
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

  const submitButtonHandler = useCallback(() => {
    (async () => {
      setMinimized(true);
      await addStreak(topics);
      getUserConfig();
    })();
  }, [topics]);

  const saveChatRecord = () => {
    (async () => {
      const cfg = await getUserCfg();
      const newCfg = cfg.userChats;
      newCfg[location.href] = chatgptChat.messages;

      await updateUserCfg({
        userChats: newCfg,
      });
      setChatSaved(true);
    })();
  };

  useEffect(() => {
    if (question.length > 10) oneTimeUseAI();
    getUserConfig();
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
        scrollToBottom(containerRef);
      }
    }
  }, [chatgptChat.messages]);

  useEffect(() => {
    if (answer && showAnswer && !startedChat && !minimized) scrollToBottom(containerRef);
  }, [generating]);

  useEffect(() => {
    if (timeStarted) {
      timerCountDown(parseInt(selectedTimer.split(' ')[0], 10) * 60);
    } else {
      if (timerId !== undefined) {
        handleStopTimer();
      }
    }
  }, [timeStarted]);

  useEffect(() => {
    if (chatSaved) setTimeout(() => setChatSaved(false), 1500);
  }, [chatSaved]);

  useEffect(() => {
    if (userConfig) {
      setStreakCount(`${userConfig.userStats.length}`);
    }
  }, [userConfig]);

  useEffect(() => {
    if (submitElement) {
      submitElement.addEventListener('click', submitButtonHandler);
    }

    // Remove event listener when component unmounts
    return () => {
      submitElement.removeEventListener('click', submitButtonHandler);
    };
  }, [submitElement, submitButtonHandler]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar
        selectedTimer={selectedTimer}
        timeStarted={timeStarted}
        disableManuals={generating}
        minimized={minimized}
        showAnswer={showAnswer}
        streakCount={streakCount}
        handleTimerSelect={handleTimerSelect}
        options={TIME_OPTIONS}
        handleTimerStart={handleTimerStart}
        handleStopTimer={handleStopTimer}
        handleManualBRClick={handleManualBRClick}
        handleManualOPClick={handleManualOPClick}
        handleMinimizeClick={handleMinimizeClick}
        openOptions={openWebPage}
      />

      {error && !startedChat && !minimized ? <ErrorPanel error={error} openOptions={openWebPage} /> : null}
      {(!answer && !error && timeStarted && !minimized) === true ? (
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

      {answer && !error && showAnswer && !startedChat && !minimized ? (
        <Box
          className='markdown-body gpt-markdown'
          id='gpt-answer'
          sx={{
            scrollbarWidth: 'thin',
            scrollBehavior: 'auto',
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
                <Zoom in={renderFab} style={{ transitionDelay: renderFab ? '20ms' : '0ms' }}>
                  <Fab
                    size='small'
                    color='info'
                    aria-label='stop-answer'
                    onClick={(e) => {
                      e.preventDefault();
                      stopConvo();
                    }}>
                    <StopIcon />
                  </Fab>
                </Zoom>
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
            <Stack
              direction='row'
              justifyContent='flex-end'
              alignItems='flex-end'
              spacing={3}
              sx={{ width: '100%', padding: 1, paddingLeft: 2 }}>
              <Zoom in={renderFab} style={{ transitionDelay: renderFab ? '200ms' : '0ms' }}>
                <Fab
                  size='small'
                  color='primary'
                  aria-label='lets-chat'
                  variant='extended'
                  onClick={() => setStartedChat(true)}
                  sx={{
                    textTransform: 'capitalize',
                  }}>
                  <QuestionAnswer />
                  &nbsp;&nbsp;{langBasedAppStrings.appLetsChat}&nbsp;&nbsp;
                </Fab>
              </Zoom>

              <Zoom in={renderFab} style={{ transitionDelay: renderFab ? '300ms' : '0ms' }}>
                <Fab size='small' color='info' aria-label='save-chat' onClick={() => saveChatRecord()}>
                  <Tooltip open={chatSaved} title={langBasedAppStrings.appChatSave}>
                    <SaveOutlined />
                  </Tooltip>
                </Fab>
              </Zoom>
            </Stack>
          ) : null}
          <Box ref={containerRef}></Box>
        </Box>
      ) : null}

      {startedChat === true && !minimized ? (
        <ChatPanel
          clientId='chatgpt'
          messages={chatgptChat.messages}
          sendMessage={chatgptChat.sendMessage}
          generating={chatgptChat.generating}
          stopGenerating={chatgptChat.stopGenerating}
          resetConversation={chatgptChat.resetConversation}
        />
      ) : null}
    </Box>
  );
};

export default Query;
