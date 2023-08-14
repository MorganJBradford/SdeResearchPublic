import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

interface YouTubePreviewProps {
  videoId: string;
  width?: number;
  height?: number;
}

const YouTubePreview: React.FC<YouTubePreviewProps> = ({ videoId, width = 345, height = 194 }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div>
      <iframe
        width={width}
        height={height}
        src={videoUrl}
        title="YouTube video preview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

type ResourceCardProps = {
  resource: {
    image?: string,
    description: string,
    link?: string,
    youtubeId?: string,
  },
}

export default function MediaCard({ resource }: ResourceCardProps) {
  const theme = useTheme();
  return (
    <Card sx={{ maxWidth: 345, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', height: '340px' }}>
      <CardHeader />
      {resource.youtubeId ?
        <YouTubePreview videoId={resource.youtubeId} />
        :
        <a target="_blank" rel='noopener noreferrer' href={resource.link}>
          <CardMedia
            component="img"
            height="194"
            image={resource.image}
            alt="Paella dish"
          />
        </a>
      }
      <CardContent>
        <Typography color={'whitesmoke'}>
          {resource.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
