import { useContext } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import ConfirmationDialog from '../../../shared/ConfirmationDialog';

import { PublicationFormFieldName, PublicationType, PublicationTypeOrFalse, Topic, TopicIdNameTopicCategoriesDto, ServerResponse, HttpStatusCode } from '../../../utils/types';
import { API_ROUTES } from '../../../utils/constants';
import { GlobalContext } from '../../../contexts/GlobalContext';

type AddOrEditPublicationProps = {
  isEditing: boolean,
  categoriesByTopic: TopicIdNameTopicCategoriesDto[],
  citation: string,
  linkToSource: string,
  publicationId: number,
  publicationKey: string,
  isPublished: boolean,
  contactEmail: string,
  type: PublicationTypeOrFalse,
  topics: Topic[],
  topicIds: number[],
  topicCategoryIds: number[],
  getPublicationsSortedByType: () => void,
  onFileChangeAction: (pdfFile: File) => void,
  onSubmit: (e: React.FormEvent) => void,
  getTopicsByType: (type: PublicationType) => void,
  getTopicCategoriesByTopicIds: (topicIds: number[]) => void,
  onTextChangeAction: (fieldName: PublicationFormFieldName, value: string) => void,
  onTopicCategoryCheckboxChangeAction: (ids: number[]) => void,
  onUpdateCheckboxesAction: (topicIds: number[], topicCategoryIds: number[], categoriesByTopic: TopicIdNameTopicCategoriesDto[]) => void
  resetPublicationForm: (isChanged: boolean) => void,
}


export default function AddOrEditPublication({
  categoriesByTopic,
  citation,
  linkToSource,
  contactEmail,
  isEditing,
  isPublished,
  type,
  topics,
  topicIds,
  publicationKey,
  publicationId,
  topicCategoryIds,
  getPublicationsSortedByType,
  onUpdateCheckboxesAction,
  onFileChangeAction,
  onSubmit,
  onTextChangeAction,
  onTopicCategoryCheckboxChangeAction,
  getTopicCategoriesByTopicIds,
  resetPublicationForm,
  getTopicsByType,
}: AddOrEditPublicationProps) {
  const theme = useTheme();
  const { user } = useContext(GlobalContext);

  const onSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = e.target;
    const valueToPass = value === 'academic' ? value : 'practitioner';
    getTopicsByType(valueToPass);
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    if (!['citation', 'linkToSource', 'contactEmail'].includes(name)) return;
    const fieldName = name as PublicationFormFieldName;
    onTextChangeAction(fieldName, value);
  }

  const onTopicCheckboxChange = (topicId: number) => {
    let tempArr = [...topicIds];

    if (tempArr.includes(topicId)) {
      tempArr = tempArr.filter(id => id !== topicId);
    } else {
      tempArr.push(topicId);
    }

    let relevantTopicCategories = categoriesByTopic.find(t => t.topicId === topicId);
    let relevantTopicCategoryIds = relevantTopicCategories
      ? relevantTopicCategories.topicCategories.map(tc => tc.topicCategoryId)
      : [];

    let updatedTopicCategoryIds = topicCategoryIds.filter(id => !relevantTopicCategoryIds.includes(id));
    let updatedCategoriesByTopic = categoriesByTopic.filter(t => t.topicId !== topicId);

    onUpdateCheckboxesAction(tempArr, updatedTopicCategoryIds, updatedCategoriesByTopic);

    getTopicCategoriesByTopicIds(tempArr);
  }


  const onTopicCategoryCheckboxChange = (topicCategoryId: number) => {
    let tempArr = topicCategoryIds;

    const index = tempArr.indexOf(topicCategoryId);

    if (index !== -1) {
      tempArr.splice(index, 1);
    } else {
      tempArr.push(topicCategoryId);
    }

    tempArr = tempArr.sort();

    onTopicCategoryCheckboxChangeAction(tempArr);
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let pdfFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = x => {
        if (x.target !== null) {
          onFileChangeAction(pdfFile);
        }
      }
      reader.readAsDataURL(pdfFile);
    }
  }

  const handleFindDefaultCheckboxValues = (id: number, isTopicCategory: boolean = false) => {
    const tempArr = isTopicCategory ? topicCategoryIds : topicIds;
    const index = tempArr.indexOf(id);

    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  const deletePublicationFile = () => {
    if (publicationKey === '') return;
    const url = `${API_ROUTES.MEDIA.DELETE_PUBLICATION}?key=${publicationKey}`;

    fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;

        if (statusCode === HttpStatusCode.OK) {
          getPublicationsSortedByType();
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000 });
          resetPublicationForm(true);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const deletePublication = () => {
    if (publicationKey !== "") {
      deletePublicationFile();
    }
    const url = `${API_ROUTES.PUBLICATION.DELETE_PUBLICATION}?id=${publicationId}`;

    fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          getPublicationsSortedByType();
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          resetPublicationForm(true);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const deletePublicationFileDialogProps = {
    dialogTitle: 'Delete File',
    dialogDescription: 'Are you sure you want to delete the file associated with this publication?',
    confirmationButtonProps: {
      text: 'DELETE',
      onConfirm: () => deletePublicationFile(),
      styles: { color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: 'red'} },
    },
    openDialogButtonProps: {
      text: 'DELETE UPLOADED FILE',
      styles: { color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: 'red'} },
    }
  }

  const deletePublicationDialogProps = {
    dialogTitle: 'Delete Publication?',
    dialogDescription: 'Are you sure you want to delete this publication?',
    confirmationButtonProps: {
      text: 'DELETE',
      onConfirm: () => deletePublication(),
      styles: { color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: 'red'} },
    },
    openDialogButtonProps: {
      text: 'DELETE PUBLICATION',
      styles: { color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: 'red'} },
    }
  }


  const onPublishPublication = () => {
    const url = `${API_ROUTES.PUBLICATION.PUBLISH_PUBLICATION}?id=${publicationId}`;

    fetch(url, {
      method: 'PUT',
      credentials: 'include'
    }).then(res => res.json())
    .then((serverResponse: ServerResponse) => {
      const { statusCode, message } = serverResponse;
      if (statusCode === HttpStatusCode.OK) {
        enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000});
        resetPublicationForm(true);
      } else {
        enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000});
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <FormControl>
        <TextField value={type} defaultValue={type} name='type' sx={{ margin: 2 }} select label='Type' onChange={(e) => onSelectChange(e)}>
          <MenuItem value='academic'>Academic Publications</MenuItem>
          <MenuItem value={'practitioner'}>Practitioner Publications</MenuItem>
        </TextField>
        <FormGroup>
          <FormLabel>Topics</FormLabel>
          {topics.map((topic: Topic) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    name='topics'
                    value={topic.topicName}
                    checked={handleFindDefaultCheckboxValues(topic.topicId, false)}
                    onChange={() => onTopicCheckboxChange(topic.topicId)}
                  />
                }
                label={topic.topicName}
              />
            );
          })}
        </FormGroup>
        {categoriesByTopic.length > 0 &&
          <FormGroup>
            <FormLabel>Categories By Topic</FormLabel>
            {categoriesByTopic.map((topic: any) => {
              return (
                <>
                  <Typography variant={'body1'} fontWeight={700} padding={2}>{topic.topicName} categories:</Typography>
                  {topic.topicCategories.map((tc: any) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            name='topics'
                            value={tc.topicCategoryId}
                            checked={handleFindDefaultCheckboxValues(tc.topicCategoryId, true)}
                            onChange={() => onTopicCategoryCheckboxChange(tc.topicCategoryId)}
                          />
                        }
                        label={tc.categoryName}
                      />
                    );
                  })}
                </>
              )
            }
            )}
          </FormGroup>
        }
        <TextField
          required
          name="citation"
          type="text"
          label="Citation"
          value={citation}
          sx={{ margin: 2 }}
          onChange={(e) => onTextChange(e)}
        />
        <TextField
          name="linkToSource"
          type="text"
          label="Link to publication host"
          value={linkToSource}
          sx={{ margin: 2 }}
          onChange={(e) => onTextChange(e)}
        />
        <TextField
          name="contactEmail"
          type="email"
          label="Contact email"
          value={contactEmail}
          sx={{ margin: 2 }}
          onChange={(e) => onTextChange(e)}
        />
        <input type='file' accept='.pdf' onChange={(e) => onFileChange(e)} />
        {publicationKey !== '' &&
          <div style={{ margin: '12px' }}>
            <ConfirmationDialog
              dialogTitle={deletePublicationFileDialogProps.dialogTitle}
              dialogDescription={deletePublicationFileDialogProps.dialogDescription}
              openDialogButtonProps={deletePublicationFileDialogProps.openDialogButtonProps}
              confirmationButtonProps={deletePublicationFileDialogProps.confirmationButtonProps}
            />
          </div>
        }
        {isEditing &&
          <div style={{ margin: '12px' }}>
            <ConfirmationDialog
              dialogTitle={deletePublicationDialogProps.dialogTitle}
              dialogDescription={deletePublicationDialogProps.dialogDescription}
              openDialogButtonProps={deletePublicationDialogProps.openDialogButtonProps}
              confirmationButtonProps={deletePublicationDialogProps.confirmationButtonProps}
            />
          </div>
        }
        <Button sx={{ margin: 2, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => resetPublicationForm(false)}>Cancel</Button>
        <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type='submit'>Submit</Button>
        {(isEditing && user.isAdmin)&&
          <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: isPublished ? 'red' : 'green'}}} onClick={() => onPublishPublication()}>{isPublished ? 'Hide' : 'Publish'}</Button>
        }
      </FormControl>
    </form>
  );
}
