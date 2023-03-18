import createTheme from '@mui/material/styles/createTheme';
import './styles/font.scss';

const theme = createTheme({
  typography: {
    fontFamily: 'Chakra Petch sans-serif',
  },
  palette: {
    primary: {
      main: '#75A99C',
    },
    secondary: {
      // main: '#FFA116'
      // main: '#0E0E0E',
      main: '#F89F1B',
    },
    info: {
      main: '#808080',
    },
    success: {
      main: '#75A99C',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        '.Mui-disabled': { color: '#808080 !important', opacity: 0.5 },
        '.MuiAccordion-root .Mui-disabled': { color: '#fff !important', opacity: 0.4 },
      }),
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#24292f',
          fontSize: '.9rem',
        },
        arrow: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        disabled: {
          color: '#fff !important',
        },
      },
    },
  },
});

export default theme;
