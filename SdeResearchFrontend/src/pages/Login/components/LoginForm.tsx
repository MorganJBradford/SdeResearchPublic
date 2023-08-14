import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Grid, useTheme } from '@mui/material/';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../../../utils/constants';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { AuthResponse, HttpStatusCode, User } from '../../../utils/types';

type LoginFormProps = {
  onToggleIsRegistering: () => void,
}

type FormValues = {
  email: string,
  password: string
}

const defaultFormValues = {
  email: '',
  password: ''
}

export default function LoginForm({ onToggleIsRegistering }: LoginFormProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, setUser } = useContext(GlobalContext);
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues);
  const { email, password } = formValues;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValues(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = API_ROUTES.AUTH.ACCOUNT_LOGIN;

    const dataToPass: FormValues = {

      email: email,
      password: password,

    }

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: AuthResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          const userToSave: User = {
            email: serverResponse.data.email,
            profilePicture: serverResponse.data.profilePicture,
            researcherId: serverResponse.data.researcherId,
            researcherName: serverResponse.data.researcherName,
            isAdmin: serverResponse.data.isAdmin,
          }
          enqueueSnackbar("Login Successful", { variant: 'success', autoHideDuration: 1500 });
          localStorage.setItem("user", JSON.stringify(userToSave));
          setUser(userToSave);
          setTimeout(() => {
            navigate("/");
            return () => {
            }
          }, 1500);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error' });
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  useEffect(() => {
    if (user.researcherId !== 0)
      navigate("/");

    return () => {

    }
    // eslint-disable-next-line
  }, [])

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined" sx={{backgroundColor: theme.palette.primaryPalette.darkColor}}>
        <CardHeader
          sx={{color: theme.palette.primaryPalette.lightColor}}
          title="Login"
        />
        <CardContent>
          <form
            onSubmit={(e) => handleSubmit(e)}
          >
            <Grid justifyContent='center' alignItems='center'>
              <Grid item padding={2}>
                <TextField
                  sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}
                  required
                  name="email"
                  type="email"
                  label="Email"
                  onChange={(e) => onChange(e)}
                  />
              </Grid>
              <Grid item padding={2}>
                <TextField
                  sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}
                  required
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => onChange(e)}
                />
              </Grid>
              <Button sx={{ display: 'block', margin: '0 auto', backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} type='submit'>Submit</Button>
            </Grid>
          </form>
        </CardContent>
        <CardActions>
          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={onToggleIsRegistering} size="small">Need account</Button>
          <Link to="/reset">
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} size="small">Forgot password</Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
}
