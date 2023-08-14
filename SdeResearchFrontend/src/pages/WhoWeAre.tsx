import { useEffect, useState } from 'react';
import { Box, Grid, useTheme } from '@mui/material';

import { API_ROUTES } from '../utils/constants';
import { Researcher } from '../utils/types';
import NavBar from '../shared/NavBar';
import ProfileCard from '../shared/ProfileCard';
import Footer from '../shared/Footer';

export default function WhoWeAre() {
  const theme = useTheme();
  const [researchers, setResearchers] = useState<Researcher[]>();

  //! Type server response
  const getApprovedResearchers = () => {
    const url = API_ROUTES.RESEARCHER.GET_APPROVED_RESEARCHERS;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(serverResponse => {
      setResearchers(serverResponse.data);
    }).catch((error) => {
      console.error(error)
    });
  }

  useEffect(() => {
    getApprovedResearchers();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }} className='who-we-are'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1'>
            Who We Are
          </h1>
        </Grid>
        <Grid container item>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container justifyContent='center' spacing={2}>
              {researchers && researchers.map((researcher, i) => {
                return (
                  <Grid item xs={8} key={i}>
                    <ProfileCard sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke'}} researcher={researcher} isWhoWeAre getResearchers={getApprovedResearchers} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Footer/>
    </Box>
  );
}
