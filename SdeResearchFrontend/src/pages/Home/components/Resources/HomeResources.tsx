import { Box, Grid, useTheme } from '@mui/material';
import HomeResourceCard from './HomeResourceCard';

const resourceObjects = [
  {
    title: 'Academic Publications',
    image: 'https://drive.google.com/uc?export=view&id=1YmEmW6Jim-Fpw6LH9tfIJxQJR8Sb1fO0',
    intro: 'Repository of publications released by professionals in the field',
    link: 'publications/academic'
  },
  {
    title: 'Practitioner Publications',
    image: 'https://drive.google.com/uc?export=view&id=1M1-q1l_GUapiPx5xZBgz-Cq5_cRFpF3x',
    intro: 'Repository of related publications by other professionals',
    link: 'publications/practitioner'
  },
  {
    title: 'Media',
    image: 'https://drive.google.com/uc?export=view&id=162juJcvPv4b98vK4a1QF-VsbYgR2ikEd',
    intro: 'Podcasts, web articles, and videos',
    link: 'other-media'
  },
]

export default function HomeResources() {
  const theme = useTheme();
  return (
    <>
      <Grid item xs={12} sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}>
        <h1 style={{ textAlign: 'center' }}>
          Our Resources
        </h1>
      </Grid>
      <Grid container item spacing={0} sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container columnSpacing={{ xs: 12, sm: 4 }} alignItems='center' justifyContent='space-around' sx={{ marginBottom: '40px' }} spacing={2}>
            {resourceObjects.map((resource, i) => {
              return (
                <Grid item key={i}>
                  <HomeResourceCard resource={resource} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Grid>
    </>

  );
}
