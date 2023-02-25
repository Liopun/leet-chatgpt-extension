import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SettingsIcon from '@mui/icons-material/Settings';
import { FC } from "react";
import browser, { Tabs } from "webextension-polyfill";
import useSWR from 'swr'

import "./styles.scss";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";

import Logo from "../assets/logo.png";
import Container from '@mui/material/Container';

function openWebPage(url: string): Promise<Tabs.Tab> {
    return browser.tabs.create({url});
}

// const accessTokenQuery = useSWR(
//   'accessToken',
//   () => browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
//   { shouldRetryOnError: false },
// )

const Popup: FC = () => {
    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="transparent">
            <Toolbar variant="dense">
              <Box
                component="img"
                src={Logo}
                alt="LeetGPT LOGO"
                sx={{
                  mr: .5,
                  height: '25px'
                }}
              />
              <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
                ChatGPT for LeetCode
              </Typography>
              <IconButton onClick={(): Promise<Tabs.Tab> => {
                  return openWebPage('options.html');
                }} sx={{ p: 0 }}>
                  <SettingsIcon style={{ fontSize: '1.5rem' }} />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        {(() => {
            let elem
            if(false) {
                elem = <CircularProgress size='2rem' sx={{ color: '#808080' }} />
            } else if(true) {
                elem = <iframe title='Authenticated' src="https://chat.openai.com" />
            } else {
                elem = <Box>
                    Please login and pass Cloudflare check at {' '}
                    <Link href="https://chat.openai.com" underline="none" target="_blank" rel="noreferrer">chat.openai.com</Link>
                </Box>
            }

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
                        textAlign: 'center'
                    }}
                >
                    {elem}
                </Box>
            )
        })()}
      </>
      // <section id="popup" style={{ width: "200px" }}>
      //   <h2>LeetGPT</h2>
      //   <button
      //     id="options__button"
      //     type="button"
      //     onClick={(): Promise<Tabs.Tab> => {
      //       return openWebPage('options.html');
      //     }}
      //   >
      //     Options Page
      //   </button>
      //   <div className="links__holder">
      //     <ul>
      //       <li>
      //         <button
      //           type="button"
      //           onClick={(): Promise<Tabs.Tab> => {
      //             return openWebPage(
      //               'https://github.com/abhijithvijayan/web-extension-starter'
      //             );
      //           }}
      //         >
      //           GitHub
      //         </button>
      //       </li>
      //       <li>
      //         <button
      //           type="button"
      //           onClick={(): Promise<Tabs.Tab> => {
      //             return openWebPage(
      //               'https://www.buymeacoffee.com/abhijithvijayan'
      //             );
      //           }}
      //         >
      //           Buy Me A Coffee
      //         </button>
      //       </li>
      //     </ul>
      //   </div>
      // </section>
    );
};
  
export default Popup;