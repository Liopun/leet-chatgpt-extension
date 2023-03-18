import { Box } from '@mui/material';
import { FC } from 'react';
import { ClientId } from '../../../clients';
import { useChat } from '../../hooks';
import Chat from '../Chat';

interface Props {
  clientId: ClientId;
}

const ChatPanel: FC<Props> = (props) => {
  const { clientId } = props;
  const chat = useChat(clientId);

  return (
    <Box overflow='hidden'>
      <Chat
        clientId={clientId}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        resetConversation={chat.resetConversation}
      />
    </Box>
  );
};

export default ChatPanel;
