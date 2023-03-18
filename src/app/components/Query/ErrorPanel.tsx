import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Link, Stack, Typography } from '@mui/material';
import { FC, useCallback } from 'react';
import Browser from 'webextension-polyfill';
import { isBraveBrowser } from '../../../utils/common';
import { ClientError, ErrorCode } from '../../../utils/errors';

interface AuthProps {
  retries: number;
  error: ClientError;
}

const ErrorPanel: FC<AuthProps> = (props) => {
  const { retries, error } = props;

  const openWebPage = useCallback(() => {
    Browser.tabs.create({ url: 'options.html' });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '2rem',
        width: '100%',
      }}>
      {error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED ? (
        <Typography variant='body1' paragraph>
          Please login and pass Cloudflare check at{' '}
          <Link
            href='https://chat.openai.com'
            underline='none'
            target='_blank'
            rel='noreferrer'
            sx={{
              color: '#75A99C',
              ':hover': {
                color: '#75A99C !important',
              },
            }}>
            chat.openai.com
          </Link>
          {retries > 0 &&
            (() => {
              return isBraveBrowser() ? (
                <Typography mt={2} variant='body2'>
                  Still not working? Follow{' '}
                  <a href='https://github.com/liopun/leet-gpt-extension#troubleshooting'>Brave Troubleshooting</a>
                </Typography>
              ) : (
                <Typography mt={2} variant='body2' className='italic block mt-2 text-xs'>
                  OpenAI requires passing a security. If this annoys you, change AI provider to OpenAI API in the
                  extension options.
                </Typography>
              );
            })()}
        </Typography>
      ) : (
        <Stack direction='row' justifyContent='space-around' alignItems='center' spacing={1}>
          <Typography variant='body1' paragraph>
            `{error.name}:{error.message}`
          </Typography>
          <IconButton onClick={() => openWebPage()} sx={{ p: 0 }}>
            <SettingsIcon style={{ fontSize: '1.5rem', color: '#75A99C' }} />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default ErrorPanel;
