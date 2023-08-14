import { Box, Grid } from '@mui/material';
import NavBar from '../../shared/NavBar';
import MediaCardSection from './components/MediaCardSection';
import Footer from '../../shared/Footer';

export default function OtherMedia() {
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
            Other Media
          </h1>
        </Grid>
        <Grid container item spacing={0}>
          <MediaCardSection/>
        </Grid>
      </Grid>
      <Footer/>
    </Box>
  );
}
