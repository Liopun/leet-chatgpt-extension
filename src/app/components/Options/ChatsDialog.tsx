import { ContentCopyOutlined, PhotoAlbumOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ChatMessageObj } from '../../../interfaces/chat';
import { generateTriggerMode } from '../../../utils/common';
import { loadAppLocales } from '../../../utils/locales';
import { sharePngOrPdf } from '../../../utils/share';

const CssChatsDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface DialogTitleProps {
  id: string;
  onClose: () => void;
  children?: ReactNode;
}

const ChatsDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        backgroundColor: 'rgba(30, 33, 34, 1) !important',
        color: '#fff',
      }}
      {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

interface ChatsDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  getMessages: () => ChatMessageObj[];
  children: ReactNode;
}

const ChatsDialog: FC<ChatsDialogProps> = (props) => {
  const { title, open, onClose, getMessages, children } = props;
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState(getMessages);
  const langBasedAppStrings = loadAppLocales();

  const serializedContent = useMemo(() => {
    return messages
      .filter((m) => !!m.text)
      .map((m) => `**${m.author}**: ` + m.text)
      .join('\n\n');
  }, [messages]);

  const shortenTitle = (): string => {
    const tMode = generateTriggerMode(title);
    if (tMode) {
      const regex = new RegExp(`/${tMode}s/([a-z-]+)/`);
      const match = regex.exec(title);

      return match ? match[1] : title;
    }

    return title;
  };

  const copyToClipboard = useCallback(() => {
    setMessages(getMessages);
    setTimeout(() => {
      (async () => {
        await navigator.clipboard.writeText(serializedContent);
      })();
    }, 0); // stall for message update
    setCopied(true);
  }, [serializedContent]);

  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 3000);
  }, [copied]);

  useEffect(() => {
    setMessages(getMessages);
  }, [messages]);

  return (
    <>
      <CssChatsDialog aria-labelledby='chats-dialog' open={open} onClose={onClose}>
        <ChatsDialogTitle id='chats-dialog-title' onClose={onClose}>
          {title}
        </ChatsDialogTitle>
        <DialogContent
          id='chats-dialog-content'
          sx={{
            p: '0px !important',
            scrollbarWidth: 'thin',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#808080',
              borderRadius: '6px',
            },
          }}>
          {children}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'rgba(30, 33, 34, 1) !important', color: '#fff', pl: 2, pr: 2 }}>
          <Typography sx={{ pl: 1 }}>{langBasedAppStrings.appShare}</Typography>
          <Box sx={{ backgroundColor: 'transparent' }} style={{ flex: 1 }}></Box>
          <Stack direction='row' spacing={1}>
            <IconButton aria-label='close' onClick={copyToClipboard} sx={{ color: (theme) => theme.palette.grey[500] }}>
              <Tooltip open={copied} title={langBasedAppStrings.appClipboard}>
                <ContentCopyOutlined />
              </Tooltip>
            </IconButton>
            <IconButton
              aria-label='share-png'
              onClick={(e) => sharePngOrPdf(shortenTitle())}
              sx={{ color: (theme) => theme.palette.grey[500] }}>
              <PhotoAlbumOutlined />
            </IconButton>
            <IconButton
              aria-label='share-pdf'
              onClick={(e) => sharePngOrPdf(shortenTitle(), true)}
              sx={{ color: (theme) => theme.palette.grey[500] }}>
              <PictureAsPdfOutlined />
            </IconButton>
          </Stack>
        </DialogActions>
      </CssChatsDialog>
    </>
  );
};

export default ChatsDialog;
