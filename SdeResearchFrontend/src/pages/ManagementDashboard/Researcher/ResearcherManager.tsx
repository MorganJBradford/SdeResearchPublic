import { useEffect, useReducer } from 'react';

import { API_ROUTES } from "../../../utils/constants";
import { Box, Button, CircularProgress, Grid, useTheme } from '@mui/material';
import ProfileCard from '../../../shared/ProfileCard';
import { GetAdminDashboardResearchers, HttpStatusCode, Researcher, ResearcherProfile, VIEW_TYPE } from '../../../utils/types';
import InviteResearcher from './InviteResearcher';
import AddOrEditResearcher from './AddOrEditResearcher';

const defaultProfile: ResearcherProfile = {
  researcherId: 0,
  firstName: '',
  lastName: '',
  institution: '',
  department: '',
  biography: '',
  profilePicture: '',
  imageName: ''
}

type ReducerState = {
  researchers: Researcher[],
  adminCreatedResearchers: Researcher[],
  researcherProfile: ResearcherProfile
  isLoading: boolean,
  viewType: VIEW_TYPE
}

const initState: ReducerState = {
  isLoading: true,
  researcherProfile: defaultProfile,
  viewType: VIEW_TYPE.VIEW,
  researchers: [],
  adminCreatedResearchers: []
}

enum REDUCER_ACTION_TYPE {
  GET_RESEARCHERS,
  CHANGE_VIEW,
  CANCEL_EDIT,
  SET_RESEARCHER_PROFILE
}

type GetResearchersAction = {
  type: REDUCER_ACTION_TYPE.GET_RESEARCHERS,
  payload: {
    researchers: Researcher[],
    adminCreatedResearchers: Researcher[]
  }
}

type ChangeViewAction = {
  type: REDUCER_ACTION_TYPE.CHANGE_VIEW,
  payload: VIEW_TYPE
}

type CancelEditAction = {
  type: REDUCER_ACTION_TYPE.CANCEL_EDIT,
  payload: VIEW_TYPE
}

type SetResearcherProfileAction = {
  type: REDUCER_ACTION_TYPE.SET_RESEARCHER_PROFILE,
  payload: ResearcherProfile
}

type ReducerAction = GetResearchersAction | ChangeViewAction | SetResearcherProfileAction | CancelEditAction;

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.GET_RESEARCHERS:
      return { ...state, isLoading: false, researchers: action.payload.researchers, adminCreatedResearchers: action.payload.adminCreatedResearchers }
    case REDUCER_ACTION_TYPE.CHANGE_VIEW:
      return { ...state, viewType: action.payload }
    case REDUCER_ACTION_TYPE.CANCEL_EDIT:
      return { ...state, viewType: action.payload, researcherProfile: defaultProfile }
    case REDUCER_ACTION_TYPE.SET_RESEARCHER_PROFILE:
      return { ...state, viewType: VIEW_TYPE.EDIT, researcherProfile: action.payload }
    default:
      return { ...state }
  }
}

export default function ResearcherManager() {
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, initState);

  const getAllResearchers = () => {
    const url = API_ROUTES.RESEARCHER.GET_ADMIN_DASHBOARD_RESEARCHERS;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: GetAdminDashboardResearchers) => {
        if (serverResponse.statusCode === HttpStatusCode.OK) {
          dispatch({ type: REDUCER_ACTION_TYPE.GET_RESEARCHERS, payload: { researchers: serverResponse.data.researchers, adminCreatedResearchers: serverResponse.data.adminCreatedResearchers } })
        }
      }).catch((error) => {
        console.error(error)
      });
  }

  const handleFormCompletion = () => {
    getAllResearchers();
    dispatch({ type: REDUCER_ACTION_TYPE.CANCEL_EDIT, payload: VIEW_TYPE.VIEW });
  }

  const onEditResearcher = (researcher: Researcher) => {
    const profile: ResearcherProfile = {
      researcherId: researcher.researcherId,
      firstName: researcher.firstName,
      lastName: researcher.lastName,
      institution: researcher.institution,
      department: researcher.department,
      biography: researcher.biography ?? '',
      profilePicture: researcher.profilePicture ?? '',
      imageName: researcher.imageName ?? ''
    }
    dispatch({ type: REDUCER_ACTION_TYPE.SET_RESEARCHER_PROFILE, payload: profile })
  }

  useEffect(() => {
    getAllResearchers();
    return () => {

    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Grid container item alignItems={'center'} justifyContent={'center'}>
        {state.viewType === VIEW_TYPE.VIEW ?
          <>
            {state.isLoading ?
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
              :
              <>
                {state.researchers.length > 0 &&
                  <>
                    <Grid item xs={4} margin={2}>
                      <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => dispatch({ type: REDUCER_ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.INVITE })}>
                        Invite User
                      </Button>
                    </Grid>
                    <Grid item xs={4} margin={2}>
                      <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => dispatch({ type: REDUCER_ACTION_TYPE.CHANGE_VIEW, payload: VIEW_TYPE.CREATE })}>
                        Create Researcher
                      </Button>
                    </Grid>
                    <Grid item xs={10} margin={2}>
                      <h1>Researchers</h1>
                    </Grid>
                    {state.researchers.map((researcher: Researcher, i: number) => {
                      return (
                        <Grid item sm={10} md={3} margin={2}>
                          <ProfileCard researcher={researcher} getResearchers={getAllResearchers} sx={{ color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.darkColor, width: '100%' }} key={i} />
                        </Grid>
                      );
                    })}
                  </>
                }
                {state.adminCreatedResearchers.length > 0 &&
                  <>
                    <Grid item xs={10} margin={2}>
                      <h1>Admin Created Researchers</h1>
                    </Grid>
                    {state.adminCreatedResearchers.map((researcher: Researcher, i: number) => {
                      return (
                        <Grid item sm={10} md={3} margin={2}>
                          <ProfileCard researcher={researcher} getResearchers={getAllResearchers} sx={{ color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.darkColor, width: '100%' }} key={i} />
                          <Button sx={{margin: 2, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => onEditResearcher(researcher)}>Edit {researcher.firstName} {researcher.lastName}'s profile</Button>
                        </Grid>
                      );
                    })}
                  </>
                }

              </>
            }
          </>
          :
          <Grid container item >
            <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}, margin: '0 auto'}} onClick={() => dispatch({ type: REDUCER_ACTION_TYPE.CANCEL_EDIT, payload: VIEW_TYPE.VIEW })}>Back</Button>
          </Grid>
        }
        {state.viewType === VIEW_TYPE.INVITE &&
          <InviteResearcher adminCreatedResearchers={state.adminCreatedResearchers}/>
        }
        {(state.viewType === VIEW_TYPE.CREATE || state.viewType === VIEW_TYPE.EDIT) &&
          <AddOrEditResearcher onComplete={() => handleFormCompletion()} researcherProfile={state.researcherProfile} view={state.viewType} />
        }
      </Grid>


    </>
  );
}
