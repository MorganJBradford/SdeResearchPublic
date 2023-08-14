import { useReducer, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Grid, Typography } from '@mui/material';
import NavBar from '../../shared/NavBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { API_ROUTES } from '../../utils/constants';
import PublicationCard from './PublicationCard';
import Footer from '../../shared/Footer';
import { GetPublicationsPage, BasePublication, PublicationCategory, BaseTopic, GetPublications, HttpStatusCode } from '../../utils/types';
import { useLocation } from 'react-router';

type State = {
  isLoading: boolean,
  isMainAccordionOpen: boolean,
  subAccordionCategoryId: number | boolean,
  categoryTopics: PublicationCategory[],
  publications: BasePublication[]
}

const initState: State = {
  isLoading: true,
  isMainAccordionOpen: true,
  subAccordionCategoryId: false,
  categoryTopics: [],
  publications: []
}

enum ACTION_TYPE {
  TOGGLE_MAIN_ACCORDION,
  TOGGLE_SUB_ACCORDION,
  SET_CATEGORY_TOPICS,
  SET_PUBLICATIONS,
  SET_STATE
}

type Action = {
  type: ACTION_TYPE.TOGGLE_MAIN_ACCORDION;
} | {
  type: ACTION_TYPE.TOGGLE_SUB_ACCORDION;
  payload: number | boolean
} | {
  type: ACTION_TYPE.SET_CATEGORY_TOPICS;
  payload: PublicationCategory[];
}| {
  type: ACTION_TYPE.SET_PUBLICATIONS;
  payload: BasePublication[];
} | {
  type: ACTION_TYPE.SET_STATE;
  payload: {
    state: State,
    isLoading: boolean
  }
}


const reducer = (state: State, action: Action) => {
  const { isMainAccordionOpen, subAccordionCategoryId } = state;
  switch (action.type) {
    case ACTION_TYPE.TOGGLE_MAIN_ACCORDION:
      return { ...state, isMainAccordionOpen: !isMainAccordionOpen, subAccordionCategoryId: false }
    case ACTION_TYPE.TOGGLE_SUB_ACCORDION:
      const payload = subAccordionCategoryId === action.payload ? false : action.payload;
      return { ...state, subAccordionCategoryId: payload }
    case ACTION_TYPE.SET_CATEGORY_TOPICS:
      return { ...state, isLoading: false, categoryTopics: action.payload }
    case ACTION_TYPE.SET_PUBLICATIONS:
      return { ...state, publications: action.payload }
    case ACTION_TYPE.SET_STATE:
      return { ...action.payload.state, isLoading: action.payload.isLoading }
    default:
      return state
  }
}

export default function AcademicPublications() {
  const [state, dispatch] = useReducer(reducer, initState);
  const location = useLocation();

  const getPageData = (publicationType: string) => {
    dispatch({ type: ACTION_TYPE.SET_STATE, payload: {state: initState, isLoading: true} });
    const url = `${API_ROUTES.TOPIC_CATEGORY.GET_PUBLICATIONS_PAGE}?type=${publicationType}`;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => res.json())
      .then((serverResponse: GetPublicationsPage) => {
        if (serverResponse.statusCode === HttpStatusCode.OK)
          dispatch({ type: ACTION_TYPE.SET_CATEGORY_TOPICS, payload: serverResponse.data.categories });
        else
          dispatch({ type: ACTION_TYPE.SET_STATE, payload: { state: initState, isLoading: false } });
      }).catch((error) => {
        console.error(error);
      });
  }

  const getPublications = (categoryId: number, topicId: number) => {
    const url = `${API_ROUTES.PUBLICATION.GET_PUBLICATIONS_BY_CATEGORY_AND_TOPIC_ID}?categoryId=${categoryId}&topicId=${topicId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }).then(res => res.json())
      .then((serverResponse: GetPublications) => {
        if (serverResponse.statusCode === HttpStatusCode.OK)
          dispatch({ type: ACTION_TYPE.SET_PUBLICATIONS, payload: serverResponse.data });

      }).catch((error) => {
        console.error(error);
      });

  }

  useEffect(() => {
    getPageData(location.pathname.split('/')[2]);
    return () => {

    }
  }, [location]);


  return (
    <Box sx={{ flexGrow: 1 }} className='publications'>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NavBar />
        </Grid>
        <Grid item xs={12} className='grid-section-header'>
          <h1 className='h1'>
            {location.pathname.split('/')[2].charAt(0).toUpperCase()}{location.pathname.split('/')[2].slice(1)} Publications
          </h1>
        </Grid>
        <Grid container item sx={{marginBottom: '30vh'}}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container justifyContent='space-around' spacing={2}>
              {state.isLoading ?
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
                :
                state.categoryTopics.length > 0 ?
                  <>
                    <Grid item xs={8} md={4}>
                      <Accordion
                        className='accordion-main'
                        data-testid='main-accordion-container'
                        expanded={state.isMainAccordionOpen}
                        onChange={() => dispatch({ type: ACTION_TYPE.TOGGLE_MAIN_ACCORDION })}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="main-panelbh-content"
                          id="main-panelbh-header"
                          data-testid='main-accordion-summary'
                          className='summary'
                        >
                          <Typography>
                            Categories
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails className='details'>
                          {state.categoryTopics.map((category: PublicationCategory, i: number) => {
                            return (
                              <Accordion
                                key={i}
                                className='accordion-secondary'
                                data-testid='sde-accordion-container'
                                expanded={state.subAccordionCategoryId === category.categoryId}
                                onChange={() => dispatch({ type: ACTION_TYPE.TOGGLE_SUB_ACCORDION, payload: category.categoryId })}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel3bh-content"
                                  id="panel3bh-header"
                                  data-testid='sde-accordion-summary'
                                >
                                  <Typography className='header'>
                                    {category.categoryName}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Typography>
                                    <ul>
                                      {category.topics.map((topic: BaseTopic, i: number) => {
                                        return (
                                          <li key={i}>
                                            <div
                                              onClick={() => getPublications(category.categoryId, topic.topicId)} className='list-item' key={i}
                                            >
                                              {topic.topicName}
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Typography>
                                </AccordionDetails>
                              </Accordion>
                            );
                          })
                          }
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      {state.publications.map((publication: BasePublication, i) =>
                        <PublicationCard publication={publication} key={i} />
                      )}
                    </Grid>
                  </>
                  :
                  <div style={{marginBottom: '10vh'}}>No {location.pathname.split('/')[2]} publications are available at this time.</div>
              }
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
}
