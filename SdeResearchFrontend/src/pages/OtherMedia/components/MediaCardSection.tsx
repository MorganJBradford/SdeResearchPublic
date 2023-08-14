import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MediaCard from './MediaCard';

const resourceObjects = [
  {
    image: 'https://drive.google.com/uc?export=view&id=14WLoRBbv21pldMPU4vTZFmacYK4blbu3',
    description: 'Liberated Podcast',
    link: 'https://www.liberatedpodcast.com/',
  },
  {
    image: 'https://drive.google.com/uc?export=view&id=1487iaWBKfvt7kJ588kAljo_YyYCNdPzS',
    description: 'Rethinking Self-Directed Education',
    link: 'https://podcasters.spotify.com/pod/show/rethinkingsde',
  },
  {
    image: 'https://drive.google.com/uc?export=view&id=17lknXO8sx8jMT0boIDQ1n-E1fr6e1d9_',
    description: 'Fare of the Free Child',
    link: 'https://fofc.buzzsprout.com/',
  },
  {
    image: 'https://drive.google.com/uc?export=view&id=15f0IMdIvzju52Si63DQKptMAHeM21xzv',
    description: 'Raising Free People',
    link: 'https://raisingfreepeople.com/network/',
  },
  {
    description: 'Self-Directed Education | Interview with Peter Gray',
    youtubeId: 'Qjb0TgoPOvA'
  },
  {
    description: 'Peter Gray: Self Directed Education. What Is It, How Does It Work?',
    youtubeId: 'DYYbYyGbEcc'
  },
  {
    description: 'Peter Gray: The Biology of Education - How Children Learn Through Self-Directed Play and Exploration',
    youtubeId: '_EZi9Vp0q5U'
  },
  {
    description: "Peter Gray: Mother Nature's Pedagogy: Insights from Evolutionary Psychology",
    youtubeId: 'G2BAJ_svbhA'
  },
  {
    description: 'The decline of play | Peter Gray | TEDxNavesink',
    youtubeId: 'Bg-GEzM7iTk'
  },
  {
    description: 'Luminous Education Revolution - Dr Peter Gray PhD on Self-directed Play-Based Education.',
    youtubeId: 'g-_LMPXh7nQ'
  },
  {
    description: 'Peter Gray | The Biology of Education and the Obsolescence of School',
    youtubeId: 'FLPuCWX5atM'
  },
  {
    description: 'The SDE Weekend 3: Intrinsic Motivation and Unschooling with Gina Riley, Ph.D.',
    youtubeId: '8zqJ_hjE3Zw'
  },
  {
    description: 'Gina Riley: A Survey of 75 Grown Unschoolers',
    youtubeId: 'S6B4zJT2piE'
  },
  {
    description: 'Intrinsic Motivation and Self Determination in Learning | Dr. Gina Riley',
    youtubeId: 'ruxmp6jfQmY'
  },
  {
    description: 'Unschooling and self directed education',
    youtubeId: '5cpM1ZkCprg'
  },
  {
    description: 'DDE OS#12, "Civil disobedience in democratic education" by Eugene Matusov',
    youtubeId: 'eow291d_P78'
  },
  {
    description: 'The Self-Organizing Child: Chris Mercogliano at TEDxYouth@BFS',
    youtubeId: 'i0fg73WnLWQ'
  },
  {
    description: 'Raising Free People | Akilah Richards | TEDxAsburyPark',
    youtubeId: 'UgbD1qrJ0c4'
  },
  {
    description: "Akilah S Richards From 'Schoolishness' To Self directed Education",
    youtubeId: 'hUnaMJ5C9HY'
  },
  {
    description: 'Kenneth Danford: Making School Optional - Helping Families Embrace Self-Directed Learning',
    youtubeId: 'fd-4q5X9rIk'
  }
]

export default function MediaCardSection() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <Grid container columnSpacing={{xs: 12, sm: 4}} alignItems='center' justifyContent='center' sx={{marginBottom: '20px'}} spacing={2}>
        {resourceObjects.map((resource, i) => {
          return (
          <Grid item key={i}>
            <MediaCard resource={resource}/>
          </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
