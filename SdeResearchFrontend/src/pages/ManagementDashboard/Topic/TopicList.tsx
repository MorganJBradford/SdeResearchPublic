import { Grid, Paper, IconButton, useTheme } from "@mui/material";
import { styled } from '@mui/material/styles';
import { TopicManagerTopic } from "../../../utils/types";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

type TopicFormData = {
  topicId: number,
  topicName: string,
  categoryIds: number[],
  type: string
}

enum AddOrEditOptions {
  ADD = 'add-topic',
  EDIT = 'edit-topic'
}

type TopicListProps = {
  topic: TopicManagerTopic,
  isAdmin?: boolean,
  academic?: boolean,
  onIsEditingTopic: (topicToEdit: TopicFormData, endpoint: AddOrEditOptions|false) => void
}


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  boxShadow: 'none',
  color: theme.palette.primaryPalette.darkColor,
  backgroundColor: theme.palette.primaryPalette.lighterColor
}));


export default function TopicList({ topic, onIsEditingTopic, isAdmin, academic }: TopicListProps) {
  const theme = useTheme();
  const link = `/scholarship-summaries/${topic.topicName.replace(/\s/g, "")}`;

  const topicToPass: TopicFormData = {
    topicId: topic.topicId,
    topicName: topic.topicName,
    type: topic.type,
    categoryIds: topic.categoryIds
  }

  const handleIsPublishedIcon = (isPublished: boolean) => {
    return (
      <>
        {isPublished ?
          <CheckCircleOutlineIcon />
          :
          <HighlightOffIcon />
        }
        {isAdmin &&
          <Item>
            <IconButton onClick={() => onIsEditingTopic(topicToPass, AddOrEditOptions.EDIT)}>
              <EditIcon />
            </IconButton>
          </Item>
        }
      </>
    );
  }

  return (
    <Grid container item xs={4} sm={4} md={2.5} margin={2} justifyContent={'center'} sx={{border: `1px solid ${theme.palette.primaryPalette.darkColor}`}} key={topic.topicId}>
      {academic ?
        <Item>
          <Link to={link} state={{ topicId: topic.topicId }} style={{color: theme.palette.primaryPalette.darkColor}} >
            {topic.topicName}
          </Link>
          {handleIsPublishedIcon(topic.isTopicPagePublished)}
        </Item>
        :
        <Item>
          {topic.topicName}
          <Item>
            {isAdmin &&
              <IconButton onClick={() => onIsEditingTopic(topicToPass, AddOrEditOptions.EDIT)}>
                <EditIcon />
              </IconButton>
            }
          </Item>
        </Item>
      }
    </Grid>
  );
}
