import SettingsIcon from '@mui/icons-material/Settings';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { FC, useCallback } from 'react';
import Browser from 'webextension-polyfill';

import './styles.scss';

import Logo from '../../assets/logo.png';

const Popup: FC = () => {
  const openWebPage = useCallback(() => {
    Browser.runtime.sendMessage({ action: 'OPEN_OPTIONS' });
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' color='transparent'>
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
              ChatGPT for LeetCode
            </Typography>
            <IconButton onClick={() => openWebPage()} sx={{ p: 0 }}>
              <SettingsIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      {(() => {
        const elem = <iframe height='272px' width='400px' title='Authenticated' src='https://chat.openai.com' />;
        return (
          <Box
            component='p'
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '17rem',
              width: '100%',
              fontSize: '1rem',
              textAlign: 'center',
              padding: 0,
            }}>
            {elem}
          </Box>
        );
      })()}
    </>
  );
};

export default Popup;
