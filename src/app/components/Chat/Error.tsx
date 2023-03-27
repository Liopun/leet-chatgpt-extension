import { Box, Button, Link } from '@mui/material';
import { FC, useContext } from 'react';
import { loadAppLocales } from '../../../utils/common';
import { ClientError, ErrorCode } from '../../../utils/errors';
import { ConversationContext } from '../../context';

const langBasedAppStrings = loadAppLocales();

const ChatGPTAuthErrorAction = () => {
  return (
    <Box alignItems='center' flexDirection='row'>
      <Button color='primary' size='small'>
        {langBasedAppStrings.appAuthLogin}
      </Button>
      <span className='text-sm'>{langBasedAppStrings.appOr}</span>
      <Link href='options.html'>
        <Button color='primary' size='small'>
          {langBasedAppStrings.appAuthSetApiKey}
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
        {langBasedAppStrings.appReset}
      </Button>
    );
  }

  return null;
};

export default Error;
