import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

type ResourceCardProps = {
  resource: {
    title: string,
    subheader?: string,
    image: string,
    intro: string,
    link: string,
  }
}

export default function AboutCard({ resource }: ResourceCardProps) {

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: '#a8dadc' }}>
      <CardHeader
        title={resource.title}
        subheader={resource.subheader}
      />
      <Link to={resource.link}>
        <CardMedia
          component="img"
          height="194"
          image={resource.image}
          alt="Paella dish"
        />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {resource.intro}
        </Typography>
      </CardContent>
    </Card>
  );
}
