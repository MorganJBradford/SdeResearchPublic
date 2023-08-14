import { useContext, useEffect, useReducer, } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useTheme } from '@mui/material';


import { API_ROUTES } from '../../utils/constants';
import { GlobalContext } from '../../contexts/GlobalContext';
import EditProfile from './EditProfile';
import Footer from '../../shared/Footer';
import NavBar from '../../shared/NavBar';
import { Link } from 'react-router-dom';
import { GetResearcherByAuth, HttpStatusCode, ResearcherProfile } from '../../utils/types';

/* istanbul ignore next */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primaryPalette.darkColor,
  padding: theme.spacing(2),
  color: 'whitesmoke'
}));

const initialProfileInfo: ResearcherProfile = {
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
  isAdminDashboardShowing: boolean,
  profileInfo: ResearcherProfile,
  isEditing: boolean
}

const initState: ReducerState = {
  isAdminDashboardShowing: false,
  profileInfo: initialProfileInfo,
  isEditing: false,
}

const enum REDUCER_ACTION_TYPE {
  TOGGLE_ADMIN_DASHBOARD,
  SET_PROFILE_INFO,
  SET_IS_EDITING
};

type ToggleAction = {
  type: REDUCER_ACTION_TYPE.TOGGLE_ADMIN_DASHBOARD
  | REDUCER_ACTION_TYPE.SET_IS_EDITING,
  payload: boolean
}

type ProfileAction = {
  type: REDUCER_ACTION_TYPE.SET_PROFILE_INFO,
  payload: ResearcherProfile
}

type ReducerAction = ToggleAction | ProfileAction;

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.TOGGLE_ADMIN_DASHBOARD:
      return { ...state, isEditing: false, isAdminDashboardShowing: !action.payload };
    case REDUCER_ACTION_TYPE.SET_PROFILE_INFO:
      return { ...state, profileInfo: action.payload ? action.payload : initState.profileInfo }
    case REDUCER_ACTION_TYPE.SET_IS_EDITING:
      return { ...state, isEditing: action.payload }
    default:
      return { ...state };
  }
}

export default function Profile() {
  const theme = useTheme();
  const { user } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initState);

  const getProfileInfo = () => {
    const url = `${API_ROUTES.RESEARCHER.GET_RESEARCHER_BY_ID}/${user.researcherId}`;

    fetch(url, {
      method: "GET",
      credentials: 'include'
    }).then(res => res.json()
      .then((serverResponse: GetResearcherByAuth) => {
        if (serverResponse.statusCode === HttpStatusCode.OK) {
          const { researcher, profilePicture } = serverResponse.data;
          const serverProfileData: ResearcherProfile = {
            researcherId: researcher.researcherId,
            firstName: researcher.firstName,
            lastName: researcher.lastName,
            institution: researcher.institution,
            department: researcher.department,
            biography: researcher.biography ?? '',
            profilePicture: profilePicture,
            imageName: researcher.imageName ?? ''
          }
          dispatch({ type: REDUCER_ACTION_TYPE.SET_PROFILE_INFO, payload: serverProfileData });
        }
      })).catch((e => console.error(e)));
  }

  useEffect(() => {
    getProfileInfo();

    if (user.researcherId === 0)
      navigate("/");

    return () => {

    }
    // eslint-disable-next-line
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }} className='home'>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12}>
          <Item sx={{ borderRadius: 0 }}>
            <h1 className='h1'>
              {state.profileInfo.firstName} {state.profileInfo.lastName}
            </h1>
          </Item>
        </Grid>
          <Grid container item>
            <Link to='/management-dashboard'>
              <Button
                sx={{ margin: 4, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}
              >
                Management Dashboard
              </Button>
          </Link>
          </Grid>
        {!state.isEditing ?
          <>
            <Grid container item textAlign={'center'} alignItems={'center'} justifyContent={'space-around'}>
              <Grid item xs={10} md={6} sx={{ backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', borderRadius: '6px' }} margin={2}>
                <h2>
                  Institution:
                </h2>
                <p>
                  {state.profileInfo.institution}
                </p>
              </Grid>
            </Grid>
            <Grid container item textAlign={'center'} alignItems={'center'} justifyContent={'space-around'}>
              <Grid item xs={10} md={6} margin={2} sx={{ backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', borderRadius: '6px' }}>
                <h2>
                  Department:
                </h2>
                <p>
                  {state.profileInfo.department}
                </p>
              </Grid>
            </Grid>
            <Grid container item textAlign={'center'} alignItems={'center'} justifyContent={'space-around'}>
              <Grid item xs={10} md={6} margin={2} sx={{ backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', borderRadius: '6px' }}>
                <h2>
                  Biography:
                </h2>
                <p>
                  {state.profileInfo.biography}
                </p>
              </Grid>
            </Grid>
            <Grid container item alignItems={'center'} justifyContent={'space-around'}>
              <Button
                sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}
                onClick={() => dispatch({ type: REDUCER_ACTION_TYPE.SET_IS_EDITING, payload: true })}
              >
                Edit
              </Button>
            </Grid>
          </>
          :
          <EditProfile profileInfo={state.profileInfo} getProfileInfo={getProfileInfo} onIsEditing={() => dispatch({ type: REDUCER_ACTION_TYPE.SET_IS_EDITING, payload: false })} />
        }
      </Grid>
      <Footer />
    </Box>
  );
}
