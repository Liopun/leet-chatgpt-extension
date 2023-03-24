import { Box, Button, Paper, styled, TextField } from '@mui/material';
import { ChangeEvent, FC, KeyboardEventHandler, memo, useCallback, useEffect, useRef, useState } from 'react';
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

const Input: FC<Props> = (props) => {
  const { onSubmit, stopGenerating, generating } = props;

  const [inputValue, setInputValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          <Button
            variant='contained'
            color='primary'
            size='large'
            onClick={onFormSubmit}
            sx={{ color: '#fff' }}
            disabled={inputValue.length === 0}>
            Send
          </Button>
        ) : (
          <Button
            variant='contained'
            color='primary'
            size='large'
            sx={{ color: '#fff' }}
            onClick={(e) => {
              e.preventDefault();
              stopGenerating();
            }}>
            Stop
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default memo(Input);
