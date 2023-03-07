import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';

import Logo from '../../assets/logo.png';
import { getClientCfgs, setClientCfgs } from '../../background/client';
import { ClientType } from '../../interfaces';
import './styles.scss';
import TabPanel from './TabPanel';
const a11yProps = (index: number) => {
  return {
    id: `ai-client-tab-${index}`,
    'aria-controls': `ai-client-tab-panel-${index}`,
  };
};

const clientSchema = object({
  model: string().trim().min(1, 'Model is required'),
  apiKey: string().trim().min(1, 'ApiKey is required'),
});

type IClientSchema = TypeOf<typeof clientSchema>;

const Options: FC = () => {
  const modelList = ['text-davinci-003'];
  const [tabsValue, setTabsValue] = useState(1);
  const [clientMode, setClientMode] = useState(ClientType.ChatGPT);

  useEffect(() => {
    getClientCfgs().then((config) => {
      setClientMode(config.client);
      setTabsValue(config.client === ClientType.GPT3 ? 1 : 0);
    });
  }, []);

  const defaultValues: IClientSchema = {
    model: modelList[0],
    apiKey: '',
  };

  // useForm hook object
  const methods = useForm<IClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => setTabsValue(newValue);

  const handleClientModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      setClientCfgs(ClientType.ChatGPT, {
        [ClientType.GPT3]: {
          model: '',
          apiKey: '',
        },
      });
    }
    setClientMode(event.target.checked ? ClientType.GPT3 : ClientType.ChatGPT);
    setTabsValue(event.target.checked ? 1 : 0);
  };

  const onSubmitHandler: SubmitHandler<IClientSchema> = async (values: IClientSchema) => {
    const opts = clientSchema.parse(values);
    await setClientCfgs(ClientType.GPT3, {
      [ClientType.GPT3]: {
        model: opts.model,
        apiKey: opts.apiKey,
      },
    });
    alert('Changes saved');
  };

  return (
    <Container>
      <AppBar position='static' color='transparent' sx={{ boxShadow: 'none' }}>
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
            <Stack direction='row' justifyContent='flex-end' alignItems='flex-start' spacing={2}>
              <Box
                component='img'
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={Logo}
                alt='LeetChatGPT LOGO'
                sx={{
                  height: '2.5rem',
                  mt: '1rem',
                }}
              />
              <Typography component='div'>
                <Typography fontWeight='bold' fontSize='1.25rem' marginTop='1rem'>
                  LeetChatGPT
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          <Box>
            <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={2}>
              <Link fontSize='1.25rem' href='#' underline='none' color='#000'>
                {'Releases'}
              </Link>
              <Link fontSize='1.25rem' href='#' underline='none' color='#000'>
                {'Feedback'}
              </Link>
              <Link fontSize='1.25rem' href='#' underline='none' color='#000'>
                {'Twitter'}
              </Link>
              <Link fontSize='1.25rem' href='#' underline='none' color='#000'>
                {'Github'}
              </Link>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Grid container direction='column' justifyContent='center' alignItems='center'>
        <Grid
          item
          container
          direction='column'
          width='35rem'
          justifyContent='flex-start'
          alignItems='flex-start'
          sx={{ mt: '5rem' }}>
          <Stack direction='column' width='100%' alignItems='flex-start' spacing={2}>
            <Typography variant='h4' component='div'>
              Options
            </Typography>
            <Typography variant='h6' component='div' mt='1rem' color='info'>
              AI Client
            </Typography>
          </Stack>

          <Stack direction='row' spacing={1} alignItems='center'>
            <Typography textTransform='uppercase'>{ClientType.ChatGPT}</Typography>
            <Switch
              checked={clientMode === ClientType.GPT3}
              onChange={handleClientModeChange}
              inputProps={{ 'aria-label': 'active-client' }}
            />
            <Typography textTransform='uppercase'>{ClientType.GPT3}</Typography>
          </Stack>

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'transparent',
              display: 'flex',
              height: '20rem',
              width: '100%',
              border: '.01rem solid #808080',
            }}>
            <Tabs
              orientation='vertical'
              variant='fullWidth'
              value={tabsValue}
              onChange={handleTabsChange}
              aria-label='ai-client'
              sx={{
                borderRight: 1,
                borderColor: 'divider',
              }}
              indicatorColor='primary'>
              <Tab color='#000' label='ChatGPT' {...a11yProps(0)} />
              <Tab label='Open AI' {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={tabsValue} index={0}>
              Default choice
              <Typography variant='h6' component='div' mt='1rem' color='info'>
                Free to use but unstable from time to time.
              </Typography>
            </TabPanel>
            <TabPanel value={tabsValue} index={1}>
              <FormProvider {...methods}>
                OpenAI official API (GPT-3), more stable, charge by usage
                <Box
                  component='form'
                  sx={{
                    '& > :not(style)': { m: 1, width: '11rem' },
                  }}
                  noValidate
                  autoComplete='off'>
                  <FormControl variant='standard'>
                    <InputLabel id='model-select-label'>Model</InputLabel>
                    <Select labelId='model-select-label' id='model' label='model' {...methods.register('model')}>
                      {modelList.map((v) => (
                        <MenuItem key={v} value={v}>
                          {v}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField id='apikey' label='API Key' variant='standard' {...methods.register('apiKey')} />
                  <Typography variant='subtitle2' component='div' mt='.05rem' color='info' style={{ width: '100%' }}>
                    Don&#39;t kow how to get your API key?
                    <Typography
                      variant='subtitle2'
                      component='a'
                      href='https://platform.openai.com/account/api-keys'
                      sx={{
                        textDecoration: 'none',
                      }}
                      color='primary'>
                      {' Learn more'}
                    </Typography>
                  </Typography>
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    spacing={2}
                    style={{ width: '100%', margin: 1 }}>
                    <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
                    <Button
                      variant='contained'
                      size='medium'
                      sx={{ color: '#fff' }}
                      onClick={(...args) => void methods.handleSubmit(onSubmitHandler)(...args)}>
                      Save
                    </Button>
                  </Stack>
                </Box>
                {/* <FormControl sx={{ mt: '.5rem' }}>
                                    <FormLabel sx={{ fontSize: '1rem', color:'#000' }} id="guide-radio-buttons-group">GPT-3 Prompt Guide</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="guide-radio-buttons-group"
                                        name="guide-radio-buttons-group"
                                        value={gptGuide}
                                        onChange={handleGptGuideChange}
                                    >
                                        <FormControlLabel value="dpg" control={<Radio />} label="Default Prompt Guide" />
                                        <FormControlLabel value="spg" control={<Radio />} label="Simple Prompt Guide" />
                                    </RadioGroup>
                                </FormControl> */}
              </FormProvider>
            </TabPanel>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Options;
