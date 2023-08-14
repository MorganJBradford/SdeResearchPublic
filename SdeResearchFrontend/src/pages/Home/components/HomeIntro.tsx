import { Button, CardMedia, Grid, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
export default function Intro() {
  const theme = useTheme();
  return (
    <Grid container item marginX={12} marginY={8} alignItems={'center'} justifyContent={'center'}>
      <Grid item xs={12} md={8} style={{ backgroundColor: theme.palette.primaryPalette.lighterColor }}>
        <h1>
          Our Purpose
        </h1>
        <p style={{ fontSize: '28px', lineHeight: '1.3' }}>
          The purpose of the SDE Research Group is to <br/> provide access to and support further
          research <br/> in the field of self-directed education.
        </p>
        <Button>
          <Link to="/purpose">
            Learn More
          </Link>
        </Button>
      </Grid>
      <Grid item xs={12} md={4}>
        <CardMedia src='https://drive.google.com/uc?export=view&id=12uPsUT3gRcVw-M3YOEVYIGU9ajlBuujR' component={'img'} />
      </Grid>
    </Grid>
  );
}
