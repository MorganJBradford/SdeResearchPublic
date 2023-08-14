import { Button, Card, CardActions, CardContent, Typography, useTheme } from '@mui/material';
import { BasePublication } from '../../utils/types';
import PublicationEmail from '../../shared/PublicationEmail';

type PublicationCardProps = {
  publication: BasePublication
}

export default function PublicationCard({publication}: PublicationCardProps) {
  const theme = useTheme();

  const onDownload = () => {
    const pdfUrl = publication.publicationUrl;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <Card sx={{width: {sm: '98vw', md: '100%'}, marginBottom: '20px', backgroundColor: theme.palette.primaryPalette.lightColor, border: '1px solid black'}}>
      <CardContent>
        <Typography gutterBottom component="div">
          <strong>
            {publication.citation}
          </strong>
        </Typography>
      </CardContent>
      <CardActions>
        {publication.publicationUrl !== '' &&
          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={onDownload} size="small">Download PDF</Button>
        }
        {publication.linkToSource !== '' &&
          <a href={publication.linkToSource} rel='noopener noreferrer' target='_blank'>
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} size="small">Website</Button>
          </a>
        }
        <PublicationEmail citation={publication.citation} email={publication.contactEmail}/>
      </CardActions>
    </Card>
  );
}
