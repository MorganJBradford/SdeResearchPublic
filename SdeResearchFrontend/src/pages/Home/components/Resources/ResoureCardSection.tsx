import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AboutCard from '../About/AboutCard';

const resourceObjects = [
  {
    title: 'Academic Publications',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Summary',
    link: '/academic-publications'
  },
  {
    title: 'Practitioner Publications',
    subheader: '',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Summary',
    link: '/practitioner-publications'
  },
  {
    title: 'Other Media',
    subheader: '',
    image: 'https://selfdeterminationtheory.org/wp-content/uploads/2019/03/library_michael-d-beckwith-575798-unsplash.jpg',
    intro: 'Summary',
    link: '/other-media'
  },
]

export default function ResourceCardSection() {
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
