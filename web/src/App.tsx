import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactGA from 'react-ga4';
import theme from './theme';
import './App.css';
import NotFound from './components/NotFound';
import Home from './components/Home';

ReactGA.initialize(process.env.GA_TRACKING_ID || '');

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/web' element={<Home />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
