import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
} from '@mui/material';

import { GetLatestNews, HttpStatusCode, News } from '../../utils/types';
import { API_ROUTES } from '../../utils/constants';

import NavBar from '../../shared/NavBar';
import HomeIntro from './components/HomeIntro';
import HomeResources from './components/Resources/HomeResources';
import HomeNews from './components/News/HomeNews';
import Footer from '../../shared/Footer';
import GetInvolvedForm from '../../shared/GetInvolvedForm';

const defaultNews: News[] = [{
  id: 0,
  title: '',
  body: '',
  createdAt: '',
  updatedAt: '',
}]

export default function Home() {
  const [news, setNews] = useState<News[]>(defaultNews);
  const getLatestNewsAsync = () => {
    const url = API_ROUTES.NEWS.GET_LATEST_NEWS;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then((serverResponse: GetLatestNews) => {
        if (serverResponse.statusCode === HttpStatusCode.OK) {
          setNews(serverResponse.data);
        } else {
          setNews(defaultNews);
        }
      }).catch((e) => {
        console.error(e);
      });
  }

  useEffect(() => {
    getLatestNewsAsync();
    return () => { }
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }} className='home'>
      <Grid container spacing={2}>
        <NavBar />
        <img
          src="https://drive.google.com/uc?export=view&id=1FlULQnQ50bAql6u6Y_m6ucMwYdYBg6vp"
          className='header-photo'
          alt="banner"
        />
        <HomeIntro />
        <HomeResources />
        <Grid item xs={12}>
          <h1 style={{ textAlign: 'center' }}>
            Get Involved
          </h1>
        </Grid>
        <Grid container item spacing={0}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container columnSpacing={{ sm: 4 }} alignItems='center' justifyContent='space-around' sx={{ marginBottom: '40px' }} spacing={2}>
              <GetInvolvedForm />
            </Grid>
          </Box>
        </Grid>
        <HomeNews news={news} getLatestNews={getLatestNewsAsync} />
        <img
          src="https://drive.google.com/uc?export=view&id=1jdxQXnRGnzta5EWSEJ9fU6-WT0JQCYUf"
          style={{width: '100%'}}
          alt="banner"
        />
      </Grid>
      <Footer />
    </Box>
  );
}
