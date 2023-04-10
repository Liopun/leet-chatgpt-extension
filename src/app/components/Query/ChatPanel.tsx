import { Box } from '@mui/material';
import { FC } from 'react';
import { ClientId } from '../../../clients';
import { getUserCfg, updateUserCfg } from '../../../config';
import { ChatMessageObj } from '../../../interfaces/chat';
import Chat from '../Chat';

interface Props {
  clientId: ClientId;
  messages: ChatMessageObj[];
  sendMessage: (input: string) => Promise<void>;
  generating: boolean;
  stopGenerating: () => void;
  resetConversation: () => void;
}

const ChatPanel: FC<Props> = (props) => {
  const { clientId, messages, sendMessage, generating, stopGenerating, resetConversation } = props;

  const saveChatRecord = () => {
    (async () => {
      const cfg = await getUserCfg();
      const newCfg = cfg.userChats;
      newCfg[location.href] = messages;

      await updateUserCfg({
        userChats: newCfg,
      });
    })();
  };

  return (
    <Box overflow='hidden'>
      <Chat
        clientId={clientId}
        messages={messages}
        onUserSendMessage={sendMessage}
        generating={generating}
        stopGenerating={stopGenerating}
        resetConversation={resetConversation}
        saveChatRecord={saveChatRecord}
      />
    </Box>
  );
};

export default ChatPanel;
