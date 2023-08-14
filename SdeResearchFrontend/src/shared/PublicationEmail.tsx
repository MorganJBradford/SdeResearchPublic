import { useState, useRef, FormEvent } from 'react';
import {
  Button,
  Grid,
  Dialog,
  TextField,
  useTheme
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../utils/constants';
import { HttpStatusCode, ServerResponse } from '../utils/types';

type PublicationEmailProps = {
  email: string,
  citation: string,
}

type FormInfo = {
  name: string,
  replyTo: string,
  recipient: string,
  subject: string,
  body: string
}

export default function PublicationEmail({
  email,
  citation,
}: PublicationEmailProps) {
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formInfo = new FormData(e.currentTarget);
    const url = API_ROUTES.EMAIL.CONTACT_AUTHOR;

    const requestBody: FormInfo = {
      name: formInfo.get('name') as string,
      replyTo: formInfo.get('email') as string,
      recipient: email,
      subject: citation,
      body: formInfo.get('body') as string,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000 });
          formRef.current?.reset();
          setOpen(false);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <div style={{ display: 'inline-flex' }}>
      <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={handleClickOpen}>
        Email
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <form onSubmit={onSubmit} ref={formRef}>
            <Grid container item xs={12}>
              <TextField
                required
                type='text'
                name='name'
                sx={{ margin: '0 auto', width: {xs: '40vw', md: '30vw'}}}
                label='Name'
              />
            </Grid>
            <Grid container item xs={12}>
              <TextField
                required
                type='email'
                name='email'
                sx={{ margin: '0 auto', width: {xs: '40vw', md: '30vw'}}}
                label='Email'
              />
            </Grid>
            <Grid container item xs={12}>
              <TextField
                required
                name='body'
                sx={{ margin: '0 auto', width: {xs: '40vw', md: '30vw'}}}
                multiline
                rows={10}
                label='Body'
              />
            </Grid>
            <DialogActions>
              <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={handleClose}>
                Cancel
              </Button>
              <Button sx={{backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type='submit' autoFocus>
                Send
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
