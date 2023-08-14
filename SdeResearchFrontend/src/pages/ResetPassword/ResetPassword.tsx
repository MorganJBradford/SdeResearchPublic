import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import NavBar from '../../shared/NavBar';
import { Item } from '../../shared/Item';
import RequestResetForm from './RequestResetForm';
import ResetPasswordForm from './ResetPasswordForm';


export default function ResetPassword() {
  const [showResetForm, setShowResetForm] = useState<boolean>(false);

  const handleToggleShowResetForm = (showReset: boolean) => {
    setShowResetForm(showReset)
  }

  return (
    <Box sx={{ flexGrow: 1 }} className='login'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid xs={12} className='background-white'>
          <Item>
            <h1 className='h1' style={{ color: '#12232E' }}>
              Welcome
            </h1>
          </Item>
        </Grid>
        <Grid container item xs={12} justifyContent="center" alignItems='center'>
          {showResetForm ?
            <ResetPasswordForm onToggleShowResetForm={handleToggleShowResetForm} />
            :
            <RequestResetForm onToggleShowResetForm={handleToggleShowResetForm} />
          }
        </Grid>
      </Grid>
    </Box>
  );
}
