import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import NavBar from '../shared/NavBar';
import { Item } from '../shared/Item';
import Footer from '../shared/Footer';

export default function WhatIsSde() {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }} className='what-is-sde'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1'>
            What is Self-Directed Education?
          </h1>
        </Grid>
        <Grid container item>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container padding='12px 0 12px 0' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor }}>
                  <Typography sx={{ fontSize: '22px' }}>
                    Self-Directed Education is education that is directed and controlled by the person becoming educated.
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
                  src='https://drive.google.com/uc?export=view&id=1U2Xg7DDnRQQOgeikSq0iJtGnR7LC0Z8T'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px' }}>
                    Self-directed education, education that is directed and controlled by the person becoming
                    educated, occurs primarily outside of, and instead of, the conventional school model. Self-
                    directed education can emerge from any self-directed activities, regardless of the intention
                    of the learner.
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
                  src='https://drive.google.com/uc?export=view&id=1p5rDCSgCt2NmRgOaKuplZzfvxqxHjWy2'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px' }}>
                    The two primary means of self-directed education for children of school age in our culture
                    are unschooling and organized communities of self-directed education. Unschooling is a
                    homeschooling approach in which children are allowed by their parents to take full charge
                    of their own education. Organized communities designed for self-directed education may

                    refer to themselves and be legally recognized as schools, but they do not engage in
                    “schooling.” They include democratic schools or free schools and other SDE cooperatives or
                    centers.
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
                  src='https://drive.google.com/uc?export=view&id=13M-iYfikBQazsgG4F8ufjKfOudIy14Jz'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Item sx={{ backgroundColor: theme.palette.primaryPalette.lighterColor, color: theme.palette.primaryPalette.darkColor }}>
                  <Typography sx={{ fontSize: '22px' }}>
                    Research in the field of self-directed education focuses on the alignment between SDE and
                    human nature, student experiences, well-being, and results of SDE.
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
