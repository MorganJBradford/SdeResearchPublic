import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Grid, useTheme } from '@mui/material/';
import { API_ROUTES } from '../../utils/constants';
import { enqueueSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { HttpStatusCode, ServerResponse } from '../../utils/types';

type RegisterFormProps = {
  onToggleShowResetForm: (showForm: boolean) => void,
}

type FormData = {
  email: string,
  confirmEmail: string
}

const defaultFormData = {
  email: '',
  confirmEmail: ''
}

export default function RegisterForm({ onToggleShowResetForm }: RegisterFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const { email, confirmEmail } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const validateUserInput = (): boolean => {
    let isInputValid: boolean = true;

    if (email !== confirmEmail) {
      enqueueSnackbar("Emails do not match", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }
    return isInputValid;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `${API_ROUTES.EMAIL.RESET_PASSWORD}?email=${email}`;

    const isInputValid: boolean = validateUserInput();

    if (!isInputValid) return;

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success' });
          onToggleShowResetForm(true);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error' });
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" sx={{ backgroundColor: theme.palette.primaryPalette.darkColor }}>
        <CardHeader
          sx={{ color: theme.palette.primaryPalette.lighterColor }}
          title="Request Password Reset"
        />
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)}>
            <Grid justifyContent='center' alignItems='center'>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor }}
                  required
                  name="email"
                  type="email"
                  label="Email"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor }}
                  required
                  name="confirmEmail"
                  type="email"
                  label="Confirm Email"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Button sx={{ display: 'block', margin: '0 auto', backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} type='submit'>Submit</Button>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Link to='/login'>
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} size="small">Back</Button>
          </Link>
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => onToggleShowResetForm(true)}>Change Password</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
