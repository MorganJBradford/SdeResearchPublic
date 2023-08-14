import { Card, CardContent, CardHeader, CardMedia, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

type ResourceCardProps = {
  resource: {
    title: string,
    image: string,
    intro: string,
    link: string,
  }
}

export default function HomeResourceCard({ resource }: ResourceCardProps) {
  const theme = useTheme();

  return (
    <Link to={resource.link} style={{textDecoration: 'none'}}>
      <Card sx={{ maxWidth: 345, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', minHeight: '377px', minWidth: '356px' }}>
        <CardHeader
          title={resource.title}
        />
        <CardMedia
          component="img"
          height="194"
          image={resource.image}
          alt="Paella dish"
        />
        <CardContent>
          <Typography sx={{color: 'whitesmoke'}}>
            {resource.intro}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
