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
      main: '#F89F1B',
      // main: '#FF8C00'
    },
    info: {
      main: '#808080',
    },
    success: {
      main: '#75A99C',
    },
    warning: {
      main: '#FF6347',
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
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'rgba(128, 128, 128, 1)',
          boxShadow: '0px 2px 6px rgba(128, 128, 128, 0.16)',
          '&:hover': {
            boxShadow: '0px 3px 10px rgba(128, 128, 128, 0.2)',
          },
        },
        primary: {
          color: '#0D1117 !important',
          fontWeight: 'bold',
          padding: 3,
          paddingLeft: 5,
          boxShadow: '0px 2px 6px rgba(117, 169, 156, 0.16)',
          background: 'rgba(117, 169, 156, 1)',
          '&:hover': {
            boxShadow: '0px 3px 10px rgba(117, 169, 156, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
