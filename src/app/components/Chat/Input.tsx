import { Box, Button, Paper, styled, TextField } from '@mui/material';
import { ChangeEvent, FC, KeyboardEventHandler, memo, useCallback, useEffect, useRef, useState } from 'react';
import { loadAppLocales } from '../../../utils/locales';
import theme from '../../theme';

interface Props {
  onSubmit: (value: string) => void;
  stopGenerating: () => void;
  generating: boolean;
}

const CssTextField = styled(TextField)({
  color: theme.palette.info.main,
  '& label.Mui-focused': {
    color: theme.palette.info.main,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.info.main,
  },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': {
      borderColor: theme.palette.info.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.info.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.info.main,
    },
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.info.main,
  },
});

const CssButton = styled(Button)({
  color: theme.palette.primary.main,
  background: 'transparent',
  borderColor: 'transparent',
  fontSize: '17px',
  fontWeight: 'bold',
  '&:hover': {
    color: theme.palette.primary.main,
    background: 'transparent',
    borderColor: 'transparent',
  },
});

const Input: FC<Props> = (props) => {
  const { onSubmit, stopGenerating, generating } = props;

  const [inputValue, setInputValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const langBasedAppStrings = loadAppLocales();

  useEffect(() => {
    if (!generating) {
      inputRef.current?.focus();
    }
  }, [generating]);

  const onValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => setInputValue(e.target.value);

  const onFormSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
      if (e) e.preventDefault();
      if (inputValue.trim()) onSubmit(inputValue);
      setInputValue('');
    },
    [props, inputValue]
  );

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          setInputValue(inputValue + '\n');
        } else if (!generating) {
          onFormSubmit();
        }
      }
    },
    [generating, formRef, onValueChange, inputValue]
  );

  return (
    <Box
      ref={formRef}
      component='form'
      sx={{
        display: 'flex',
        position: 'sticky',
        bottom: 0,
        alignItems: 'center',
        padding: theme.spacing(1),
        paddingTop: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.info.main}`,
      }}
      onSubmit={onFormSubmit}>
      <Paper
        component='form'
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          bgcolor: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }}>
        <CssTextField
          ref={inputRef}
          label='How can I further assist you ...'
          variant='outlined'
          value={inputValue}
          onChange={onValueChange}
          sx={{
            flex: 1,
            flexGrow: 1,
            marginRight: theme.spacing(1),
            textTransform: 'capitalize',
          }}
          onKeyDown={onKeyDown}
          disabled={generating}
          minRows={1}
          maxRows={3}
          multiline
        />
        {!generating ? (
          <CssButton variant='outlined' onClick={onFormSubmit} disabled={inputValue.length === 0}>
            {langBasedAppStrings.appSend}
          </CssButton>
        ) : (
          <CssButton
            variant='outlined'
            onClick={(e) => {
              e.preventDefault();
              stopGenerating();
            }}>
            {langBasedAppStrings.appStop}
          </CssButton>
        )}
      </Paper>
    </Box>
  );
};

export default memo(Input);
