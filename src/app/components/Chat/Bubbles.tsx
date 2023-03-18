import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

interface Props {
  color?: 'primary' | 'flat';
}

const Bubbles: FC<PropsWithChildren<Props>> = (props) => {
  const { color, children } = props;

  return (
    <Box
      sx={{
        borderRadius: '15px',
      }}>
      {children}
    </Box>
  );
};

export default Bubbles;
