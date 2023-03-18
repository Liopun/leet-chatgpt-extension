import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from 'react-spinners';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessageObj } from '../../../interfaces/chat';
import Bubbles from './Bubbles';
import Error from './Error';

interface Props {
  key: number;
  message: ChatMessageObj;
}

const Item: FC<Props> = (props) => {
  const { key, message } = props;
  return (
    <Box
      key={key}
      flexWrap='wrap'
      sx={{
        display: 'flex',
        justifyContent: message.author === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
      }}>
      <Paper
        elevation={3}
        sx={{
          padding: 1,
          backgroundColor: message.author === 'user' ? 'rgba(110, 118, 129, 0.5)' : 'rgba(110, 118, 129, 0.9)',
          color: 'rgba(255, 255, 255, .8)',
          borderRadius: '15px',
          borderBottomRightRadius: message.author === 'user' ? 0 : '15px',
          borderBottomLeftRadius: message.author === 'user' ? '15px' : 0,
          maxWidth: '90%',
          width: 'fit-content',
        }}>
        <Bubbles color={message.author === 'user' ? 'primary' : 'flat'}>
          {message.text ? (
            <ReactMarkdown
              className={`markdown-body markdown-custom-styles !text-base`}
              rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
              {message.text}
            </ReactMarkdown>
          ) : (
            !message.error && <BeatLoader size={10} className='leading-tight' />
          )}
          {!!message.error && <p className='text-[#e00]'>{message.error.message}</p>}
        </Bubbles>
        {!!message.error && <Error error={message.error} />}
      </Paper>
    </Box>
  );
};

export default Item;
