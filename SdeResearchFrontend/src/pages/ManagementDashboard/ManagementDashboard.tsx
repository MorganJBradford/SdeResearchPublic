
import { useContext, useEffect, useReducer } from 'react';
import {
  Box,
  Button,
  Grid,
  useTheme
} from '@mui/material';
import { Link, Routes, Route } from 'react-router-dom';
import { API_ROUTES } from '../../utils/constants';
import { GetAnyTopicsExist, HttpStatusCode } from '../../utils/types';
import * as ROUTES from '../../utils/routes';
import { GlobalContext } from '../../contexts/GlobalContext';
import PublicationManager from './Publication/PublicationManager';
import NavBar from '../../shared/NavBar';
import { Item } from '../../shared/Item';
import Footer from '../../shared/Footer';
import TopicManager from '../ManagementDashboard/Topic/TopicManager';
import ResearcherManager from './Researcher/ResearcherManager';

type ReducerState = {
  anyTopicsExist: boolean,
  topicType: string,
  isManagingResearchers: boolean,
  isManagingTopics: boolean,
  isManagingPublications: boolean,
  hiddenButtons?: string[],
}

const initState: ReducerState = {
  anyTopicsExist: false,
  topicType: '',
  isManagingResearchers: false,
  isManagingTopics: false,
  isManagingPublications: false,
}

enum REDUCER_ACTION_TYPE {
  ANY_TOPICS_EXIST,
  TOGGLE_IS_MANAGING_RESEARCHERS,
  TOGGLE_IS_MANAGING_TOPICS,
  TOGGLE_IS_MANAGING_PUBLICATIONS
};

type SetButtonsAction = {
  type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_TOPICS
  | REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_RESEARCHERS
  | REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_PUBLICATIONS
  payload?: string[]
}

type AnyTopicsExistAction = {
  type: REDUCER_ACTION_TYPE.ANY_TOPICS_EXIST,
  payload: {
    anyTopicsExist: boolean,
    topicType: string
  }
}

type ReducerAction = SetButtonsAction | AnyTopicsExistAction;



const reducer = (state: ReducerState, action: ReducerAction) => {
  const { isManagingResearchers, isManagingTopics, isManagingPublications } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_RESEARCHERS:
      return {
        ...state,
        isManagingResearchers: !isManagingResearchers,
        hiddenButtons: action.payload,
      }
    case REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_TOPICS:
      return {
        ...state,
        isManagingTopics: !isManagingTopics,
        hiddenButtons: action.payload
      }
    case REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_PUBLICATIONS:
      return {
        ...state,
        isManagingPublications: !isManagingPublications,
        hiddenButtons: action.payload
      }
    case REDUCER_ACTION_TYPE.ANY_TOPICS_EXIST:
      return { ...state, anyTopicsExist: action.payload.anyTopicsExist, topicType: action.payload.topicType }
    default:
      return state
  }
}

export default function ManagementDashboard() {
  const [reducerState, dispatch] = useReducer(reducer, initState);
  const theme = useTheme();
  const { user } = useContext(GlobalContext);

  const handleManageResearchers = () => {
    if (reducerState.isManagingResearchers) {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_RESEARCHERS, payload: undefined });
    } else {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_RESEARCHERS, payload: ['topics', 'publications'] });
    }
  }
  const handleManageTopics = () => {
    if (reducerState.isManagingTopics) {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_TOPICS, payload: undefined });
    } else {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_TOPICS, payload: ['researchers', 'publications'] });
    }
  }

  const handleManagePublications = () => {
    if (reducerState.isManagingPublications) {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_PUBLICATIONS, payload: undefined })
    } else {
      dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_IS_MANAGING_PUBLICATIONS, payload: ['topics', 'researchers'] })
    }
  }

  const anyTopicsExist = () => {
    const url = API_ROUTES.TOPIC.GET_ANY_TOPICS_EXIST;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
      .then((serverResponse: GetAnyTopicsExist) => {
        const { data, statusCode } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          if (data.anyTopicsExist) {
            const typeToPass = data.academicTopicsExist ? 'academic' : 'practitioner';
            dispatch({ type: REDUCER_ACTION_TYPE.ANY_TOPICS_EXIST, payload: { anyTopicsExist: data.anyTopicsExist, topicType: typeToPass } });
          }
        }
      }).catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    anyTopicsExist();
    return () => {

    }
    // eslint-disable-next-line
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }} className='home'>
      <Grid container marginBottom={6}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12}>
          <Item sx={{ borderRadius: 0, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke' }}>
            <h1 className='h1'>
              {user.researcherName}
            </h1>
          </Item>
        </Grid>
        {user &&
          <Grid container item>
            <Link to='/profile'>
              <Button
                sx={{margin: 4, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}
              >
                Profile
              </Button>
            </Link>
          </Grid>
        }
        <Grid container item textAlign={'center'} alignItems={'center'} justifyContent={'space-around'}>
          {(!reducerState.hiddenButtons?.includes("researchers") && user.isAdmin) &&
            <Grid item xs={10} margin={2}>
              <Link to={reducerState.isManagingResearchers ? ROUTES.MANAGEMENT_DASHBOARD : ROUTES.RESEARCHER_MANAGEMENT}>
                <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleManageResearchers()}>
                  {reducerState.isManagingResearchers ?
                    "Back to Dashboard"
                    :
                    "Manage Researchers"
                  }
                </Button>
              </Link>
            </Grid>
          }
          {!reducerState.hiddenButtons?.includes('topics') &&
            <Grid item xs={10} margin={2}>
              <Link to={reducerState.isManagingTopics ? ROUTES.MANAGEMENT_DASHBOARD : ROUTES.TOPIC_MANAGEMENT}>
                <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleManageTopics()}>
                  {reducerState.isManagingTopics ?
                    'Back to Dashboard'
                    :
                    'Manage Topics'
                  }
                </Button>
              </Link>
            </Grid>
          }
          {(!reducerState.hiddenButtons?.includes("publications") && reducerState.anyTopicsExist) &&
            <Grid item xs={10} margin={2}>
              <Link to={reducerState.isManagingPublications ? ROUTES.MANAGEMENT_DASHBOARD : ROUTES.PUBLICATION_MANAGEMENT} state={{ topicType: reducerState.topicType }}>
                <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleManagePublications()}>
                  {reducerState.isManagingPublications ?
                    "Back to Dashboard"
                    :
                    "Manage Publications"
                  }
                </Button>
              </Link>
            </Grid>
          }
          <Routes>
            <Route path={ROUTES.RESEARCHER_MANAGEMENT} element={<ResearcherManager />} />
            <Route path={ROUTES.TOPIC_MANAGEMENT} element={<TopicManager />} />
            <Route path={ROUTES.PUBLICATION_MANAGEMENT} element={<PublicationManager />} />
          </Routes>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}
