import { Box, Grid, Typography } from '@mui/material';

import NavBar from '../shared/NavBar';
import Footer from '../shared/Footer';
import GetInvolvedForm from '../shared/GetInvolvedForm';

export default function GetInvolved() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid container item spacing={2}>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1'>
            Contact Us
          </h1>
        </Grid>
        <Grid container item xs={12} alignItems={'center'} justifyContent={'center'}>
          <Typography textAlign={'center'}>
            Thank you for your interest in the Self-Directed Education Research Group.<br/>For all inquiries, please fill out the contact information below.
          </Typography>
        </Grid>
        <Grid container item alignItems={'center'} justifyContent={'space-around'}>
          <Grid item xs={6}>
            <GetInvolvedForm/>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}
