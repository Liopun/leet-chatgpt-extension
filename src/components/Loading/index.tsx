import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { FC } from 'react';

const Loading: FC = () => {
  return (
    <Box
      sx={{
        minHeight: '3rem',
        width: '100%',
        mt: '1rem',
      }}>
      <Grid container direction='row' justifyContent='center' alignItems='center'>
        <Typography component='div' variant='body1'>
          waiting for ChatGPT response
        </Typography>
        <Typography component='div' variant='body1' ml='.6rem'>
          <CircularProgress size='1.5rem' sx={{ color: '#fff' }} />
        </Typography>
      </Grid>
    </Box>
  );
};

export default Loading;
