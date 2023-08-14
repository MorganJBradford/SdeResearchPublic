import { useContext } from 'react';
import { Button, Grid, useTheme } from "@mui/material";
import ConfirmationDialog from "../../../shared/ConfirmationDialog";
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

import { GlobalContext } from "../../../contexts/GlobalContext";
import { API_ROUTES } from '../../../utils/constants';
import * as ROUTES from '../../../utils/routes';
import { GetPreSignedUrlResponseDto, HttpStatusCode, ImageToUpload, PreSignedUrlData, ServerResponse, TopicSection } from '../../../utils/types';

type EditorActionProps = {
  topicId: number;
  topicName: string;
  imageKey: string;
  imageUrl: string;
  isPublished: boolean;
  detailsId: number;
  contentToEdit: TopicSection[];
  isAdmin: boolean;
  cancelEditing: () => void;
  getTopicById: (topicId: string) => void;
  imageToUpload?: ImageToUpload
}

export default function EditorActions({
  topicId,
  topicName,
  isPublished,
  detailsId,
  contentToEdit,
  isAdmin,
  imageKey,
  imageUrl,
  imageToUpload,
  cancelEditing,
  getTopicById
}: EditorActionProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getPublishedTopics } = useContext(GlobalContext);

  const onSubmit = () => {
    if (imageToUpload && imageToUpload.imageFile) {
      getPresignedUrl();
      return;
    } else {
      handleUpdateTopicDetails();
    }
  }

  const getPresignedUrl = () => {
    let url = `${API_ROUTES.MEDIA.GET_TOPIC_PICTURE_UPLOAD_URL}?detailsId=${detailsId}`;

    if (imageKey !== "") url += `&key=${imageKey}`;

    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: GetPreSignedUrlResponseDto) => {
        const { statusCode, data } = serverResponse;
        if (statusCode === HttpStatusCode.OK)
          uploadImage(data);
      }).catch((error) => {
        console.error(error);
      });
  }

  const uploadImage = (urlData: PreSignedUrlData) => {
    if (urlData.url === undefined || imageToUpload?.imageFile === undefined) return;

    const url = urlData.url;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/*',
      },
      body: imageToUpload.imageFile
    }).then((res) => {
      if (res.ok) {
        const imageUrl = res.url.split('?')[0];
        handleUpdateTopicDetails(imageUrl, urlData.key);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleUpdateTopicDetails = (imageUploadUrl?: string, imageUploadKey?: string) => {
    const url = API_ROUTES.TOPIC.UPDATE_TOPIC;

    const topicSections: TopicSection[] = contentToEdit.map((c: TopicSection) => {
      return {
        sectionId: c.sectionId ? c.sectionId : 0,
        sectionTitle: c.sectionTitle,
        sectionBody: c.sectionBody,
        displayOrder: c.displayOrder
      }
    });

    const dataToPass = {
      topicId: topicId,
      topicDetailsId: detailsId,
      sections: topicSections,
      imageUrl: imageUploadUrl ?? imageUrl,
      imageKey: imageUploadKey ?? imageKey
    }

    fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(dataToPass)
    })
      .then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse
        if (statusCode === HttpStatusCode.Created) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          getTopicById(`${topicId}`);
          cancelEditing();
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  const handlePublishTopic = () => {
    const url = API_ROUTES.TOPIC.PUBLISH_TOPIC_PAGE;

    const dataToPass = {
      topicId: topicId,
      isTopicPagePublished: !isPublished
    }

    fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          cancelEditing();
          getPublishedTopics();
          getTopicById(`${topicId}`);
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((error => {
        console.error(error);
      }));
  }

  const deleteTopicById = () => {
    const url = `${API_ROUTES.TOPIC.DELETE_TOPIC_BY_ID}/${topicId}`;

    fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          navigate(ROUTES.MANAGEMENT_DASHBOARD);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((error => {
        console.error(error);
      }));
  }

  const saveChangesDialogProps = {
    openDialogButtonProps: {
      styles: { margin: 2, color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: 'green' } },
      text: 'Update'
    },
    confirmationButtonProps: {
      styles: { margin: 2, color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: 'green' } },
      text: 'Save',
      onConfirm: () => onSubmit()
    }
  }

  const hideOrPublishProps = {
    title: isPublished ? 'Hide Scholarship Summary' : 'Publish',
    description: isPublished ? `Make ${topicName} scholarship summary private?` : `Publish ${topicName} scholarship summary?`,
    openDialogButtonProps: {
      styles: { margin: 2, color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: isPublished ? 'red' : 'green' } },
      text: isPublished ? 'Hide' : 'Publish'
    },
    confirmationButtonProps: {
      styles: { margin: 2, color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: isPublished ? 'red' : 'green' } },
      text: isPublished ? 'Hide' : 'Publish',
      onConfirm: () => handlePublishTopic()
    }
  }


  const deleteDialogProps = {
    title: `Delete ${topicName}`,
    description: `Are you sure you want to delete topic "${topicName}?" This will remove all associated publications. Select "Make Private" if you do not wish to delete associated publications`,
    openDialogButtonProps: {
      styles: { margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', "&:hover": { backgroundColor: 'red' } },
      text: 'Delete'
    },
    confirmationButtonProps: {
      styles: { margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', "&:hover": { backgroundColor: 'red' } },
      text: 'Delete',
      onConfirm: () => deleteTopicById()
    }
  }

  return (
    <Grid container item justifyContent={'center'}>
      <Button sx={{ margin: 2, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', "&:hover": { backgroundColor: theme.palette.primaryPalette.blueColor } }} onClick={cancelEditing}>Cancel</Button>
      <ConfirmationDialog
        openDialogButtonProps={saveChangesDialogProps.openDialogButtonProps}
        confirmationButtonProps={saveChangesDialogProps.confirmationButtonProps}
        dialogDescription={`Save changes to the ${topicName} page?`}
        dialogTitle='Save'
      />
      {isAdmin &&
        <>
          <ConfirmationDialog
            dialogTitle={deleteDialogProps.title}
            dialogDescription={deleteDialogProps.description}
            openDialogButtonProps={deleteDialogProps.openDialogButtonProps}
            confirmationButtonProps={deleteDialogProps.confirmationButtonProps}
          />
          {detailsId !== 0 &&
            <ConfirmationDialog
              openDialogButtonProps={hideOrPublishProps.openDialogButtonProps}
              confirmationButtonProps={hideOrPublishProps.confirmationButtonProps}
              dialogDescription={hideOrPublishProps.description}
              dialogTitle={hideOrPublishProps.title}
            />
          }
        </>
      }
    </Grid>
  );
}
