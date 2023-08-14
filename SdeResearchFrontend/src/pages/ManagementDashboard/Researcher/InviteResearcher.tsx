import { useReducer } from 'react';
import { Button, Grid, FormControl, FormGroup, MenuItem, TextField, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { HttpStatusCode, Researcher, ServerResponse, VIEW_TYPE } from '../../../utils/types';
import { API_ROUTES } from '../../../utils/constants';

type InviteResearcherProps = {
  adminCreatedResearchers: Researcher[];
}

type Validation = {
  error: boolean;
  errorMessage: string
}


type InviteForm = {
  researcherId: number;
  email: string;
  confirmEmail: string;
  isValid: {
    email: Validation;
    researcherId: Validation
  }
}

type State = {
  view: VIEW_TYPE;
  inviteFormData: InviteForm
}

type InviteRequest = {
  researcherId: number;
  email: string
}

const defaultInviteForm: InviteForm = {
  researcherId: 0,
  email: '',
  confirmEmail: '',
  isValid: {
    email: {
      error: false,
      errorMessage: ''
    },
    researcherId: {
      error: true,
      errorMessage: 'Please select a researcher'
    }
  }
}

const initState: State = {
  view: VIEW_TYPE.VIEW,
  inviteFormData: defaultInviteForm
}

enum ACTION_TYPE {
  CHANGE_VIEW,
  SELECT_CHANGE,
  TEXT_CHANGE
}

type ReducerAction = {
  type: ACTION_TYPE.CHANGE_VIEW;
  payload: VIEW_TYPE;
} | {
  type: ACTION_TYPE.SELECT_CHANGE;
  payload: {
    researcherId: number;
    isValid: Validation;
  }
} | {
  type: ACTION_TYPE.TEXT_CHANGE;
  payload: {
    name: string;
    value: string;
    isValid: Validation;
  }
};

const reducer = (state: State, action: ReducerAction) => {
  const { inviteFormData } = state;
  switch (action.type) {
    case ACTION_TYPE.CHANGE_VIEW:
      return { ...state, view: action.payload, inviteFormData: defaultInviteForm }
    case ACTION_TYPE.SELECT_CHANGE:
      return { ...state, inviteFormData: { ...inviteFormData, researcherId: action.payload.researcherId, isValid: { ...inviteFormData.isValid, researcherId: action.payload.isValid } } }
    case ACTION_TYPE.TEXT_CHANGE:
      return {
        ...state,
        inviteFormData: {
          ...inviteFormData,
          [action.payload.name]: action.payload.value,
          isValid: { ...inviteFormData.isValid, email: action.payload.isValid }
        }
      }
    default:
      return { ...state }
  }
}

export default function InviteResearcher({ adminCreatedResearchers }: InviteResearcherProps) {
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initState);

  const onSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const researcherId = parseInt(value);
    const isValid = (state.view === VIEW_TYPE.INVITE_EXISTING && researcherId === 0) ? false : true;
    const validation: Validation = {
      error: !isValid? true : false,
      errorMessage: !isValid ? 'You must select a researcher' : ''
    }
    dispatch({ type: ACTION_TYPE.SELECT_CHANGE, payload: { researcherId, isValid: validation} });
  }

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { email, confirmEmail } = state.inviteFormData;
    const { name, value } = e.target;

    let isValid = true;

    if (name === 'email' && value !== confirmEmail)
      isValid = false;
    if (name === 'confirmEmail' && value !== email)
      isValid = false;

    const validation: Validation = {
      error: !isValid,
      errorMessage: !isValid ? 'Emails must match' : ''
    }
    dispatch({ type: ACTION_TYPE.TEXT_CHANGE, payload: { name, value, isValid: validation } });
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { researcherId, email, isValid } = state.inviteFormData;

    if (isValid.email.error || (state.view === VIEW_TYPE.INVITE_EXISTING && isValid.researcherId.errorMessage)) return;

    const url = API_ROUTES.EMAIL.INVITE_USER;

    const data: InviteRequest = {
      researcherId: researcherId,
      email: email
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          dispatch({ type: ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.VIEW });
            enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000 });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
        }
      }).catch((error) => {
        console.error(error);
      });
  }

  return (
    <Grid marginTop={8}>
      {state.view === VIEW_TYPE.VIEW ?
        <Grid>
          <Grid item xs={10} margin={2}>
            <Button
              sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}
              onClick={() => dispatch({ type: ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.INVITE_NEW })}
            >
              New User
            </Button>
          </Grid>
          <Grid item xs={10} margin={2}>
            <Button
              sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}
              onClick={() => dispatch({ type: ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.INVITE_EXISTING })}
            >
              Existing Researcher
            </Button>
          </Grid>
        </Grid>
        :
        <form onSubmit={onSubmit}>
          <FormControl>
            {(state.view === VIEW_TYPE.INVITE_EXISTING && adminCreatedResearchers.length > 0) &&
              <TextField
                name='researcherId'
                label='Researcher'
                select
                defaultValue="0"
                value={state.inviteFormData.researcherId}
                sx={{ margin: 2 }}
                error={state.inviteFormData.isValid.researcherId.error}
                helperText={ state.inviteFormData.isValid.researcherId.error && state.inviteFormData.isValid.researcherId.errorMessage}
                onChange={onSelectChange}
              >
                {adminCreatedResearchers.map((researcher: Researcher) =>
                  <MenuItem key={researcher.researcherId} value={researcher.researcherId}>{researcher.firstName} {researcher.lastName}</MenuItem>
                )}
              </TextField>
            }
            <FormGroup sx={{ marginY: 2 }}>
              <TextField
                name='email'
                type='email'
                label='Email'
                required
                sx={{ marginY: 2 }}
                onChange={onTextChange}
                error={state.inviteFormData.isValid.email.error}
                helperText={state.inviteFormData.isValid.email.error && state.inviteFormData.isValid.email.errorMessage}
              />
              <TextField
                name='confirmEmail'
                type='email'
                label='Confirm Email'
                required
                sx={{ marginY: 2 }}
                onChange={onTextChange}
                error={state.inviteFormData.isValid.email.error}
                helperText={state.inviteFormData.isValid.email.error && state.inviteFormData.isValid.email.errorMessage}
              />
            </FormGroup>
            <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => dispatch({ type: ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.VIEW })}>Cancel</Button>
            <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type='submit'>Submit</Button>
          </FormControl>
        </form>
      }
    </Grid>
  );
}
