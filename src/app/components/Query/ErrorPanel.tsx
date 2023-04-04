import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, Link, Stack, Typography } from '@mui/material';
import { FC, useCallback } from 'react';
import Browser from 'webextension-polyfill';
import { isBraveBrowser } from '../../../utils/common';
import { ClientError, ErrorCode } from '../../../utils/errors';
import { loadAppLocales } from '../../../utils/locales';

interface AuthProps {
  error: ClientError;
}

const ErrorPanel: FC<AuthProps> = (props) => {
  const { error } = props;
  const langBasedAppStrings = loadAppLocales();

  const openWebPage = useCallback(() => {
    Browser.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
  }, []);

  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '2rem',
        mt: '1rem',
        width: '100%',
      }}>
      {error.code === ErrorCode.CHATGPT_CLOUDFLARE || error.code === ErrorCode.CHATGPT_UNAUTHORIZED ? (
        <Typography variant='body1' paragraph>
          {langBasedAppStrings.appErrCloudflare}{' '}
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
          {error.message.length > 0 &&
            (() => {
              return isBraveBrowser() ? (
                <Typography mt={2} variant='body2'>
                  {langBasedAppStrings.appErrBraveNotWorking}{' '}
                  <a href='https://github.com/liopun/leet-gpt-extension#troubleshooting'>
                    {langBasedAppStrings.appErrBraveTroubleshoot}
                  </a>
                </Typography>
              ) : null;
            })()}
        </Typography>
      ) : (
        <Stack direction='row' justifyContent='space-around' alignItems='center' spacing={1}>
          <Typography variant='body1' component='div'>
            {error.message}
          </Typography>
          <IconButton onClick={() => reloadPage()} sx={{ p: 0 }}>
            <RefreshIcon style={{ fontSize: '1.5rem', color: '#75A99C' }} />
          </IconButton>
          <IconButton onClick={() => openWebPage()} sx={{ p: 0 }}>
            <SettingsIcon style={{ fontSize: '1.5rem', color: '#75A99C' }} />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default ErrorPanel;
