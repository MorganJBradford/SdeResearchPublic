import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AboutCard from './AboutCard';

const resourceObjects = [
  {
    title: 'Purpose',
    subheader: '',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Blurb about purpose page',
    link: '/purpose'
  },
  {
    title: 'Who We Are',
    subheader: '',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Blurb about who we are page',
    link: '/who-we-are'
  },
  {
    title: 'What is SDE?',
    subheader: '',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Blurb about what is SDE page',
    link: '/what-is-sde'
  },
]

export default function AboutCardSection() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <Grid container columnSpacing={{xs: 12, sm: 4}} alignItems='center' justifyContent='center' sx={{marginBottom: '20px'}} spacing={2}>
        {resourceObjects.map((resource, i) => {
          return (
          <Grid item key={i}>
            <AboutCard resource={resource}/>
          </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
