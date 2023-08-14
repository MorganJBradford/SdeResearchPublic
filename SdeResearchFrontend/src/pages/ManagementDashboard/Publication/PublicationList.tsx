import { Grid, Paper, IconButton, useTheme } from "@mui/material";
import { styled } from '@mui/material/styles';
import { PractitionerPublication, AcademicPublication, PublicationForm, PublicationType } from "../../../utils/types";
import EditIcon from '@mui/icons-material/Edit';

type TopicListProps = {
  publication: AcademicPublication | PractitionerPublication,
  isAdmin: boolean,
  onIsEditingPublication: (topicIds: number[], publicationToEdit: PublicationForm, type: PublicationType) => void,
}


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  boxShadow: 'none',
  backgroundColor: theme.palette.primaryPalette.lighterColor
}));


export default function PublicationList({ publication, onIsEditingPublication, isAdmin }: TopicListProps) {
  const theme = useTheme();
  const formData: PublicationForm = {
    publicationId: publication.publicationId,
    publicationKey: publication.publicationKey,
    publicationUrl: publication.publicationUrl,
    citation: publication.citation,
    contactEmail: publication.contactEmail,
    isPublished: publication.isPublished,
    type: publication.type,
    linkToSource: publication.linkToSource,
    topicIds: publication.topicIds,
    topicCategoryIds: publication.topicCategoryIds
  }

  return (
    <Grid container sx={{ border: `1px solid ${theme.palette.primaryPalette.darkColor}` }} item xs={4} sm={4} md={2.5} margin={2} key={publication.publicationId}>
      <Item>
        {publication.citation}
        <Item>
          {isAdmin &&
            <IconButton
              onClick={() => onIsEditingPublication(publication.topicIds, formData, publication.type)}
            >
              <EditIcon />
            </IconButton>
          }
        </Item>
      </Item>
    </Grid>
  );
}
