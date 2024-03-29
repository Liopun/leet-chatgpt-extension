import createTheme from '@mui/material/styles/createTheme';
import './App.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Chakra Petch sans-serif',
  },
  palette: {
    primary: {
      main: '#F89F1B',
    },
    secondary: {
      main: '#0E0E0E',
    },
    info: {
      main: 'rgb(0, 0, 0, .95)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        '.Mui-disabled': { color: '#808080 !important', opacity: 0.5 },
        '.MuiAccordion-root .Mui-disabled': { color: '#fff !important', opacity: 0.4 },
      }),
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: '#fff !important',
          },
        },
      },
    },
  },
});

export default theme;
