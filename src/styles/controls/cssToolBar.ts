import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from '../../theme';

const CssToolBar = styled(Tooltip)({
  '& .MuiTooltip-popperArrow': {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: '6rem !important',
  },
  '& .MuiTooltip-popperInteractive': {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: '6rem !important',
  },
  '& .MuiTooltip-popper': {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: '6rem !important',
  },
});

export { CssToolBar };
