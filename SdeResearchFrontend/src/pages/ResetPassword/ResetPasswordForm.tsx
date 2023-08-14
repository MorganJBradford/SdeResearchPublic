import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, TextField, Grid, useTheme } from '@mui/material/';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../../utils/constants';
import { HttpStatusCode, ServerResponse } from '../../utils/types';

type LoginFormProps = {
  onToggleShowResetForm: (showReset: boolean) => void,
}

type FormValues = {
  email: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword?: string,
}

const defaultFormValues: FormValues = {
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

export default function LoginForm({ onToggleShowResetForm }: LoginFormProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const { email, oldPassword, newPassword, confirmPassword } = formValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues(prevState => ({
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

    if (newPassword !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }

    if (!newPassword.match(hasNumber)) {
      enqueueSnackbar("Password must contain a number", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }
    if (!newPassword.match(hasUpperCaseChar)) {
      enqueueSnackbar("Password must contain an upper case letter", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }
    if (!newPassword.match(hasLowerCaseChar)) {
      enqueueSnackbar("Password must contain a lower case letter", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }
    if (!newPassword.match(hasMinimum8Chars)) {
      enqueueSnackbar("Password must be a minimum of 8 characters", { preventDuplicate: false, variant: 'error' });
      isInputValid = false;
    }
    return isInputValid;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = API_ROUTES.AUTH.RESET_PASSWORD;

    if (!validateUserInput()) return;

    const dataToPass: FormValues = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse)=> {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1500 });
          navigate('/login');
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
          sx={{ color: theme.palette.primaryPalette.lightColor }}
          title="Change Password"
        />
        <CardContent>
          <form
            onSubmit={(e) => handleSubmit(e)}
          >
            <Grid justifyContent='center' alignItems='center'>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lightColor }}
                  required
                  name="email"
                  type="email"
                  label="Email"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lightColor }}
                  required
                  name="oldPassword"
                  type="password"
                  label="Old Password"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lightColor }}
                  required
                  name="newPassword"
                  type="password"
                  label="New Password"
                  autoComplete="current-password"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Grid item padding={2}>
                <TextField
                  sx={{ backgroundColor: theme.palette.primaryPalette.lightColor }}
                  required
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  autoComplete="current-password"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Button sx={{ display: 'block', margin: '0 auto', backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} type='submit'>Submit</Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
