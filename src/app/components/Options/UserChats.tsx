import { DeleteForeverOutlined, PersonOutline } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { FC, memo, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ViewportList } from 'react-viewport-list';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import supersub from 'remark-supersub';
import { ChatMessageObj } from '../../../interfaces/chat';

interface UserChatsProps {
  key: string;
  getMessages: () => ChatMessageObj[];
  deleteChatItem: (index: number) => void;
}

const Timestamp = memo((props: { index: number; timestamp: number; onDelete: (index: number) => void }) => {
  const serializeTimestamp = () => {
    const date = new Date(props.timestamp);
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${dayOfWeek} ${month}/${dayOfMonth}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <Typography sx={{ p: '1 2', w: '100%' }} variant='body2'>
      {serializeTimestamp()}
      <IconButton aria-label='delete' onClick={(e) => props.onDelete(props.index)} sx={{ ml: 1, mt: -1 }}>
        <DeleteForeverOutlined />
      </IconButton>
    </Typography>
  );
});

Timestamp.displayName = 'Timestamp';

const UserChats: FC<UserChatsProps> = (props) => {
  const { key, getMessages, deleteChatItem } = props;
  const [data, setData] = useState([] as ChatMessageObj[]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setData(getMessages);
  }, [key, data]);

  return (
    <Box className='list' ref={ref} sx={{ p: 0 }}>
      <ViewportList viewportRef={ref} items={data} initialAlignToTop={true} initialIndex={data.length}>
        {(item, index) => (
          <Box
            p={1}
            key={index}
            sx={{ backgroundColor: item.author === 'user' ? 'rgba(248, 159, 27, .2)' : 'rgba(117, 169, 156, .2)' }}>
            <Box p={1} textAlign='center' key={item.timestamp}>
              <Timestamp index={index} timestamp={item.timestamp} onDelete={deleteChatItem} />
            </Box>

            <Box p={1}>
              <Stack direction='row' spacing={1} mb={1}>
                <PersonOutline fontSize='small' />
                <Typography textTransform='uppercase' variant='body2' sx={{ pt: 0.2 }}>
                  {item.author}
                </Typography>
              </Stack>
              <ReactMarkdown
                className={`markdown-body markdown-userchats-styles !text-base`}
                remarkPlugins={[supersub, remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}>
                {item.text}
              </ReactMarkdown>
            </Box>
          </Box>
        )}
      </ViewportList>
    </Box>
  );
};

export default UserChats;
