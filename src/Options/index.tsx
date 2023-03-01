import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import ReactDOM from 'react-dom';
import Options from '../components/Options';

// import Options from '../components/Options';
import theme from '../theme';

const optionsWrapper = (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Options />
  </ThemeProvider>
);

ReactDOM.render(optionsWrapper, document.getElementById('options-view'));
