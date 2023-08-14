import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import NavBar from '../../shared/NavBar';
import { Item } from '../../shared/Item';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';


export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggleIsRegistering = () => {
    setIsRegistering(!isRegistering);
  }

  return (
      <Box sx={{ flexGrow: 1 }} className='login'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
          <Grid xs={12} className='background-white'>
            <Item>
              <h1 className='h1' style={{color: '#12232E'}}>
                Welcome
              </h1>
            </Item>
          </Grid>
          <Grid container item xs={12} justifyContent="center" alignItems='center'>
            {isRegistering ?
              <RegisterForm onToggleIsRegistering={handleToggleIsRegistering}  />
              :
              <LoginForm onToggleIsRegistering={handleToggleIsRegistering} />
            }
          </Grid>
        </Grid>
      </Box>
  );
}
