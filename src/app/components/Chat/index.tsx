import { Box } from '@mui/material';
import { FC, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { ClientId } from '../../../clients';
import { ChatMessageObj } from '../../../interfaces/chat';
import { CHATCLIENTS } from '../../constants';
import { ConversationContextValue } from '../../context';
import theme from '../../theme';
import Input from './Input';
import Item from './Item';
import './styles.scss';

interface Props {
  clientId: ClientId;
  messages: ChatMessageObj[];
  onUserSendMessage: (input: string, clientId: ClientId) => Promise<void>;
  resetConversation: () => void;
  generating: boolean;
  stopGenerating: () => void;
  saveChatRecord: () => void;
}

const Chat: FC<Props> = (props) => {
  const { clientId, messages, onUserSendMessage, resetConversation, generating, stopGenerating, saveChatRecord } =
    props;

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (cRef: RefObject<HTMLDivElement>) => {
    // const i: ScrollIntoViewOptions
    if (cRef.current) cRef.current.scrollTop = cRef.current.scrollHeight;
  };

  const clientInfo = CHATCLIENTS[clientId];

  const context: ConversationContextValue = useMemo(() => {
    return {
      reset: resetConversation,
    };
  }, [resetConversation]);

  const onSubmit = useCallback(
    (input: string) => {
      onUserSendMessage(input, clientId);
    },
    [props]
  );

  const resetConvo = useCallback(() => {
    if (!generating) {
      resetConversation();
    }
  }, [props]);

  useEffect(() => {
    scrollToBottom(containerRef);
  }, [messages]);

  useEffect(() => {
    if (!generating) {
      saveChatRecord();
    }
  }, [generating]);

  return (
    <Box display='flex' flex='col' flexDirection='column' height='100%'>
      <Box
        ref={containerRef}
        flex='1'
        maxHeight='560px'
        width='100%'
        display='flex'
        flexDirection='column'
        mb={theme.spacing(3)}
        mt={theme.spacing(3)}
        overflow='auto'
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
        {messages.map((message: ChatMessageObj, index: number) => index > 0 && <Item key={index} message={message} />)}

        {/* <Box ref={containerRef}></Box> */}
      </Box>
      <Input onSubmit={onSubmit} stopGenerating={stopGenerating} generating={generating} />
    </Box>
  );
};

export default Chat;
