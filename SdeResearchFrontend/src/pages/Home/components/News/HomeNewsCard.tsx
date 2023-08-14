import {
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import DOMPurify from 'dompurify';
import { useTheme } from '@mui/material';

type NewsCardProps = {
  news: {
    title: string,
    createdAt: string,
    updatedAt: string,
    body: string,
  }
}

export default function HomeNewsCard({news}: NewsCardProps) {
  const theme = useTheme();

  const timestamp = news.createdAt !== news.updatedAt ? `Updated ${news.updatedAt}` : `Posted ${news.createdAt}`;

  return (
    <Card sx={{ width: '70vw', backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke' }}>
      <CardHeader
        subheaderTypographyProps={{color: 'whitesmoke'}}
        title={
          <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(news.title)}}>
          </span>
        }
        subheader={timestamp}
      />
      <CardContent sx={{paddingTop: '8px', color: 'whitesmoke'}}>
        <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(news.body)}}>
        </span>
      </CardContent>
    </Card>
  );
}
