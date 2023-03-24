import SettingsIcon from '@mui/icons-material/Settings';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Fab, Grid, Stack, Zoom } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import Browser from 'webextension-polyfill';

import './styles.scss';

import { BeatLoader } from 'react-spinners';
import { ChatMessageObj } from '../../../interfaces/chat';
import { formatTopicQuery } from '../../../utils/common';
import { ClientError } from '../../../utils/errors';
import Logo from '../../assets/logo.png';
import { TOPICS } from '../../constants';
import { useChat } from '../../hooks';

const Popup: FC = () => {
  const [renderFab, setRenderFab] = useState(true);
  const [topicAnswer, setTopicAnswer] = useState<ChatMessageObj | null>(null);
  const [error, setError] = useState<ClientError | null>(null);
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[Math.floor(Math.random() * TOPICS.length)]);

  const chatgptChat = useChat('chatgpt');

  const openWebPage = useCallback(() => {
    Browser.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
  }, []);

  const generating = useMemo(() => chatgptChat.generating, [chatgptChat.generating]);

  const resetConvo = useCallback(() => {
    if (!chatgptChat.generating) chatgptChat.resetConversation();
  }, [chatgptChat.resetConversation]);

  useEffect(() => {
    if (selectedTopic) {
      setSubmittedQuestion('');
      setError(null);
      resetConvo();
      const question = formatTopicQuery(selectedTopic);
      chatgptChat.sendMessage(question);
      setSubmittedQuestion(question);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (chatgptChat.messages.length > 1) {
      const curr = chatgptChat.messages[1];

      if (curr.error) {
        setError(curr.error);
        return;
      }

      if (curr.text !== submittedQuestion) {
        // ignore input_question echoing
        setTopicAnswer(curr);
      }
    }
  }, [chatgptChat.messages]);

  return (
    <>
      <Box sx={{ flexGrow: 1, width: '350px', backgroundColor: '#0C0F15' }}>
        <AppBar position='static' sx={{ backgroundColor: '#0C0F15' }}>
          <Toolbar variant='dense'>
            <Box
              component='img'
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              src={Logo}
              alt='LeetGPT LOGO'
              sx={{
                mr: 0.5,
                height: '25px',
              }}
            />
            <Typography variant='body2' component='div' sx={{ flexGrow: 1 }}>
              LeetChatGPT
            </Typography>
            <IconButton onClick={() => openWebPage()} sx={{ p: 0 }}>
              <SettingsIcon style={{ fontSize: '1.5rem', color: '#808080' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: '20px', color: 'rgba(255,255,255, .8)' }}>
          <Typography variant='body2' component='div' textAlign='center'>
            {error && !generating ? error.message : null}
          </Typography>
          {topicAnswer && topicAnswer.text && topicAnswer.text.length > 0 ? (
            <Typography variant='body2' component='div' textAlign='left'>
              {topicAnswer.text}
            </Typography>
          ) : (
            topicAnswer &&
            !topicAnswer.error &&
            generating && (
              <Typography variant='body2' component='div' textAlign='center'>
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
              </Typography>
            )
          )}
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            spacing={2}
            style={{ width: '100%' }}>
            <Zoom in={renderFab} style={{ transitionDelay: renderFab ? '200ms' : '0ms' }}>
              <Fab
                variant='extended'
                size='small'
                sx={{
                  backgroundColor: 'rgb(248, 159, 27, .5)',
                  textTransform: 'capitalize',
                  color: '#fff',
                  mt: '20px',
                  '&:hover': {
                    bgcolor: 'rgb(248, 159, 27, .7)',
                  },
                  '&:disabled': {
                    bgcolor: 'rgb(248, 159, 27, .3)',
                    color: 'rgb(255, 255, 255, .5)',
                  },
                }}
                aria-label='shuffle'
                disabled={generating}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
                }}>
                <ShuffleIcon sx={{ fontSize: '20px' }} /> Shuffle
              </Fab>
            </Zoom>
            <Zoom in={renderFab} style={{ transitionDelay: renderFab ? '200ms' : '0ms' }}>
              <Typography component='div' variant='caption' display='inline' pt='13px' textTransform='uppercase'>
                {selectedTopic}
              </Typography>
            </Zoom>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default Popup;
