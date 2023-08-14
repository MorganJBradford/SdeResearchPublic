import { useContext, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router';
import { Button, CircularProgress, useTheme } from '@mui/material';
import { Box, Grid, } from '@mui/material';


import { API_ROUTES } from '../../utils/constants';
import { GlobalContext } from '../../contexts/GlobalContext';
import { TopicWithDetails, GetTopicByIdResponseDto, HttpStatusCode, VIEW_TYPE } from '../../utils/types';
import NavBar from '../../shared/NavBar';
import ProfileCard from '../../shared/ProfileCard';
import EditTopic from './components/EditTopic';
import Footer from '../../shared/Footer';
import { AccordionItem } from './components/AccordionComponents';

const initialTopicState: TopicWithDetails = {
  topicId: 0,
  topicName: '',
  type: '',
  isTopicPagePublished: false,
  details: null
};

type ReducerState = {
  topic: TopicWithDetails;
  expanded: number | false;
  viewType: VIEW_TYPE;
  sectionToEdit: number | null;
  isLoading: boolean;
}

const initState: ReducerState = {
  topic: initialTopicState,
  expanded: false,
  viewType: VIEW_TYPE.VIEW,
  sectionToEdit: null,
  isLoading: true
}

enum REDUCER_ACTION_TYPE {
  CHANGE_VIEW,
  SET_CONTENT,
  TOGGLE_ACCORDION

}

type ReducerAction = {
  type: REDUCER_ACTION_TYPE.CHANGE_VIEW;
  payload: VIEW_TYPE;
} | {
  type: REDUCER_ACTION_TYPE.SET_CONTENT;
  payload: TopicWithDetails;
} | {
  type: REDUCER_ACTION_TYPE.TOGGLE_ACCORDION;
  payload: number | false;
}

const reducer = (state: ReducerState, action: ReducerAction) => {
  const { expanded } = state;
  switch (action.type) {
    case REDUCER_ACTION_TYPE.CHANGE_VIEW:
      return { ...state, viewType: action.payload }
    case REDUCER_ACTION_TYPE.SET_CONTENT:
      return { ...state, topic: action.payload, author: action.payload.details?.researcher, isLoading: false }
    case REDUCER_ACTION_TYPE.TOGGLE_ACCORDION: {
      const expandedPayload = expanded === action.payload ? false : action.payload;
      return { ...state, expanded: expandedPayload }
    }
    default:
      return { ...state }
  }
}



export default function Topic() {
  const { state } = useLocation();
  const theme = useTheme();
  const { user } = useContext(GlobalContext);
  const [reducerState, dispatch] = useReducer(reducer, initState);
  const { topic, expanded, viewType, isLoading } = reducerState;

  const handleChangeView = (view: VIEW_TYPE) => {
    dispatch({ type: REDUCER_ACTION_TYPE.CHANGE_VIEW, payload: view });
  }

  const handleOpenAccordion = (panel: number | false) => {
    dispatch({ type: REDUCER_ACTION_TYPE.TOGGLE_ACCORDION, payload: panel });
  };

  const getTopicById = (topicId: string) => {
    const url = `${API_ROUTES.TOPIC.GET_TOPIC_DETAILS_BY_ID}/${topicId}`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      }
    })
      .then(res => res.json())
      .then((topicFromServer: GetTopicByIdResponseDto) => {
        if (topicFromServer.statusCode === HttpStatusCode.OK) {
          dispatch({ type: REDUCER_ACTION_TYPE.SET_CONTENT, payload: topicFromServer.data });
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  useEffect(() => {
    getTopicById(state.topicId);
    return () => {

    }
  }, [state.topicId]);

  const handleCanUserEdit = () => {
    if (user.researcherId === 0) return false;
    if (user.isAdmin || topic.details === null) return true;

    if (topic.details !== null && topic.details?.researcherId === 0) return true;

    if (topic.details?.researcherId === user.researcherId) return true;

    return false;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1' style={{ color: theme.palette.primaryPalette.darkColor }}>
            {topic.topicName}
          </h1>
        </Grid>
        {(topic.details !== null && topic.details.imageUrl !== "" && viewType === VIEW_TYPE.VIEW) &&
          <div style={{width: '100vw', padding: '4vw'}}>
            <img
              src={topic.details.imageUrl}
              style={{width: '50vw', display: 'flex', aspectRatio: '16/9', margin: '0 auto'}}
              alt="banner"
            />
          </div>
        }
      </Grid>
      <Grid container spacing={2} marginTop={6} justifyContent='space-around' >
        {isLoading ?
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
          :
          viewType !== VIEW_TYPE.EDIT ?
            <>
              {topic.details !== null &&
                <>
                  <Grid item xs={12} md={7}>
                    <AccordionItem
                      content={topic.details.sections}
                      expanded={expanded}
                      onOpenAccordion={handleOpenAccordion}
                      backgroundColor={theme.palette.primaryPalette.lightColor} />
                  </Grid>
                  {(topic.details.researcher.researcherId !== 0) &&
                    <Grid item xs={12} md={4} sx={{marginBottom: '10vh'}}>
                      <ProfileCard researcher={topic.details.researcher} sx={{ width: { sm: '100vw', md: '100%' }, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke' }} />
                    </Grid>
                  }
                </>
              }
              {handleCanUserEdit() &&
                <Grid item xs={10} md={5}>
                  <Button
                    onClick={() => handleChangeView(VIEW_TYPE.EDIT)}
                    sx={{
                      width: '100%',
                      margin: '12px auto',
                      backgroundColor: theme.palette.primaryPalette.darkColor,
                      color: 'whitesmoke',
                      ":hover": {
                        backgroundColor: theme.palette.primaryPalette.blueColor
                      }
                    }}
                  >
                    {topic.details === null ?
                      'Create'
                      :
                      'Update'
                    }
                  </Button>
                </Grid>
              }
            </>
            :
            <EditTopic isAdmin={user.isAdmin} getTopicById={getTopicById} topic={topic} onChangeView={handleChangeView} onOpenAccordion={handleOpenAccordion} expanded={reducerState.expanded} />
        }
      </Grid>
      <Footer />
    </Box>
  );
}
