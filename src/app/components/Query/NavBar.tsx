import { LocalFireDepartment } from '@mui/icons-material';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { loadAppLocales } from '../../../utils/locales';
import { CssSelect } from '../../styles/controls';

interface NavBarProps {
  selectedTimer: string;
  timeStarted: boolean;
  disableManuals: boolean;
  minimized: boolean;
  showAnswer: boolean;
  streakCount: string;
  handleTimerSelect: (event: SelectChangeEvent) => void;
  options: string[];
  handleTimerStart: () => void;
  handleStopTimer: () => void;
  handleManualBRClick: () => void;
  handleManualOPClick: () => void;
  handleMinimizeClick: () => void;
  openOptions: () => void;
}

const TIMER = 'timer';
const MANUAL = 'manual';

const NavBar: FC<NavBarProps> = (props) => {
  const {
    selectedTimer,
    timeStarted,
    disableManuals,
    minimized,
    showAnswer,
    streakCount,
    handleTimerSelect,
    options,
    handleTimerStart,
    handleStopTimer,
    handleManualBRClick,
    handleManualOPClick,
    handleMinimizeClick,
    openOptions,
  } = props;
  const [tabValue, setTabValue] = useState(TIMER);
  const langBasedAppStrings = loadAppLocales();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <AppBar position='static' color='transparent'>
      <Toolbar variant='dense'>
        <Box sx={{ ml: { md: 1, xs: 0.2 }, typography: 'body1' }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label='mode tab selection'>
                <Tab
                  sx={{ color: 'rgba(255,255,255,.8)' }}
                  icon={<AvTimerIcon />}
                  aria-label={TIMER}
                  value={TIMER}
                  disabled={tabValue !== TIMER && disableManuals}
                />
                <Tab
                  sx={{ color: 'rgba(255,255,255,.8)' }}
                  icon={<CodeIcon />}
                  aria-label={MANUAL}
                  value={MANUAL}
                  disabled={tabValue !== MANUAL && timeStarted}
                />
              </TabList>
            </Box>
            <TabPanel value={TIMER}>
              <FormControl
                variant='outlined'
                sx={{
                  minWidth: '3rem',
                  color: '#808080',
                  borderColor: '#808080',
                  textAlign: 'left',
                }}
                size='small'>
                <Stack direction='row' spacing={1}>
                  <Select
                    labelId='time-select-small'
                    id='time-select-small'
                    value={selectedTimer}
                    label='Time'
                    sx={{ color: '#808080', borderColor: '#808080' }}
                    input={<CssSelect />}
                    disabled={timeStarted}
                    onChange={handleTimerSelect}>
                    {options.map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>
                  <IconButton
                    sx={{ mt: '.8rem' }}
                    size='medium'
                    color='secondary'
                    aria-label='start-timer'
                    disabled={timeStarted}
                    onClick={handleTimerStart}>
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton
                    sx={{ mt: '.8rem' }}
                    size='medium'
                    color='secondary'
                    aria-label='stop-timer'
                    disabled={!timeStarted}
                    onClick={handleStopTimer}>
                    <StopIcon />
                  </IconButton>
                </Stack>
              </FormControl>
            </TabPanel>
            <TabPanel value={MANUAL}>
              <Stack
                direction='row'
                spacing={2}
                justifyContent='space-between'
                alignItems='center'
                pt='.3rem'
                pb='.175rem'>
                <Button
                  variant='outlined'
                  color='info'
                  size='small'
                  sx={{ color: '#808080', borderColor: '#808080', width: '7rem' }}
                  disabled={disableManuals}
                  onClick={handleManualBRClick}>
                  {langBasedAppStrings.appBruteforce}
                </Button>
                <Button
                  variant='outlined'
                  color='info'
                  size='small'
                  sx={{ color: '#808080', borderColor: '#808080', width: '7rem' }}
                  disabled={disableManuals}
                  onClick={handleManualOPClick}>
                  {langBasedAppStrings.appOptimize}
                </Button>
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
        <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
        <Box sx={{ mr: { lg: 6, md: 1, sm: 0.5 } }}>
          <IconButton size='medium' aria-label='options-streak' onClick={() => openOptions()}>
            <LocalFireDepartment fontSize='medium' htmlColor='#F89F1B' />
            <Typography variant='h6' sx={{ ml: { lg: '5px', md: '3px', xs: '1px' } }}>
              {streakCount}
            </Typography>
          </IconButton>
        </Box>
        <Box>
          <IconButton
            size='medium'
            aria-label='minimize-toggler'
            onClick={() => {
              handleMinimizeClick();
            }}
            // disabled={!showAnswer && !timeStarted}
          >
            <VisibilityOffIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
