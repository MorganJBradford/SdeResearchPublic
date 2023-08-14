import { Box, Grid, Typography, useTheme } from '@mui/material';
import NavBar from '../shared/NavBar';
import { Item } from '../shared/Item';
import Footer from '../shared/Footer';

export default function Purpose() {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }} className='purpose'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1'>
            Our Purpose
          </h1>
        </Grid>
        <Grid container item>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container padding='12px 0 12px 0' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor }}>
                  <Typography sx={{ fontSize: '22px', width: '80vw' }}>
                    The purpose of the SDE Research Group is to provide access to and support further
                    research in the field of Self-Directed Education, or education that is determined by the self-
                    chosen life experiences and activities of the learner.
                    We promote groundbreaking SDE research in several ways:
                  </Typography>
                </Item>
              </Grid>
            </Grid>
            <Grid container padding='12px 0 12px 0' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Box
                  component='img'
                  sx={{
                    maxHeight: { xs: 233, md: 334 },
                    maxWidth: { xs: 350, md: 500 },
                  }}
                  src='https://drive.google.com/uc?export=view&id=1Tp48WEkDqTe5CFY3t397sEodUOmMKonA'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px', fontWeight: '900' }}>
                    Research Topics
                  </Typography>
                  <Typography sx={{ fontSize: '22px' }}>
                    Through our library of articles, we aggregate and disseminate the most current evidence
                    regarding self-directed education, from its theoretical foundations to the evidence from
                    psychology and anthropology that supports it.
                  </Typography>
                </Item>
              </Grid>
            </Grid>
            <Grid container padding='12px 0 12px 0' flexDirection='row-reverse' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Box
                  component='img'
                  sx={{
                    maxHeight: { xs: 233, md: 334 },
                    maxWidth: { xs: 350, md: 500 },
                  }}
                  src='https://drive.google.com/uc?export=view&id=19vaRUTok-miHbMjciAfJfdXsVX4wY6Ka'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px', fontWeight: '900' }}>
                    Applying the Research
                  </Typography>
                  <Typography sx={{ fontSize: '22px' }}>
                    We provide research on to how SDE is practiced in schools, learning cooperatives, and
                    unschooling and share media resources that bridge the gap between theory and practice.
                  </Typography>
                </Item>
              </Grid>
            </Grid>
            <Grid container padding='12px 0 12px 0' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Box
                  component='img'
                  sx={{
                    maxHeight: { xs: 233, md: 334 },
                    maxWidth: { xs: 350, md: 500 },
                  }}
                  src='https://drive.google.com/uc?export=view&id=15pbEYhppznHePugaG7Cpwr28qieqyAZT'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px', fontWeight: '900' }}>
                    Research Support
                  </Typography>
                  <Typography sx={{ fontSize: '22px' }}>
                    We serve to connect researchers around the world interested in engaging in an SDE
                    research agenda. We further support the community SDE researchers by providing
                    opportunities to communicate and collaborate.
                  </Typography>
                </Item>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}
