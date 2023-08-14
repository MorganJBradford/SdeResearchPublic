import React, { useContext, useReducer } from 'react';
import { Avatar, Grid, TextField, FormLabel, Button, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../../utils/constants';
import { GlobalContext } from '../../contexts/GlobalContext';
import { GetPreSignedUrlResponseDto, HttpStatusCode, PreSignedUrlData, UpdateResearcherResponse } from '../../utils/types';

type EditProfileProps = {
  profileInfo: {
    firstName: string,
    lastName: string,
    institution: string,
    department: string,
    biography: string,
    profilePicture: string,
    imageName: string
  },
  onIsEditing: () => void,
  getProfileInfo: () => void,
}

type FormValues = {
  firstName: string,
  lastName: string,
  institution: string,
  department: string,
  biography: string,
  imageToUpload?: File
}

type ImageToUpload = {
  imageSrc?: string | ArrayBuffer | null,
  imageFile?: File,
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

type ReducerState = {
  profileFormData: FormValues,
  imageToUpload: ImageToUpload
}

const reducer = (state: ReducerState, action: ReducerAction) => {
  const { profileFormData } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_IMAGE:
      return { ...state, imageToUpload: { imageFile: action.payload.imageFile, imageSrc: action.payload.imageSrc } }
    case REDUCER_ACTION_TYPE.ON_TEXT_CHANGE:
      return { ...state, profileFormData: { ...profileFormData, [action.payload.field]: action.payload.value}}
    default:
      return { ...state }
  }
}

export default function EditProfile({ profileInfo, onIsEditing, getProfileInfo }: EditProfileProps) {
  const theme = useTheme();
  const { user, setUser } = useContext(GlobalContext);
  const initState: ReducerState = {
    profileFormData: profileInfo,
    imageToUpload: defaultImage
  }

  const [state, dispatch] = useReducer(reducer, initState);
  const { firstName, lastName, institution, department, biography, profilePicture, imageName } = profileInfo;

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

    if (state.imageToUpload.imageFile) {
      getPresignedUrl();
      return;
    }

    updateProfile();
  }

  const getPresignedUrl = () => {
    const url = API_ROUTES.MEDIA.GET_PROFILE_PICTURE_UPLOAD_URL;
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
    if (urlData.url === undefined) return;

    const url = urlData.url;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/*',
      },
      body: state.imageToUpload.imageFile
    }).then((res) => {
      if (res.ok) {
        const imageUrl = res.url.split('?')[0];
        updateProfile(imageUrl, urlData.key);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const updateProfile = (imageUrl?: string, imageKey?: string) => {
    const url = API_ROUTES.RESEARCHER.UPDATE_RESEARCHER;
    let userDetails = user;

    let formData: FormData = new FormData();
    formData.append('firstName', state.profileFormData.firstName);
    formData.append('lastName', state.profileFormData.lastName);
    formData.append('institution', state.profileFormData.institution);
    formData.append('department', state.profileFormData.department);
    formData.append('biography', state.profileFormData.biography);

    if (imageUrl && imageKey) {
      formData.append('imageUrl', imageUrl);
      formData.append('imageKey', imageKey);
    } else {
      formData.append('imageUrl', profilePicture);
      formData.append('imageKey', imageName);
    }

    fetch(url, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    }).then(res => res.json())
      .then((serverResponse: UpdateResearcherResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          onIsEditing();
          getProfileInfo();
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 })
          userDetails.profilePicture = serverResponse.data.profilePicture;
          localStorage.setItem('user', JSON.stringify(userDetails));
          setUser(userDetails);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 })
        }
      }).catch((error) => {
        console.error(error);
      })
  }

  const previewImage = state.imageToUpload.imageSrc === "" ? profilePicture : state.imageToUpload.imageSrc;

  return (
    <Grid container item alignItems={'center'} justifyContent={'center'}>
      <form onSubmit={onSubmit}>
        <Grid item xs={12}>
          <Avatar src={typeof (previewImage) == "string" ? previewImage : ""} sx={{ height: '70px', width: '70px', margin: '0 auto' }} />
          <br />
          <FormLabel>Profile Picture</FormLabel>
          <br />
          <input
            name='profilePicture'
            type='file'
            accept='image/*'
            onChange={(e) => showPreview(e)}
          />
        </Grid>
        <Grid item xs={12} margin={6}>
          <TextField
            type='text'
            name='firstName'
            label={"First Name"}
            required
            defaultValue={firstName}
            onChange={(e) => handleInputChange(e)}
          />
        </Grid>
        <Grid item xs={12} margin={6}>
          <TextField
            type='text'
            name='lastName'
            label={'Last Name'}
            required
            defaultValue={lastName}
            onChange={(e) => handleInputChange(e)}
          />
        </Grid>
        <Grid item xs={12} margin={6}>
          <TextField
            type='text'
            name='institution'
            label={"Institution"}
            required
            defaultValue={institution}
            onChange={(e) => handleInputChange(e)}
          />
        </Grid>
        <Grid item xs={12} margin={6}>
          <TextField
            type='text'
            name='department'
            label='Department'
            defaultValue={department}
            onChange={(e) => handleInputChange(e)}
          />
        </Grid>
        <Grid item xs={12} margin={6}>
          <TextField
            type='text'
            name='biography'
            label='Biography'
            multiline
            required
            defaultValue={biography}
            onChange={(e) => handleInputChange(e)}
          />
        </Grid>
        <Grid item xs={12} margin={10}>
          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => onIsEditing()}>
            Cancel
          </Button>
          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} type='submit'>
            Submit
          </Button>
        </Grid>
      </form>
    </Grid>
  );
}
