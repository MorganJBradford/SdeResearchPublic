import React, { useReducer } from 'react';
import { Avatar, Grid, TextField, FormGroup, FormLabel, Button, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../../../utils/constants';
import { GetPreSignedUrlResponseDto, HttpStatusCode, ImageToUpload, PreSignedUrlData, ResearcherFormValues, ResearcherProfile, ServerResponse, UpdateResearcherResponse, VIEW_TYPE } from '../../../utils/types';
import ConfirmationDialog from '../../../shared/ConfirmationDialog';

type AddOrEditResearcherProps = {
  view: VIEW_TYPE,
  onComplete: () => void,
  researcherProfile: ResearcherProfile
}

type ReducerState = {
  loading: boolean,
  view: VIEW_TYPE,
  profileFormData: ResearcherFormValues,
  imageToUpload?: ImageToUpload,
  profileToUpload: ResearcherProfile,
}

const defaultProfile: ResearcherProfile = {
  researcherId: 0,
  firstName: '',
  lastName: '',
  institution: '',
  department: '',
  biography: '',
  imageName: '',
  profilePicture: ''
}

const defaultImage: ImageToUpload = {
  imageSrc: '',
}


enum REDUCER_ACTION_TYPE {
  SET_IMAGE,
  ON_TEXT_CHANGE
}

type SetImageToUploadAction = {
  type: REDUCER_ACTION_TYPE.SET_IMAGE,
  payload: {
    imageFile?: File
    imageSrc?: string | ArrayBuffer | null,
  }
}

type OnTextChangeAction = {
  type: REDUCER_ACTION_TYPE.ON_TEXT_CHANGE,
  payload: {
    field: string,
    value: string
  }
}

type ReducerAction = SetImageToUploadAction | OnTextChangeAction;

const reducer = (state: ReducerState, action: ReducerAction) => {
  const { profileFormData } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_IMAGE:
      return { ...state, imageToUpload: { imageFile: action.payload.imageFile, imageSrc: action.payload.imageSrc } }
    case REDUCER_ACTION_TYPE.ON_TEXT_CHANGE:
      return { ...state, profileFormData: { ...profileFormData, [action.payload.field]: action.payload.value } }
    default:
      return { ...state }
  }
}

export default function AddOrEditResearcher({ researcherProfile, view, onComplete }: AddOrEditResearcherProps) {
  const theme = useTheme();
  const initState: ReducerState = {
    loading: false,
    view,
    profileFormData: researcherProfile,
    imageToUpload: defaultImage,
    profileToUpload: defaultProfile
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const { firstName, lastName, institution, department, biography, imageName, profilePicture } = researcherProfile;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch({ type: REDUCER_ACTION_TYPE.ON_TEXT_CHANGE, payload: { field: name, value: value } });
  }

  const showPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = x => {
        if (x.target !== null) {
          dispatch({ type: REDUCER_ACTION_TYPE.SET_IMAGE, payload: { imageSrc: x.target.result, imageFile } });
        }
      }
      reader.readAsDataURL(imageFile);
    } else {
      dispatch({ type: REDUCER_ACTION_TYPE.SET_IMAGE, payload: { imageFile: undefined, imageSrc: '' } });
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { imageToUpload } = state;

    if (imageToUpload && imageToUpload.imageFile) {
      getPresignedUrl();
      return;
    }

    addOrEditResearcher();
  }

  const getPresignedUrl = () => {
    const url = `${API_ROUTES.MEDIA.GET_ADMIN_RESEARCHER_PICTURE_UPLOAD_URL}/${state.profileFormData.researcherId}`;
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
    const { imageToUpload } = state;
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
        addOrEditResearcher(imageUrl, urlData.key);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const addOrEditResearcher = (imageUrl?: string, imageKey?: string) => {
    const url = view === VIEW_TYPE.CREATE ?
      API_ROUTES.RESEARCHER.ADMIN_CREATE_RESEARCHER
      : API_ROUTES.RESEARCHER.ADMIN_UPDATE_RESEARCHER;

    let formData: ResearcherFormValues = {
      researcherId: state.profileFormData.researcherId ?? 0,
      firstName: state.profileFormData.firstName,
      lastName: state.profileFormData.lastName,
      institution: state.profileFormData.institution,
      department: state.profileFormData.department,
      biography: state.profileFormData.biography,
      imageUrl: imageUrl ?? profilePicture,
      imageKey: imageKey ?? imageName
    }

    fetch(url, {
      method: view === VIEW_TYPE.CREATE ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    }).then(res => res.json())
      .then((serverResponse: UpdateResearcherResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          onComplete();
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 })
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  const deleteResearcher = () => {
    const url = `${API_ROUTES.RESEARCHER.ADMIN_DELETE_RESEARCHER}/${researcherProfile.researcherId}`

    fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include'
    }).then(res => res.json())
    .then((serverResponse: ServerResponse) => {
      const { statusCode, message } = serverResponse;

      if (statusCode === HttpStatusCode.OK) {
        enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000});
        onComplete();
      } else {
        enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  const deleteResearcherDialogProps= {
    dialogTitle: "Delete Researcher",
    dialogDescription: `Are you sure you wish to delete ${researcherProfile.firstName} ${researcherProfile.lastName}'s profile?`,
    openDialogButtonProps: {
      styles: { margin: 2, color: 'whitesmoke',backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: 'red'} },
      text: 'DELETE RESEARCHER'
    },
    confirmationButtonProps: {
      styles: { color: 'whitesmoke',backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: 'red'} },
      text: 'DELETE',
      onConfirm: deleteResearcher
    }
  }

  const previewImage = state.imageToUpload?.imageSrc === "" ? profilePicture : state.imageToUpload?.imageSrc;

  return (
    <Grid container item alignItems={'center'} justifyContent={'center'} marginTop={4}>
      <form onSubmit={onSubmit}>
        <Avatar src={typeof (previewImage) == "string" ? previewImage : ""} sx={{ height: '70px', width: '70px', margin: '0 auto' }} />
        <br />
        <FormLabel>Profile Picture</FormLabel>
        <br />
        <br />
        <input
          name='profilePicture'
          type='file'
          accept='image/*'
          onChange={(e) => showPreview(e)}
        />
        <FormGroup sx={{ marginY: 2, width: { md: '50vw' } }}>
          <TextField
            type='text'
            name='firstName'
            label={"First Name"}
            required
            sx={{ marginY: 2 }}
            defaultValue={firstName}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            type='text'
            name='lastName'
            label={'Last Name'}
            required
            sx={{ marginY: 2 }}
            defaultValue={lastName}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            type='text'
            name='institution'
            label={"Institution"}
            required
            sx={{ marginY: 2 }}
            defaultValue={institution}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            type='text'
            name='department'
            label='Department'
            sx={{ marginY: 2 }}
            defaultValue={department}
            onChange={(e) => handleInputChange(e)}
          />
          <TextField
            type='text'
            name='biography'
            label='Biography'
            multiline
            rows={10}
            required

            defaultValue={biography}
            onChange={(e) => handleInputChange(e)}
          />
        </FormGroup>
        {view === VIEW_TYPE.EDIT &&
        <>
          <ConfirmationDialog
            dialogTitle={deleteResearcherDialogProps.dialogTitle}
            dialogDescription={deleteResearcherDialogProps.dialogDescription}
            openDialogButtonProps={deleteResearcherDialogProps.openDialogButtonProps}
            confirmationButtonProps={deleteResearcherDialogProps.confirmationButtonProps}
          />
          <br/>
        </>
        }
        <Button sx={{backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type='submit'>
          Submit
        </Button>
      </form>
    </Grid>
  );
}
