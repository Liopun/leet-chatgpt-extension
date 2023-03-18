import { Box, Button, Link } from '@mui/material';
import { FC, useContext } from 'react';
import { ClientError, ErrorCode } from '../../../utils/errors';
import { ConversationContext } from '../../context';

const ChatGPTAuthErrorAction = () => {
  return (
    <Box alignItems='center' flexDirection='row'>
      <Button color='primary' size='small'>
        Login & verify
      </Button>
      <span className='text-sm'>OR</span>
      <Link href='options.html'>
        <Button color='primary' size='small'>
          Set api key
        </Button>
      </Link>
    </Box>
  );
};

const Error: FC<{ error: ClientError }> = ({ error }) => {
  const conversation = useContext(ConversationContext);

  if (error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED) {
    return <ChatGPTAuthErrorAction />;
  }

  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return (
      <Button color='primary' size='small' onClick={() => conversation?.reset()}>
        Reset
      </Button>
    );
  }

  return null;
};

export default Error;
