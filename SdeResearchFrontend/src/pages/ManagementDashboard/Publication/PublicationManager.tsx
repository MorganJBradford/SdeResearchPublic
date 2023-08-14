import { useContext, useEffect, useReducer } from 'react';

import {
  Button,
  Grid,
  Typography,
  useTheme
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';

import { AcademicPublication, PractitionerPublication, GetPublicationsSortedByType, GetTopics, Topic, GetTopicCategoriesSortedByTopicNameResponseDto, TopicIdNameTopicCategoriesDto, PublicationForm, GetPreSignedUrlResponseDto, PreSignedUrlData, PublicationTypeOrFalse, PublicationType, PublicationFormFieldName, HttpStatusCode, ServerResponse } from '../../../utils/types';
import { API_ROUTES } from '../../../utils/constants';
import { GlobalContext } from '../../../contexts/GlobalContext';
import PublicationList from './PublicationList';
import AddOrEditPublication from './AddOrEditPublications';

type ReducerState = {
  isAddingOrEditing: AddOrEditOptions,
  academicPublications: AcademicPublication[],
  practitionerPublications: PractitionerPublication[],
  topics: Topic[],
  categoriesByTopic: TopicIdNameTopicCategoriesDto[],
  publicationFormData: PublicationForm,
  pdfToUpload?: File
}

const defaultFormData: PublicationForm = {
  publicationId: 0,
  citation: '',
  linkToSource: '',
  isPublished: false,
  publicationKey: '',
  publicationUrl: '',
  contactEmail: '',
  type: false,
  topicCategoryIds: [],
  topicIds: []
}

enum REDUCER_ACTION_TYPE {
  IS_EDITING,
  IS_ADDING,
  FILE_INPUT_CHANGE,
  GET_PUBLICATIONS_BY_TYPE,
  SELECT_INPUT_INIT_OR_CHANGE,
  SET_PUBLICATIONS,
  TOPIC_CATEGORIES_CHECKBOX_INPUT_CHANGE,
  TOPICS_CHECKBOX_INPUT_CHANGE,
  TEXT_INPUT_CHANGE,
  SET_PUBLICATION_URL,
  RESET_PUBLICATION_FORM,
  UPDATE_EDIT_FORM_CHECKBOXES,
}


type IsAddingAction = {
  type: REDUCER_ACTION_TYPE.IS_ADDING,
  payload: {
    publicationFormData: PublicationForm,
    type: PublicationTypeOrFalse
  }
}

type IsEditingAction = {
  type: REDUCER_ACTION_TYPE.IS_EDITING,
  payload: {
    idsToPass: number[],
    categoriesByTopic: TopicIdNameTopicCategoriesDto[],
    publicationFormData: PublicationForm,
    type: PublicationTypeOrFalse
  }
}

type ResetPublicationFormAction = {
  type: REDUCER_ACTION_TYPE.RESET_PUBLICATION_FORM,
  payload: {
    isAddingOrEditing: AddOrEditOptions.FALSE,
    publicationFormData: PublicationForm
  }
}

type SelectInputInitOrChange = {
  type: REDUCER_ACTION_TYPE.SELECT_INPUT_INIT_OR_CHANGE,
  payload: {
    type: PublicationType,
    topics: Topic[]
  }
}

type TopicCheckBoxInputChangeAction = {
  type: REDUCER_ACTION_TYPE.TOPICS_CHECKBOX_INPUT_CHANGE,
  payload: {
    idsToPass: number[],
    categoriesByTopic: TopicIdNameTopicCategoriesDto[]
  }
}

type TopicCategoryCheckboxInputChangeAction = {
  type: REDUCER_ACTION_TYPE.TOPIC_CATEGORIES_CHECKBOX_INPUT_CHANGE,
  payload: {
    idsToPass: number[]
  }
}

type TextInputChangeAction = {
  type: REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE,
  payload: {
    field: PublicationFormFieldName,
    textValue: string,
  }
}

type FileInputChangeACtion = {
  type: REDUCER_ACTION_TYPE.FILE_INPUT_CHANGE,
  payload: File
}

type GetTopicsByTypeAction = {
  type: REDUCER_ACTION_TYPE.GET_PUBLICATIONS_BY_TYPE,
  payload: {
    isAddingOrEditing: AddOrEditOptions,
    type: PublicationTypeOrFalse
  }
}

type SetPublicationsAction = {
  type: REDUCER_ACTION_TYPE.SET_PUBLICATIONS,
  payload: {
    academicPublications: AcademicPublication[],
    practitionerPublications: PractitionerPublication[]
  }
}

type SetPublicationUrlAction = {
  type: REDUCER_ACTION_TYPE.SET_PUBLICATION_URL,
  payload: {
    publicationUrl: string,
    publicationKey: string
  }
}

type UpdateEditFormCheckboxesAction = {
  type: REDUCER_ACTION_TYPE.UPDATE_EDIT_FORM_CHECKBOXES,
  payload: {
    categoriesByTopic: TopicIdNameTopicCategoriesDto[],
    topicCategoryIds: number[],
    topicIds: number[],
  }
}

type ReducerAction =
  IsAddingAction | IsEditingAction | SelectInputInitOrChange | TextInputChangeAction
  | SetPublicationsAction | TopicCheckBoxInputChangeAction
  | TopicCategoryCheckboxInputChangeAction | GetTopicsByTypeAction
  | FileInputChangeACtion | SetPublicationUrlAction | ResetPublicationFormAction
  | UpdateEditFormCheckboxesAction;

type ApiRequest = {
  url: string,
  method: string,
}

enum AddOrEditOptions {
  ADD,
  EDIT,
  FALSE,
}

const reducer = (state: ReducerState, action: ReducerAction) => {
  const { publicationFormData } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.IS_ADDING:
      return {
        ...state,
        isAddingOrEditing: AddOrEditOptions.ADD,
        publicationFormData: {
          ...action.payload.publicationFormData,
          type: action.payload.type,
          topicIds: [],
          topicCategoryIds: []
        }
      }
    case REDUCER_ACTION_TYPE.IS_EDITING:
      return {
        ...state,
        isAddingOrEditing: AddOrEditOptions.EDIT,
        categoriesByTopic: action.payload.categoriesByTopic,
        publicationFormData: {
          ...action.payload.publicationFormData,
          topicIds: action.payload.idsToPass
        }
      }
    case REDUCER_ACTION_TYPE.RESET_PUBLICATION_FORM:
      return {
        ...state,
        categoriesByTopic: [],
        pdfToUpload: undefined,
        isAddingOrEditing: action.payload.isAddingOrEditing,
        publicationFormData: action.payload.publicationFormData
      }
    case REDUCER_ACTION_TYPE.SELECT_INPUT_INIT_OR_CHANGE:
      return {
        ...state,
        topics: action.payload.topics,
        categoriesByTopic: [],
        publicationFormData: {
          ...publicationFormData,
          topicIds: [],
          type: action.payload.type
        }
      }
    case REDUCER_ACTION_TYPE.TOPICS_CHECKBOX_INPUT_CHANGE:
      return {
        ...state,
        categoriesByTopic: action.payload.categoriesByTopic,
        publicationFormData: {
          ...publicationFormData,
          topicIds: action.payload.idsToPass
        }
      }
    case REDUCER_ACTION_TYPE.TOPIC_CATEGORIES_CHECKBOX_INPUT_CHANGE:
      return {
        ...state,
        publicationFormData: {
          ...publicationFormData,
          topicCategoryIds: action.payload.idsToPass
        }
      }
    case REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE:
      return {
        ...state,
        publicationFormData: {
          ...publicationFormData,
          [action.payload.field]: action.payload.textValue
        }
      }
    case REDUCER_ACTION_TYPE.FILE_INPUT_CHANGE:
      return {
        ...state,
        pdfToUpload: action.payload
      }
    case REDUCER_ACTION_TYPE.GET_PUBLICATIONS_BY_TYPE:
      return {
        ...state,
        isAddingOrEditing: action.payload.isAddingOrEditing,
        categoriesByTopic: [],
        publicationFormData: {
          ...defaultFormData,
          type: action.payload.type
        }
      }
    case REDUCER_ACTION_TYPE.SET_PUBLICATIONS:
      return {
        ...state,
        academicPublications: action.payload.academicPublications,
        practitionerPublications: action.payload.practitionerPublications
      }
    case REDUCER_ACTION_TYPE.SET_PUBLICATION_URL:
      return {
        ...state,
        publicationFormData: {
          ...publicationFormData,
          publicationUrl: action.payload.publicationUrl,
          publicationKey: action.payload.publicationKey
        }
      }
    case REDUCER_ACTION_TYPE.UPDATE_EDIT_FORM_CHECKBOXES:
      return {
        ...state,
        categoriesByTopic: action.payload.categoriesByTopic,
        publicationFormData: {
          ...state.publicationFormData,
          topicIds: action.payload.topicIds,
          topicCategoryIds: action.payload.topicCategoryIds
        }
      }
    default:
      return { ...state }
  }
}

export default function PublicationManager() {
  const theme = useTheme();
  const { user } = useContext(GlobalContext);
  const { state } = useLocation();
  const initState: ReducerState = {
    isAddingOrEditing: AddOrEditOptions.FALSE,
    academicPublications: [],
    practitionerPublications: [],
    topics: [],
    categoriesByTopic: [],
    publicationFormData: { ...defaultFormData, type: state.topicType}
  }
  const [reducerState, dispatch] = useReducer(reducer, initState);

  const handleFileChangeAction = (pdfFile: File) => dispatch({ type: REDUCER_ACTION_TYPE.FILE_INPUT_CHANGE, payload: pdfFile });

  const handleResetPublicationForm = (isChanged: boolean) => {
    if (isChanged) getPublicationsSortedByType();
    dispatch({ type: REDUCER_ACTION_TYPE.RESET_PUBLICATION_FORM, payload: { isAddingOrEditing: AddOrEditOptions.FALSE, publicationFormData: initState.publicationFormData } });
  }

  const handleTopicCategoryCheckboxChangeAction = (ids: number[]) => dispatch({ type: REDUCER_ACTION_TYPE.TOPIC_CATEGORIES_CHECKBOX_INPUT_CHANGE, payload: { idsToPass: ids } });

  const handleTextChangeAction = (fieldName: PublicationFormFieldName, value: string) => dispatch({ type: REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE, payload: { field: fieldName, textValue: value } });

  const handleUpdateCheckboxes = (topicIds: number[], topicCategoryIds: number[], categoriesByTopic: TopicIdNameTopicCategoriesDto[]) : void => {
    dispatch({ type: REDUCER_ACTION_TYPE.UPDATE_EDIT_FORM_CHECKBOXES, payload: { topicIds, topicCategoryIds, categoriesByTopic }})
  }

  const handleIsAddingOrEditingPublication = (topicIds: number[], publicationFormData: PublicationForm, type: PublicationType) => {
    getTopicCategoriesByTopicIds(topicIds, publicationFormData, type);
  }

  const getPublicationsSortedByType = (): void => {
    const url = API_ROUTES.PUBLICATION.GET_PUBLICATIONS_SORTED_BY_TYPE;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: GetPublicationsSortedByType) => {
        const { statusCode } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          const { academicPublications, practitionerPublications } = serverResponse.data;
          dispatch({ type: REDUCER_ACTION_TYPE.SET_PUBLICATIONS, payload: { academicPublications: academicPublications, practitionerPublications: practitionerPublications } });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const getTopicsByType = (valueToPass: PublicationType) => {
    const url = `${API_ROUTES.TOPIC.GET_TOPICS_BY_TYPE}/${valueToPass}`;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
      .then((serverResponse: GetTopics) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          dispatch({ type: REDUCER_ACTION_TYPE.SELECT_INPUT_INIT_OR_CHANGE, payload: { type: valueToPass, topics: serverResponse.data } });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
          const reducerPayload: PublicationType = valueToPass === 'academic' ? 'practitioner' : 'academic';
          dispatch({ type: REDUCER_ACTION_TYPE.GET_PUBLICATIONS_BY_TYPE, payload: { type: reducerPayload, isAddingOrEditing: reducerState.isAddingOrEditing } });
        }
      }).catch((error) => {
        console.error(error);
      });
  }


  const getTopicCategoriesByTopicIds = (topicIds: number[],  publicationFormData?: PublicationForm, type?: PublicationType) => {
    if (topicIds.length === 0) {
      dispatch({ type: REDUCER_ACTION_TYPE.TOPICS_CHECKBOX_INPUT_CHANGE, payload: { idsToPass: topicIds, categoriesByTopic: [] } });
      return;
    }
    const url = `${API_ROUTES.TOPIC_CATEGORY.GET_SORTED_TOPIC_CATEGORIES_BY_TOPIC_ID}?topicIds=${topicIds.join(',')}`;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    }).then(res => res.json())
    .then((serverResponse: GetTopicCategoriesSortedByTopicNameResponseDto) => {
      if (reducerState.isAddingOrEditing === AddOrEditOptions.ADD) {
        dispatch({ type: REDUCER_ACTION_TYPE.TOPICS_CHECKBOX_INPUT_CHANGE, payload: { idsToPass: topicIds, categoriesByTopic: serverResponse.data.categoriesByTopic } });
      }
      if (publicationFormData && type) {
          dispatch({ type: REDUCER_ACTION_TYPE.IS_EDITING, payload: { categoriesByTopic: serverResponse.data.categoriesByTopic, idsToPass: topicIds, publicationFormData: publicationFormData, type: type } });
        } else {
          dispatch({ type: REDUCER_ACTION_TYPE.TOPICS_CHECKBOX_INPUT_CHANGE, payload: { idsToPass: topicIds, categoriesByTopic: serverResponse.data.categoriesByTopic } });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const validateForm = (): boolean => {
    const { categoriesByTopic, publicationFormData } = reducerState;
    const { citation, topicIds, topicCategoryIds, linkToSource } = publicationFormData;

    if (topicIds.length < 1) {
      enqueueSnackbar("Select at least one topic", { variant: 'error', autoHideDuration: 5000});
      return false;
    }

    if (citation === "") {
      enqueueSnackbar("Please provide a citation", { variant: 'error', autoHideDuration: 5000});
      return false;
    }

    const isEveryTopicHasCategorySelected = topicIds.every(topicId => {
      const relevantTopic = categoriesByTopic.find(t => t.topicId === topicId);

      if (!relevantTopic) {
        return false;
      }

      const relevantTopicCategoryIds = relevantTopic.topicCategories.map(tc => tc.topicCategoryId);

      return relevantTopicCategoryIds.some(id => topicCategoryIds.includes(id));
    });

    if (!isEveryTopicHasCategorySelected) {
      enqueueSnackbar("Each topic must have at least one category associated with it.", { variant: 'error', autoHideDuration: 5000});
      return false;
    }

    const linkRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

    if (linkToSource !== "" && !linkRegex.test(linkToSource)) {
      enqueueSnackbar("Please provide a valid link. Example: https://example.com/publication.pdf", { variant: 'error', autoHideDuration: 5000});
      return false;
    }


    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isAddingOrEditing, publicationFormData, pdfToUpload } = reducerState;

    if(!validateForm()) return;


    if (isAddingOrEditing === AddOrEditOptions.ADD) {
      const apiRequest: ApiRequest = {
        method: 'POST',
        url: API_ROUTES.PUBLICATION.CREATE_PUBLICATION,
      }
      if (pdfToUpload) {
        beginPdfUpload(apiRequest);
      } else {
        createOrUpdatePublication(apiRequest, publicationFormData.publicationUrl, publicationFormData.publicationKey);
      }
    }

    if (isAddingOrEditing === AddOrEditOptions.EDIT) {
      const apiRequest: ApiRequest = {
        method: 'PUT',
        url: API_ROUTES.PUBLICATION.UPDATE_PUBLICATION,
      }
      if (pdfToUpload) {
        beginPdfUpload(apiRequest);
      } else {
        createOrUpdatePublication(apiRequest, publicationFormData.publicationUrl, publicationFormData.publicationKey);
      }
    }
  }

  const createOrUpdatePublication = (requestData: ApiRequest, pubUrl: string, pubKey: string) => {
    const url = requestData.url;
    const { publicationFormData } = reducerState;

    let formData = requestData.method === 'POST' ? (({ publicationId, topicIds, ...o }) => o)(publicationFormData)
      : (({ topicIds, ...o }) => o)(publicationFormData);

    formData.publicationKey = pubKey;
    formData.publicationUrl = pubUrl;

    fetch(url, {
      method: requestData.method,
      headers: {
        "Content-Type": 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse)=> {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          dispatch({ type: REDUCER_ACTION_TYPE.RESET_PUBLICATION_FORM, payload: { isAddingOrEditing: AddOrEditOptions.FALSE, publicationFormData: initState.publicationFormData } });
          getPublicationsSortedByType();
        } else {
            enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const beginPdfUpload = (requestData: ApiRequest) => {
    const { publicationKey } = reducerState.publicationFormData;

    let url = API_ROUTES.MEDIA.GET_PUBLICATION_UPLOAD_URL;

    if (publicationKey !== '') url += `?key=${publicationKey}`;

    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: GetPreSignedUrlResponseDto) => {
        const { data, statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK)
          uploadPdf(data, requestData);
        else
          console.error({statusCode, message});
      }).catch((error) => {
        console.error(error);
      });
  }

  const uploadPdf = (urlData: PreSignedUrlData, requestData: ApiRequest) => {
    if (urlData.url === undefined) return;
    const url = urlData.url;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf'
      },
      body: reducerState.pdfToUpload
    }).then((res) => {
      if (res.ok) {
        const publicationUrl = res.url.split('?')[0];
        dispatch({ type: REDUCER_ACTION_TYPE.SET_PUBLICATION_URL, payload: { publicationUrl, publicationKey: urlData.key } });
        enqueueSnackbar("Upload successful", { variant: 'success', autoHideDuration: 5000});
        createOrUpdatePublication(requestData, publicationUrl, urlData.key);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    getPublicationsSortedByType();
    getTopicsByType('academic');

    return () => {

    }
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container item alignItems={'center'} justifyContent={'center'}>
      {(reducerState.isAddingOrEditing !== AddOrEditOptions.FALSE && reducerState.topics && reducerState.topics.length > 0) ?
        <AddOrEditPublication
          isEditing={reducerState.isAddingOrEditing === AddOrEditOptions.EDIT}
          onUpdateCheckboxesAction={handleUpdateCheckboxes}
          categoriesByTopic={reducerState.categoriesByTopic}
          citation={reducerState.publicationFormData.citation}
          isPublished={reducerState.publicationFormData.isPublished}
          linkToSource={reducerState.publicationFormData.linkToSource}
          publicationId={reducerState.publicationFormData.publicationId}
          publicationKey={reducerState.publicationFormData.publicationKey}
          type={reducerState.publicationFormData.type}
          contactEmail={reducerState.publicationFormData.contactEmail}
          topics={reducerState.topics}
          topicIds={reducerState.publicationFormData.topicIds}
          topicCategoryIds={reducerState.publicationFormData.topicCategoryIds}
          getPublicationsSortedByType={getPublicationsSortedByType}
          onFileChangeAction={handleFileChangeAction}
          onTextChangeAction={handleTextChangeAction}
          getTopicsByType={getTopicsByType}
          getTopicCategoriesByTopicIds={getTopicCategoriesByTopicIds}
          onTopicCategoryCheckboxChangeAction={handleTopicCategoryCheckboxChangeAction}
          resetPublicationForm={handleResetPublicationForm}
          onSubmit={handleSubmit}
        />
        :
        <>
          <Grid container justifyContent={'space-around'}>
            {reducerState.academicPublications.length > 0 &&
              <>
                <Grid container item xs={12} margin={8} justifyContent={'center'}>
                  <Typography variant={'h4'}>
                    Academic
                  </Typography>
                </Grid>
                {reducerState.academicPublications && reducerState.academicPublications.map((publication, i) => {

                  return (
                    <PublicationList onIsEditingPublication={handleIsAddingOrEditingPublication} isAdmin={user.isAdmin} publication={publication} />
                  );
                })}
              </>
            }
            {reducerState.practitionerPublications.length > 0 &&
              <>
                <Grid container item xs={12} margin={8} justifyContent={'center'}>
                  <Typography variant={'h4'}>
                    Practitioner
                  </Typography>
                </Grid>
                {reducerState.practitionerPublications && reducerState.practitionerPublications.map((publication, i) => {
                  return (
                    <PublicationList onIsEditingPublication={handleIsAddingOrEditingPublication} isAdmin={user.isAdmin} publication={publication} />
                  );
                })}
              </>
            }
          </Grid>

          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => dispatch({ type: REDUCER_ACTION_TYPE.IS_ADDING, payload: { publicationFormData: initState.publicationFormData, type: state.topicType} })}>Add</Button>
        </>
      }
    </Grid>
  );
}
