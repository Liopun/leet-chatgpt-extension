import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

const CssSelect = styled(InputBase)({
  // marginTop: '.5rem',
  '& .MuiSelect-iconOutlined': {
    color: '#808080',
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    border: '1px solid #808080',
    padding: '.2rem .5rem',
    color: '#808080',
    // height: '1.5rem',
    '&:focus': {
      borderColor: '#808080',
      color: '#808080',
      boxShadow: '0 0 0 0.2rem rgba(128, 128, 128,.25)',
    },
  },
});

export { CssSelect };
