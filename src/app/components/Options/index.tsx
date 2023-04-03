import { zodResolver } from '@hookform/resolvers/zod';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GitHubIcon from '@mui/icons-material/GitHub';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TwitterIcon from '@mui/icons-material/Twitter';
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
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { array, object, string, TypeOf } from 'zod';

import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { getUserCfg, invalidateUserCfgToken, updateUserCfg, UserCfg } from '../../../config';
import { ClientType } from '../../../interfaces';
import { getAppVersion, loadAppLocales } from '../../../utils/common';
import Logo from '../../assets/logo.png';
import { CHATGPT_API_MODELS, WEEK_DAYS } from '../../constants';
import { MenuProps } from '../../styles/controls/cssSelectField';
import FormMultiSelect from '../FormMultiSelect';
import CalendarPanel from './CalendarPanel';
import './styles.scss';
import TabPanel from './TabPanel';

const a11yProps = (index: number) => {
  return {
    id: `ai-client-tab-${index}`,
    'aria-controls': `ai-client-tab-panel-${index}`,
  };
};

const clientSchema = object({
  apiKey: string().trim().min(1, 'ApiKey is required'),
  apiModel: string().trim().min(1, 'ApiModel is required'),
  apiHost: string().trim().min(1, 'ApiKey is required'),
  clientMode: string(),
  reminder: string(),
  streakDays: array(string()),
});

type IClientSchema = TypeOf<typeof clientSchema>;

const Options: FC = () => {
  const [tabsValue, setTabsValue] = useState(0);
  const [configChanged, setConfigChanged] = useState(false);
  const [streakConfigured, setStreakConfigured] = useState(false);
  const [userConfig, setUserConfig] = useState<UserCfg | null>(null);
  const [reminderValue, setReminderValue] = useState<Dayjs | null>(null);
  const [clientSwitcher, setClientSwitcher] = useState<ClientType>(ClientType.ChatGPT);

  const defaultValues: IClientSchema = {
    apiKey: '',
    apiModel: '',
    apiHost: '',
    clientMode: '',
    reminder: '',
    streakDays: [],
  };

  const langBasedAppStrings = loadAppLocales();

  // useForm hook object
  const methods = useForm<IClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues,
  });

  const getUserConfig = () => {
    getUserCfg().then((config) => {
      setClientSwitcher(config.clientMode);
      console.debug('INIT:::', config);
      setUserConfig(config);
    });
  };

  const handleTabsChange = (event: React.SyntheticEvent, newValue: number) => setTabsValue(newValue);

  const handleDaysClose = useCallback(
    (event: React.SyntheticEvent<Element, Event>) => {
      (async () => {
        const daysArr = methods.getValues().streakDays;
        setStreakConfigured(daysArr.length > 0);
        await updateUserCfg({
          userDays: daysArr,
          userReminder: reminderValue!.format('HH:mm'),
        });
        setConfigChanged(true);
      })();
    },
    [methods, reminderValue]
  );

  const handleReminderChange = useCallback(
    async (d: Dayjs | null) => {
      if (d && methods.getValues().streakDays.length > 0) {
        await updateUserCfg({
          userReminder: reminderValue!.format('HH:mm'),
          userDays: methods.getValues().streakDays,
        });
        setConfigChanged(true);
      }
    },
    [methods, reminderValue]
  );

  const handleClientModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      invalidateUserCfgToken('openaiApiKey');
      updateUserCfg({ clientMode: ClientType.ChatGPT });
      setConfigChanged(true);
      return;
    }
    setClientSwitcher(ClientType.ChatGPTPlus);
    setTabsValue(1);
  };

  const onSubmitHandler: SubmitHandler<IClientSchema> = async (values: IClientSchema) => {
    const opts = clientSchema.parse(values);
    await updateUserCfg({
      openaiApiKey: opts.apiKey,
      openaiApiHost: opts.apiHost,
      openaiApiModel: opts.apiModel,
      clientMode: ClientType.ChatGPTPlus,
    });
    alert('Changes saved');
    setConfigChanged(true);
  };

  useEffect(() => {
    getUserConfig();
    if (configChanged) {
      setConfigChanged(false);
      return;
    }
  }, [configChanged]);

  useEffect(() => {
    if (userConfig) {
      methods.setValue('apiKey', userConfig.openaiApiKey);
      methods.setValue('apiHost', userConfig.openaiApiHost);
      methods.setValue('apiModel', userConfig.openaiApiModel);
      methods.setValue('reminder', userConfig.userReminder);
      methods.setValue('streakDays', userConfig.userDays);
      methods.setValue('clientMode', userConfig.clientMode);

      if (userConfig.userReminder.length > 1) {
        setReminderValue(dayjs(userConfig.userReminder, 'HH:mm'));
      }

      setTabsValue(userConfig.clientMode === ClientType.ChatGPTPlus ? 1 : 0);
    }
  }, [userConfig]);

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
                  {langBasedAppStrings.appName} {getAppVersion()}
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          <Box>
            <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={2}>
              <Link
                fontSize='1.25rem'
                href='https://github.com/Liopun/leet-chatgpt-extension/releases'
                underline='none'
                color='#000'>
                <NewReleasesIcon />
              </Link>
              <Link
                fontSize='1.25rem'
                href='https://github.com/Liopun/leet-chatgpt-extension/issues'
                underline='none'
                color='#000'>
                <FeedbackIcon />
              </Link>
              <Link fontSize='1.25rem' href='https://twitter.com/liopun' underline='none' color='#000'>
                <TwitterIcon />
              </Link>
              <Link
                fontSize='1.25rem'
                href='https://github.com/Liopun/leet-chatgpt-extension'
                underline='none'
                color='#000'>
                <GitHubIcon />
              </Link>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <FormProvider {...methods}>
        <Grid container direction='column' spacing={1} justifyContent='center' alignItems='center'>
          <Grid
            item
            container
            direction='column'
            width='720px'
            justifyContent='flex-start'
            alignItems='flex-start'
            sx={{ mt: '5rem' }}>
            <Stack direction='column' alignItems='flex-start' spacing={2}>
              <Typography variant='h4' component='div'>
                Streak{/* {langBasedAppStrings.appOptions} */}
              </Typography>
              <Typography variant='h6' component='div' mt='1rem' color='info'>
                You are the artist of your own success, and each problem you solve is a stroke of your brush. So keep
                pushing yourself, and keep creating the future that you desire. The possibilities are endless!
                {/* {langBasedAppStrings.appAIClient} */}
              </Typography>
            </Stack>
            <Box
              flexDirection='column'
              sx={{
                flexGrow: 1,
                bgcolor: 'transparent',
                display: 'flex',
                minHeight: '20rem',
                width: '100%',
                pt: '2rem',
              }}>
              <Stack component='form' direction='row' sx={{ width: '100%' }} alignItems='flex-start' spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    label='Remind me at'
                    value={reminderValue}
                    onChange={(v) => setReminderValue(v)}
                    onAccept={(d) => {
                      handleReminderChange(d);
                    }}
                    renderInput={(params) => <TextField {...params} label='Select Time' variant='outlined' />}
                  />
                </LocalizationProvider>
                <FormMultiSelect
                  label='Streak days'
                  name='streakDays'
                  onClose={handleDaysClose}
                  theme={useTheme()}
                  data={WEEK_DAYS}
                  MenuProps={MenuProps}
                  width='620px !important'
                  selectedDays={userConfig?.userDays.length}
                />
              </Stack>
              {(streakConfigured ||
                (userConfig && userConfig?.userDays.length > 0) ||
                (userConfig && userConfig?.userStats.length > 0)) && (
                <Stack component='form' direction='row' sx={{ width: '100%' }}>
                  <CalendarPanel data={userConfig!.userStats} />
                </Stack>
              )}
            </Box>
          </Grid>
          <Grid item container direction='column' width='720px' justifyContent='flex-start' alignItems='flex-start'>
            <Stack direction='column' width='100%' alignItems='flex-start' spacing={2}>
              <Typography variant='h4' component='div'>
                {langBasedAppStrings.appOptions}
              </Typography>
              <Typography variant='h6' component='div' mt='1rem' color='info'>
                {langBasedAppStrings.appAIClient}
              </Typography>
            </Stack>

            <Stack direction='row' spacing={1} alignItems='center'>
              <Typography textTransform='uppercase'>{ClientType.ChatGPT}</Typography>
              <Switch
                checked={userConfig?.openaiApiKey !== '' || clientSwitcher === ClientType.ChatGPTPlus}
                onChange={handleClientModeChange}
                inputProps={{ 'aria-label': 'active-client' }}
              />
              <Typography textTransform='uppercase'>{ClientType.ChatGPTPlus}</Typography>
            </Stack>

            <Box
              sx={{
                flexGrow: 1,
                bgcolor: 'transparent',
                display: 'flex',
                height: '20rem',
                width: '100%',
                borderRadius: '4px',
                boxShadow: 'rgba(0, 0, 0, 0.14) 0px 1px 1px 0px',
                border: '.2px solid rgba(0, 0, 0, 0.14)',
                marginBottom: '20rem',
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
                <Tab color='#000' label={ClientType.ChatGPT} {...a11yProps(0)} />
                <Tab label={ClientType.ChatGPTPlus} {...a11yProps(1)} />
              </Tabs>
              <TabPanel value={tabsValue} index={0}>
                {langBasedAppStrings.appChatGpt}
                <Typography variant='h6' component='div' mt='1rem' color='info'>
                  {langBasedAppStrings.appChatGptDesc}
                </Typography>
              </TabPanel>
              <TabPanel value={tabsValue} index={1}>
                {langBasedAppStrings.appChatGptPlusDesc}
                <Box
                  component='form'
                  sx={{
                    '& > :not(style)': { m: 1, width: '220px' },
                  }}
                  noValidate
                  autoComplete='off'>
                  <TextField
                    id='apikey'
                    label='API Key'
                    variant='standard'
                    style={{ width: '97%' }}
                    {...methods.register('apiKey')}
                  />
                  <Typography variant='subtitle2' component='div' mt='.05rem' color='info' style={{ width: '100%' }}>
                    {langBasedAppStrings.appChatGptPlusFooter}
                    <Typography
                      variant='subtitle2'
                      component='a'
                      href='https://platform.openai.com/account/api-keys'
                      sx={{
                        textDecoration: 'none',
                      }}
                      color='primary'>
                      {' '}
                      {langBasedAppStrings.appChatGptPlusLearnMore}
                    </Typography>
                  </Typography>
                  <FormControl variant='standard'>
                    <InputLabel id='model-select-label'>API Model</InputLabel>
                    <Select
                      id='model-select'
                      defaultValue={userConfig?.openaiApiModel}
                      labelId='model-select-label'
                      label='model-select'
                      {...methods.register('apiModel')}>
                      {CHATGPT_API_MODELS.map((v) => (
                        <MenuItem key={v} value={v}>
                          {v}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField id='apiHost' label='API Host' variant='standard' {...methods.register('apiHost')} />
                  <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    spacing={2}
                    style={{ width: '97%', margin: 1, marginTop: 35 }}>
                    <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
                    <Button
                      variant='contained'
                      size='medium'
                      sx={{ color: '#fff' }}
                      onClick={(...args) => void methods.handleSubmit(onSubmitHandler)(...args)}>
                      {langBasedAppStrings.appChatGptPlusSave}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
};

export default Options;
