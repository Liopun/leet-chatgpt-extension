import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { ASSISTANCE } from '../../config';
import { CssSelect } from '../../styles/controls';

interface NavBarProps {
  selectedTimer: string;
  timeStarted: boolean;
  disableManuals: boolean;
  minimized: boolean;
  showAnswer: boolean;
  handleTimerSelect: (event: SelectChangeEvent) => void;
  options: string[];
  handleTimerStart: () => void;
  handleStopTimer: () => void;
  handleManualBRClick: () => void;
  handleManualOPClick: () => void;
  handleMinimizeClick: () => void;
}

const NavBar: FC<NavBarProps> = (props) => {
  const {
    selectedTimer,
    timeStarted,
    disableManuals,
    minimized,
    showAnswer,
    handleTimerSelect,
    options,
    handleTimerStart,
    handleStopTimer,
    handleManualBRClick,
    handleManualOPClick,
    handleMinimizeClick,
  } = props;
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <AppBar position='static' color='transparent'>
      <Toolbar variant='dense'>
        <Typography variant='body1' component='div' mr='2rem'>
          ChatGPT
        </Typography>
        <Box sx={{ ml: '1rem' }}>
          <Accordion
            sx={{ backgroundColor: '#0C0F15' }}
            expanded={expanded === 'timerAccordion'}
            disabled={expanded !== 'timerAccordion' && disableManuals}
            onChange={handleAccordionChange('timerAccordion')}
            disableGutters>
            <AccordionSummary
              aria-controls='manual-mode-content'
              id='manual-mode-header'
              sx={{
                minHeight: '1rem',
                maxHeight: '2rem',
                backgroundColor: '#F89F1B',
                color: '#fff',
                borderRadius: '.3rem',
              }}>
              <Tooltip title={ASSISTANCE.timer.desc} placement='top-start' arrow>
                <Typography sx={{ width: '100%' }}>{ASSISTANCE.timer.title} Mode</Typography>
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails sx={{ minHeight: '1.5rem', backgroundColor: '#0C0F15' }}>
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
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ ml: '3rem' }}>
          <Accordion
            sx={{ backgroundColor: '#0C0F15' }}
            expanded={expanded === 'manualAccordion'}
            disabled={expanded !== 'manualAccordion' && timeStarted}
            onChange={handleAccordionChange('manualAccordion')}
            disableGutters>
            <AccordionSummary
              aria-controls='manual-mode-content'
              id='manual-mode-header'
              sx={{
                minHeight: '1rem',
                maxHeight: '2rem',
                backgroundColor: '#75A99C',
                color: '#fff',
                borderRadius: '.3rem',
              }}>
              <Tooltip title={ASSISTANCE.manual.desc} placement='top-start' arrow>
                <Typography sx={{ width: '100%' }}>{ASSISTANCE.manual.title} Mode</Typography>
              </Tooltip>
            </AccordionSummary>
            <AccordionDetails sx={{ minHeight: '1.5rem', backgroundColor: '#0C0F15' }}>
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
                  {ASSISTANCE.manual.types[0]}
                </Button>
                <Button
                  variant='outlined'
                  color='info'
                  size='small'
                  sx={{ color: '#808080', borderColor: '#808080', width: '7rem' }}
                  disabled={disableManuals}
                  onClick={handleManualOPClick}>
                  {ASSISTANCE.manual.types[1]}
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
        <Box>
          <IconButton
            size='medium'
            aria-label='minimize-toggler'
            onClick={() => {
              handleMinimizeClick();
              setExpanded(false);
            }}
            disabled={!showAnswer && !minimized && !timeStarted}>
            {minimized ? (
              <KeyboardArrowUpIcon sx={{ color: '#fff' }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ color: '#fff' }} />
            )}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
