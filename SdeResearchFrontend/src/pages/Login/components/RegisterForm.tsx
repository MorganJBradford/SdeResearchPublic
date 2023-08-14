import { useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Grid, useTheme } from '@mui/material/';
import { API_ROUTES } from '../../../utils/constants';
import { enqueueSnackbar } from 'notistack';
import { HttpStatusCode, ServerResponse } from '../../../utils/types';

type RegisterFormProps = {
  onToggleIsRegistering: () => void,
}

type FormData = {
  email: string,
  confirmEmail: string,
  password: string,
  confirmPassword: string
}

const defaultFormData = {
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: ''
}

export default function RegisterForm({ onToggleIsRegistering }: RegisterFormProps) {
  const theme = useTheme();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const { email, confirmEmail, password, confirmPassword } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const validateUserInput = (): boolean => {
    let isInputValid: boolean = true;

    const hasNumber = /[0-9]+/;
    const hasUpperCaseChar = /[A-Z]+/;
    const hasLowerCaseChar = /[a-z]+/;
    const hasMinimum8Chars = /.{8,}/;

    if (email !== confirmEmail) {
      enqueueSnackbar("Emails do not match", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }

    if (!password.match(hasNumber)) {
      enqueueSnackbar("Password must contain a number", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }
    if (!password.match(hasUpperCaseChar)) {
      enqueueSnackbar("Password must contain an upper case letter", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }
    if (!password.match(hasLowerCaseChar)) {
      enqueueSnackbar("Password must contain a lower case letter", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }
    if (!password.match(hasMinimum8Chars)) {
      enqueueSnackbar("Password must be a minimum of 8 characters", { preventDuplicate: false, variant: 'error'});
      isInputValid = false;
    }
    return isInputValid;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = API_ROUTES.AUTH.ACCOUNT_REGISTRATION;

    const isInputValid: boolean = validateUserInput();

    if (!isInputValid) return;

    const dataToPass = {
        email: email,
        password: password
      }

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 2000});
          onToggleIsRegistering();
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 2000});
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  return (
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined" sx={{backgroundColor: theme.palette.primaryPalette.darkColor}}>
          <CardHeader
            sx={{color: theme.palette.primaryPalette.lighterColor}}
            title="Register"
            />
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Grid justifyContent='center' alignItems='center'>
                <Grid item padding={2}>
                  <TextField
                    sx={{backgroundColor: theme.palette.primaryPalette.lighterColor}}
                    required
                    name="email"
                    type="email"
                    label="Email"
                    onChange={(e) => onChange(e)}
                  />
                </Grid>
                <Grid item padding={2}>
                  <TextField
                    sx={{backgroundColor: theme.palette.primaryPalette.lighterColor}}
                    required
                    name="confirmEmail"
                    type="email"
                    label="Confirm Email"
                    onChange={(e) => onChange(e)}
                  />
                </Grid>
                <Grid item padding={2}>
                  <TextField
                    sx={{backgroundColor: theme.palette.primaryPalette.lighterColor}}
                    required
                    name="password"
                    label="Password"
                    type="password"
                    onChange={(e) => onChange(e)}
                  />
                </Grid>
                <Grid item padding={2}>
                  <TextField
                    sx={{backgroundColor: theme.palette.primaryPalette.lighterColor}}
                    required
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    onChange={(e) => onChange(e)}
                  />
                </Grid>
                <Button sx={{ display: 'block', margin: '0 auto', backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} type='submit'>Submit</Button>
              </Grid>
            </form>
          </CardContent>
          <CardActions>
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={onToggleIsRegistering} size="small">Return to Login</Button>
          </CardActions>
        </Card>
      </Box>
  );
}
