import { FC, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logo from '../../logo.png';
import DiscordLogo from '../../assets/discord.png';
import ChromeLogo from '../../assets/chrome.png';
import GithubLogo from '../../assets/github.png';
import FirefoxLogo from '../../assets/firefox.png';
import { ACCORDION_DATA, FEATURES } from '../../constants';

const Home: FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container className='root' sx={{ minWidth: '35rem', pl: 0 }}>
      <AppBar position='static' color='transparent' sx={{ boxShadow: 'none', minWidth: '35rem' }}>
        <Toolbar variant='dense'>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              color: 'inherit',
              textDecoration: 'none',
            }}>
            <Box
              component='img'
              src={Logo}
              alt='LeetChatGPT LOGO'
              sx={{
                height: '2.5rem',
                mt: '1rem',
              }}></Box>
          </Typography>
          <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          <Box>
            <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={2}>
              <Link fontSize='1.25rem' href='https://discord.gg/eMXCyqCbdV' underline='none' color='#000'>
                <Box
                  component='img'
                  src={DiscordLogo}
                  sx={{
                    height: '1rem',
                  }}
                />
                {'  Discord'}
              </Link>
              <Link
                fontSize='1.25rem'
                href='https://github.com/Liopun/leet-chatgpt-extension'
                underline='none'
                color='#000'>
                <Box
                  component='img'
                  src={GithubLogo}
                  sx={{
                    height: '1rem',
                  }}
                />
                {'  Github'}
              </Link>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid container direction='column' justifyContent='center' alignItems='center' sx={{ p: 0, minWidth: '35rem' }}>
        <Grid item container direction='column' justifyContent='center' alignItems='center' sx={{ mt: '5rem', p: 1 }}>
          <Typography variant='h4' component='div'>
            LeetChatGPT
          </Typography>
          <Typography variant='h6' component='div' mt='1rem' color='info'>
            ChatGPT&#39;s help and guidance provided for solving leetcode/hacker-rank questions
          </Typography>
          <Stack direction='row' justifyContent='center' alignItems='center' mt='1rem' spacing={2}>
            <Button
              variant='outlined'
              color='info'
              href='https://chrome.google.com/webstore/detail/leetchatgpt/ephkkockglkjbdljoljjfdlfmgkeijek'>
              <Box
                component='img'
                src={ChromeLogo}
                sx={{
                  height: '.8rem',
                  mr: '.3rem',
                }}
              />
              {'  Add to Chrome'}
            </Button>
            <Button variant='outlined' color='info' href='https://addons.mozilla.org/en-US/firefox/addon/leetchatgpt'>
              <Box
                component='img'
                src={FirefoxLogo}
                sx={{
                  height: '.8rem',
                  mr: '.3rem',
                }}
              />
              {'Add to Firefox'}
            </Button>
          </Stack>
        </Grid>
        <Grid item sx={{ mt: '5rem' }}>
          <Box>
            <iframe
              width='560'
              height='415'
              frameBorder='0'
              src='https://www.youtube.com/embed/14u8kEaiAnk'
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen></iframe>
          </Box>
        </Grid>
        <Grid
          item
          container
          direction='column'
          width='35rem'
          justifyContent='flex-start'
          alignItems='flex-start'
          sx={{ mt: '5rem', p: 1 }}>
          <Stack direction='column' width='100%' alignItems='flex-start' spacing={1}>
            <Typography variant='h5' component='div'>
              Features{' '}
            </Typography>
            <List>
              {FEATURES.map((v, i) => (
                <ListItem key={i} sx={{ p: 0 }}>
                  <ListItemText primary={v} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          </Stack>
          <Stack
            direction='column'
            divider={<Divider orientation='horizontal' flexItem />}
            width='100%'
            alignItems='flex-start'
            spacing={2}>
            <Typography variant='h5' component='div'>
              FAQ{' '}
            </Typography>
            <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          </Stack>
          <div>
            {ACCORDION_DATA.map((v) => (
              <Accordion
                key={v.id}
                sx={{
                  borderBottom: '.1rem solid rgb(0, 0, 0, .15)',
                  borderRadius: '0px !important',
                  boxShadow: 'none',
                }}
                expanded={expanded === v.id}
                onChange={handleChange(v.id)}
                disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls='panel-chatgpt-content'
                  id={v.id}
                  sx={{ pl: 0, pr: 0 }}>
                  <Typography variant='h5'>{v.title}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pl: 0, pr: 0 }}>
                  <Typography textAlign='left' fontSize='1.1rem'>
                    {v.body}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Grid>
      </Grid>
      <Box sx={{ p: 1, minWidth: '35rem' }}>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={2}
          sx={{ mt: '5rem', color: '#000' }}
          width='100%'>
          <Typography
            textAlign='left'
            fontSize='1.25rem'
            component='a'
            sx={{ textDecoration: 'none', color: '#000' }}
            href='mailto: leetchatgpt@gmail.com'>
            Contact: hcaptone.dev@gmail.com
          </Typography>
          <Typography textAlign='left' fontSize='1.25rem'>
            © {new Date().getFullYear()}, LeetChatGPT
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
