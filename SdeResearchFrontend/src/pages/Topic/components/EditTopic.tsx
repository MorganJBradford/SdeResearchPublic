
import { useReducer } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Grid, TextField, Typography, useTheme } from "@mui/material";
import TopicEditor from '../../ManagementDashboard/Topic/TopicEditor';
import { HttpStatusCode, ImageToUpload, ServerResponse, TopicSection, TopicWithDetails, VIEW_TYPE } from "../../../utils/types";
import ProfileCard from '../../../shared/ProfileCard';
import { AccordionControls, AccordionSection } from './AccordionComponents';
import EditorActions from './EditorActions';
import AssignResearcher from './AssignResearcher';
import ConfirmationDialog from '../../../shared/ConfirmationDialog';
import { API_ROUTES } from '../../../utils/constants';
import { enqueueSnackbar } from 'notistack';

type EditTopicProps = {
  topic: TopicWithDetails;
  expanded: number | false;
  isAdmin: boolean;
  onOpenAccordion: (panel: number | false) => void;
  onChangeView: (view: VIEW_TYPE) => void;
  getTopicById: (topicId: string) => void
}

enum ACTION_TYPE {
  EDIT_TITLE,
  EDIT_BODY,
  ADD_ACCORDION,
  REMOVE_ACCORDION,
  REPOSITION_ACCORDION,
  SET_DEFAULT_CONTENT,
  SET_IMAGE
}

type Action = {
  type: ACTION_TYPE.EDIT_TITLE | ACTION_TYPE.EDIT_BODY;
  payload: {
    value: string,
    index: number,
  };
} | {
  type: ACTION_TYPE.ADD_ACCORDION | ACTION_TYPE.REMOVE_ACCORDION;
  payload: number;
} | {
  type: ACTION_TYPE.REPOSITION_ACCORDION;
  payload: {
    index: number;
    up: boolean;
  }
} | {
  type: ACTION_TYPE.SET_IMAGE;
  payload: {
    imageFile?: File;
    imageSrc?: string | ArrayBuffer | null;
  }
} | {
  type: ACTION_TYPE.SET_DEFAULT_CONTENT;
}

type State = {
  editorContent: TopicSection[];
  defaultContent: TopicSection[];
  imageToUpload?: ImageToUpload;
  expanded: number | false;
}

const reducer = (state: State, action: Action) => {
  const { editorContent } = state;
  switch (action.type) {
    case ACTION_TYPE.EDIT_TITLE: {
      const { value, index } = action.payload;
      if (editorContent === null) return { ...state };
      let tempContent: TopicSection[] = [...editorContent];
      const contentToChange: TopicSection = {
        sectionId: editorContent[index].sectionId,
        sectionTitle: value,
        sectionBody: editorContent[index].sectionBody,
        displayOrder: editorContent[index].displayOrder
      };
      tempContent[index] = contentToChange;
      return { ...state, editorContent: tempContent };
    }
    case ACTION_TYPE.EDIT_BODY: {
      const { value, index } = action.payload;
      if (editorContent === null) return { ...state };
      let tempContent: TopicSection[] = [...editorContent];
      const contentToChange: TopicSection = {
        sectionId: editorContent[index].sectionId,
        sectionTitle: editorContent[index].sectionTitle,
        sectionBody: value,
        displayOrder: editorContent[index].displayOrder
      };
      tempContent[index] = contentToChange;
      return { ...state, editorContent: tempContent };
    }
    case ACTION_TYPE.ADD_ACCORDION: {
      if (editorContent === null) return { ...state };
      let tempContent = [...editorContent];
      const newAccordion = {
        sectionTitle: `Accordion ${action.payload + 1}`,
        sectionBody: `Accordion ${action.payload + 1}`,
        displayOrder: action.payload + 1
      };
      tempContent.splice(action.payload + 1, 0, newAccordion);
      tempContent.forEach((s: TopicSection, i: number) => {
        s.displayOrder = i
      });

      return { ...state, editorContent: tempContent }
    }
    case ACTION_TYPE.REMOVE_ACCORDION: {
      if (editorContent === null) return { ...state };
      let tempContent = [...editorContent];
      tempContent.splice(action.payload, 1);
      tempContent.forEach((s: TopicSection, i: number) => {
        s.displayOrder = i
      });
      return { ...state, editorContent: tempContent }
    }
    case ACTION_TYPE.REPOSITION_ACCORDION: {
      const { up, index } = action.payload;
      if (editorContent === null) return { ...state };
      if (up && index !== 0) {
        let tempContent = [...editorContent];
        tempContent.splice(index - 1, 0, tempContent.splice(index, 1)[0]);
        tempContent.forEach((s: TopicSection, i: number) => {
          s.displayOrder = i
        });
        return { ...state, editorContent: tempContent };
      }

      if (!up && index !== editorContent.length - 1) {
        let tempContent = [...editorContent];
        tempContent.splice(index + 1, 0, tempContent.splice(index, 1)[0]);
        tempContent.forEach((s: TopicSection, i: number) => {
          s.displayOrder = i
        });
        return { ...state, editorContent: tempContent };
      }
      return { ...state }
    }
    case ACTION_TYPE.SET_DEFAULT_CONTENT:
      return { ...state, defaultContent: editorContent }
    case ACTION_TYPE.SET_IMAGE:
      return { ...state, imageToUpload: { imageFile: action.payload.imageFile, imageSrc: action.payload.imageSrc } }
    default:
      return { ...state }
  }
}

const defaultSection: TopicSection = {
  sectionId: 0,
  displayOrder: 0,
  sectionTitle: "Edit me",
  sectionBody: "Edit me"
}

const defaultImage: ImageToUpload = {
  imageSrc: '',
}

export default function EditTopic({
  topic,
  expanded,
  isAdmin,
  onOpenAccordion,
  onChangeView,
  getTopicById
}: EditTopicProps) {
  const theme = useTheme();
  const initState: State = {
    editorContent: topic.details !== null
      ? topic.details.sections
      :
      [defaultSection],
    defaultContent: topic.details !== null
      ? topic.details.sections
      :
      [defaultSection],
    imageToUpload: defaultImage,
    expanded
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const { editorContent, defaultContent } = state;

  const showPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = x => {
        if (x.target !== null) {
          dispatch({ type: ACTION_TYPE.SET_IMAGE, payload: { imageSrc: x.target.result, imageFile } });
        }
      }
      reader.readAsDataURL(imageFile);
    } else {
      dispatch({ type: ACTION_TYPE.SET_IMAGE, payload: { imageFile: undefined, imageSrc: '' } });
    }
  }

  const handleOpenAccordion = (index: number) => {
    dispatch({ type: ACTION_TYPE.SET_DEFAULT_CONTENT });
    onOpenAccordion(index);
  }

  const handleAddNewAccordion = (i: number) => {
    dispatch({ type: ACTION_TYPE.ADD_ACCORDION, payload: i });
  }

  const handleRemoveAccordion = (i: number) => {
    dispatch({ type: ACTION_TYPE.REMOVE_ACCORDION, payload: i });
  }

  const handleAccordionPosition = (index: number, up: boolean = true) => {
    onOpenAccordion(false);
    dispatch({ type: ACTION_TYPE.REPOSITION_ACCORDION, payload: { index, up } });
  }

  const handleEditSectionTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const { value } = e.target;
    dispatch({ type: ACTION_TYPE.EDIT_TITLE, payload: { value, index } });
  }

  const handleEditSectionBody = (value: string, index: number) => {
    dispatch({ type: ACTION_TYPE.EDIT_BODY, payload: { value, index } });
  }

  const previewImage = state.imageToUpload?.imageSrc === "" ? topic.details?.imageUrl : state.imageToUpload?.imageSrc;

  const deleteHeaderPhoto = () => {
    if (topic.details === null || (topic.details !== null && topic.details.imageKey === "")) return;
    const url = `${API_ROUTES.MEDIA.DELETE_TOPIC_PICTURE}?key=${topic.details.imageKey}`;

    fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 4000 });
          getTopicById(`${topic.topicId}`);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 4000 });
        }
      }).catch((error) => {
        console.error(error);
      })
  }

  const deleteDialogProps = {
    title: 'Delete Photo',
    description: 'Are you sure you want to delete the banner photo?',
    openDialogButtonProps: {
      styles: { display: 'flex', justifyContent: 'center', backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', "&:hover": { backgroundColor: 'red' } },
      text: 'Delete Photo'
    },
    confirmationButtonProps: {
      styles: { margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', "&:hover": { backgroundColor: 'red' } },
      text: 'Delete',
      onConfirm: () => deleteHeaderPhoto()
    }
  }

  return (
    <>
      <div style={{ width: '100vw', padding: '4vw' }}>
        {(typeof (previewImage) === 'string' && previewImage !== '') &&
          <img
            src={previewImage}
            style={{ width: '50vw', display: 'flex', aspectRatio: '16/9', margin: '0 auto' }}
            alt="banner"
          />
        }
      </div>
      <Grid container spacing={2} marginTop={6} justifyContent='space-around' >
        {(topic.details !== null && topic.details.imageUrl !== "") &&
          <ConfirmationDialog
            dialogTitle={deleteDialogProps.title}
            dialogDescription={deleteDialogProps.description}
            openDialogButtonProps={deleteDialogProps.openDialogButtonProps}
            confirmationButtonProps={deleteDialogProps.confirmationButtonProps}
          />
        }
        <Grid item xs={12}>
          <label style={{ display: 'flex', justifyContent: 'center' }}>Banner Photo</label>
          <input style={{ display: 'block', margin: '12px auto' }} accept='image/*' name='topicImage' type='file' onChange={(e) => showPreview(e)} />
        </Grid>
        <Grid item xs={12} md={7}>
          {editorContent !== null &&
            editorContent.map((section: TopicSection, i: number) =>
              i === expanded ?
                <>
                  <Accordion expanded={i === expanded} sx={{ backgroundColor: theme.palette.primaryPalette.lightColor }}>
                    <AccordionSummary
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <TextField
                        type='text'
                        name='sectionTitle'
                        label='Section Title'
                        onChange={(e) => handleEditSectionTitle(e, i)}
                        defaultValue={defaultContent[i].sectionTitle}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <TopicEditor sectionIndex={i} contentToEdit={defaultContent[i].sectionBody} onEditChange={handleEditSectionBody} />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <AccordionControls
                    i={i}
                    contentToEdit={editorContent}
                    onRemoveAccordion={handleRemoveAccordion}
                    onAddNewAccordion={handleAddNewAccordion}
                    onRepositionAccordion={handleAccordionPosition}
                  />
                </>
                :
                <>
                  <AccordionSection section={section} i={i} expanded={expanded} onOpenAccordion={() => handleOpenAccordion(i)} backgroundColor={theme.palette.primaryPalette.lightColor} />
                  <AccordionControls
                    i={i}
                    contentToEdit={editorContent}
                    onRemoveAccordion={handleRemoveAccordion}
                    onAddNewAccordion={handleAddNewAccordion}
                    onRepositionAccordion={handleAccordionPosition}
                  />
                </>
            )
          }
        </Grid>
        {topic.details !== null &&
          <Grid item xs={12} md={4}>
            <ProfileCard researcher={topic.details.researcher} sx={{ width: { sm: '100vw', md: '100%' }, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke' }} />
          </Grid>
        }
        {isAdmin &&
          <AssignResearcher
            authorId={topic.details !== null ? topic.details.researcherId : 0}
            authorName={topic.details !== null ? `${topic.details.researcher.firstName} ${topic.details.researcher.lastName}` : ''}
            hasDetails={topic.details !== null ? true : false}
            topicId={topic.topicId}
          />
        }
      </Grid>
      <EditorActions
        topicId={topic.topicId}
        topicName={topic.topicName}
        isAdmin={isAdmin}
        getTopicById={getTopicById}
        imageToUpload={state.imageToUpload}
        imageKey={topic.details?.imageKey ?? ""}
        imageUrl={topic.details?.imageUrl ?? ""}
        contentToEdit={editorContent}
        detailsId={topic.details !== null ? topic.details.topicDetailsId : 0}
        isPublished={topic.isTopicPagePublished}
        cancelEditing={() => onChangeView(VIEW_TYPE.VIEW)}
      />
    </>
  );
}
