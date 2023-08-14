import { useContext, useEffect, useReducer } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme
} from '@mui/material';

import { GlobalContext } from '../../../contexts/GlobalContext';
import TopicList from './TopicList';
import { BaseCategory, GetSortedTopicsAndCategories, HttpStatusCode, ServerResponse, TopicManagerTopic } from '../../../utils/types';
import { API_ROUTES } from '../../../utils/constants';
import ConfirmationDialog from '../../../shared/ConfirmationDialog';

type TopicFormData = {
  topicId?: number,
  topicName: string,
  categoryIds: number[],
  type: string
}

const initialFormData: TopicFormData = {
  topicName: '',
  categoryIds: [],
  type: 'academic',
}

type ReducerState = {
  isLoading: boolean,
  academicCategories: BaseCategory[],
  practitionerCategories: BaseCategory[],
  academicTopics: TopicManagerTopic[],
  practitionerTopics: TopicManagerTopic[],
  isAddingOrEditing: string | false,
  topicFormData: TopicFormData,
}


const initState: ReducerState = {
  isLoading: true,
  academicCategories: [],
  practitionerCategories: [],
  academicTopics: [],
  practitionerTopics: [],
  isAddingOrEditing: false,
  topicFormData: initialFormData,
}

enum REDUCER_ACTION_TYPE {
  IS_ADDING_OR_EDITING,
  SET_TOPIC_FORM_DATA,
  SELECT_INPUT_CHANGE,
  TEXT_INPUT_CHANGE,
  CHECKBOX_INPUT_CHANGE,
  GET_SORTED_TOPICS_AND_CATEGORIES
}

type IsAddingOrEditingAction = {
  type: REDUCER_ACTION_TYPE.IS_ADDING_OR_EDITING,
  payload: string | false,
}

type SetTopicFormDataAction = {
  type: REDUCER_ACTION_TYPE.SET_TOPIC_FORM_DATA,
  payload: {
    topicFormData: TopicFormData,
    isAddingOrEditing: string | false
  }
}

type TextInputChangeAction = {
  type: REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE,
  payload: string,
}

type SelectInputChangeAction = {
  type: REDUCER_ACTION_TYPE.SELECT_INPUT_CHANGE,
  payload: string,
}

type CheckboxInputChange = {
  type: REDUCER_ACTION_TYPE.CHECKBOX_INPUT_CHANGE,
  payload: number[]
}

type GetSortedTopicsAndCategoriesAction = {
  type: REDUCER_ACTION_TYPE.GET_SORTED_TOPICS_AND_CATEGORIES,
  payload: {
    academicTopics: TopicManagerTopic[],
    practitionerTopics: TopicManagerTopic[],
    academicCategories: BaseCategory[],
    practitionerCategories: BaseCategory[]
  }
}


type ReducerAction = IsAddingOrEditingAction | SetTopicFormDataAction | SelectInputChangeAction | TextInputChangeAction | CheckboxInputChange | GetSortedTopicsAndCategoriesAction;

enum AddOrEditOptions {
  ADD = 'add-topic',
  EDIT = 'edit-topic',
}


const reducer = (state: ReducerState, action: ReducerAction) => {
  const { topicFormData } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.GET_SORTED_TOPICS_AND_CATEGORIES:
      return {
        ...state,
        isLoading: false,
        academicTopics: action.payload.academicTopics,
        practitionerTopics: action.payload.practitionerTopics,
        academicCategories: action.payload.academicCategories,
        practitionerCategories: action.payload.practitionerCategories
      }
    case REDUCER_ACTION_TYPE.SET_TOPIC_FORM_DATA:
      return {
        ...state,
        isAddingOrEditing: action.payload.isAddingOrEditing,
        topicFormData: {
          ...action.payload.topicFormData,
          categoryIds: action.payload.topicFormData.categoryIds
        }
      }
    case REDUCER_ACTION_TYPE.IS_ADDING_OR_EDITING:
      return { ...state, isAddingOrEditing: action.payload }
    case REDUCER_ACTION_TYPE.SELECT_INPUT_CHANGE:
      return { ...state, topicFormData: { ...topicFormData, type: action.payload, categoryIds: [] } }
    case REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE:
      return { ...state, topicFormData: { ...topicFormData, topicName: action.payload } }
    case REDUCER_ACTION_TYPE.CHECKBOX_INPUT_CHANGE:
      return { ...state, topicFormData: { ...topicFormData, categoryIds: action.payload } }
    default:
      return { ...state }
  }
}


export default function TopicManager() {
  const theme = useTheme();
  const {
    user
  } = useContext(GlobalContext);
  const [state, dispatch] = useReducer(reducer, initState);

  const handleIsAddingOrEditing = (topicToEdit: TopicFormData, endpoint: AddOrEditOptions | false) => {
    dispatch({ type: REDUCER_ACTION_TYPE.SET_TOPIC_FORM_DATA, payload: { isAddingOrEditing: endpoint, topicFormData: topicToEdit } });
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    dispatch({ type: REDUCER_ACTION_TYPE.TEXT_INPUT_CHANGE, payload: value });
  }

  const onSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const valueToPass = value === 'academic' ? value : 'practitioner';

    dispatch({ type: REDUCER_ACTION_TYPE.SELECT_INPUT_CHANGE, payload: valueToPass });
  }

  const onCheckboxChange = (categoryId: number) => {
    let tempArr = [...state.topicFormData.categoryIds];

    if (tempArr.includes(categoryId))
      tempArr = tempArr.filter(id => id !== categoryId)
    else
      tempArr.push(categoryId);

    dispatch({ type: REDUCER_ACTION_TYPE.CHECKBOX_INPUT_CHANGE, payload: tempArr });
  }

  const findDefaultCheckboxValues = (categoryId: number) => {
    const tempArr = [...state.topicFormData.categoryIds];
    const index = tempArr.indexOf(categoryId);

    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  const deleteTopicById = () => {
    const url = `${API_ROUTES.TOPIC.DELETE_TOPIC_BY_ID}/${state.topicFormData.topicId}`;

    fetch(url, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'success', autoHideDuration: 1000 });
          getSortedTopicsAndCategories();
          dispatch({ type: REDUCER_ACTION_TYPE.IS_ADDING_OR_EDITING, payload: false });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((error => {
        console.error(error);
      }));
  }

  const createOrUpdateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    const url = state.isAddingOrEditing === AddOrEditOptions.ADD ? API_ROUTES.TOPIC.CREATE_TOPIC : API_ROUTES.TOPIC.UPDATE_BASE_TOPIC;

    if (state.topicFormData.categoryIds.length === 0) {
      enqueueSnackbar("Select at least one category", { variant: 'error', autoHideDuration: 1000 });
      return;
    }

    fetch(url, {
      method: state.isAddingOrEditing === AddOrEditOptions.ADD ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(state.topicFormData)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          dispatch({ type: REDUCER_ACTION_TYPE.SET_TOPIC_FORM_DATA, payload: { isAddingOrEditing: false, topicFormData: initialFormData } });
          enqueueSnackbar(message, { variant: 'success' });
          getSortedTopicsAndCategories();
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error' });
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }


  const getSortedTopicsAndCategories = () => {
    const url = API_ROUTES.TOPIC_CATEGORY.GET_SORTED_TOPICS_AND_CATEGORIES;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then((serverResponse: GetSortedTopicsAndCategories) => {
        const { academicTopics, practitionerTopics, academicCategories, practitionerCategories } = serverResponse.data;
        if (serverResponse.statusCode === HttpStatusCode.OK)
          dispatch({ type: REDUCER_ACTION_TYPE.GET_SORTED_TOPICS_AND_CATEGORIES, payload: { academicTopics, practitionerTopics, academicCategories, practitionerCategories } });

      })
      .catch((error => {
        console.error(error);
      }));
  }

  const deleteDialogProps = {
    title: `Delete ${state.topicFormData.topicName}`,
    description: `Are you sure you want to delete topic "${state.topicFormData.topicName}?" This will remove all associated publications. Select "Make Private" if you do not wish to delete associated publications`,
    openDialogButtonProps: {
      styles: { color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: 'red' } },
      text: 'Delete'
    },
    confirmationButtonProps: {
      styles: { color: 'red' },
      text: 'Delete',
      onConfirm: () => deleteTopicById()
    }
  }

  useEffect(() => {
    getSortedTopicsAndCategories();
    return () => {

    }
  }, []);

  return (
    <>
      {state.isAddingOrEditing !== false ?
        <>
          <Grid container item alignItems={'center'} justifyContent={'center'}>
            <form onSubmit={createOrUpdateTopic}>
              <FormControl>
                <TextField value={state.topicFormData.type ?? state.topicFormData.type} name='type' sx={{ margin: 2 }} select label='Type' onChange={(e) => onSelectChange(e)}>
                  <MenuItem value='academic'>Academic Publications</MenuItem>
                  <MenuItem value={'practitioner'}>Practitioner Publications</MenuItem>
                </TextField>
                <FormGroup>
                  <FormLabel>Categories</FormLabel>
                  {state.topicFormData.type === "academic" &&
                    state.academicCategories.map((category: BaseCategory, i: number) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              key={i}
                              name='categories'
                              value={category.categoryName}
                              defaultChecked={findDefaultCheckboxValues(category.categoryId)}
                              onChange={() => onCheckboxChange(category.categoryId)}
                            />
                          }
                          label={category.categoryName}
                        />
                      );
                    }
                    )}
                  {state.topicFormData.type === "practitioner" &&
                    state.practitionerCategories.map((category: BaseCategory, i: number) => {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              key={i}
                              name='categories'
                              value={category.categoryName}
                              defaultChecked={findDefaultCheckboxValues(category.categoryId)}
                              onChange={() => onCheckboxChange(category.categoryId)}
                            />
                          }
                          label={category.categoryName}
                        />
                      );
                    }
                    )}
                </FormGroup>
                <TextField
                  required
                  name="topicName"
                  type="text"
                  label="Topic Name"
                  defaultValue={state.topicFormData.topicName}
                  sx={{ margin: 2 }}
                  onChange={(e) => onTextChange(e)}
                />
                <Button sx={{ margin: 2, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleIsAddingOrEditing(initialFormData, false)}>Cancel</Button>
                <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type='submit'>Submit</Button>
              </FormControl>
            </form>
          </Grid>
          {state.isAddingOrEditing === AddOrEditOptions.EDIT &&
            <ConfirmationDialog
              dialogTitle={deleteDialogProps.title}
              dialogDescription={deleteDialogProps.description}
              openDialogButtonProps={deleteDialogProps.openDialogButtonProps}
              confirmationButtonProps={deleteDialogProps.confirmationButtonProps}
            />
          }
        </>
        :
        <>
          <Grid container justifyContent={'space-around'} >
            <Grid container item xs={12} margin={8} justifyContent={'center'}>
              <Typography variant={'h4'}>
                Academic
              </Typography>
            </Grid>
            {state.academicTopics && state.academicTopics.map((topic: TopicManagerTopic, i: number) => {
              return (
                topic.topicId !== 0 &&
                <TopicList
                  academic
                  topic={topic}
                  isAdmin={user.isAdmin}
                  onIsEditingTopic={handleIsAddingOrEditing}
                  key={i}
                />
              );
            })}
            <Grid container item xs={12} margin={8} justifyContent={'center'}>
              <Typography variant={'h4'}>
                Practitioner
              </Typography>
            </Grid>
            {state.practitionerTopics && state.practitionerTopics.map((topic: TopicManagerTopic, i: number) => {
              return (
                topic.topicId !== 0 &&
                <TopicList
                  topic={topic}
                  isAdmin={user.isAdmin}
                  key={i}
                  onIsEditingTopic={handleIsAddingOrEditing}
                />
              );
            })}
          </Grid>
          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleIsAddingOrEditing(initialFormData, AddOrEditOptions.ADD)}>
            Add
          </Button>
        </>
      }
    </>
  );
}
