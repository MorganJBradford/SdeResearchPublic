import { useContext } from 'react';
import {
  AppBar,
  Box,
  Fab,
  Fade,
  Grid,
  Link as MuiLink,
  useScrollTrigger,
  styled,
  Toolbar,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NavDropDown from '../components/NavDropDown';
import useMediaQuery from '@mui/material/useMediaQuery';

import { GlobalContext } from '../contexts/GlobalContext';
import * as ROUTES from '../utils/routes';
import { MEDIA_QUERY_CONSTRAINTS } from '../utils/constants';
import NavPhoto from '../static/images/sde-logo.svg';
import SlackLogo from '../static/images/slack.png';
import SideBar from '../components/SideBar';
import AccountNavigation from '../components/AccountNavigation';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  backgroundColor: theme.palette.primaryPalette.darkColor,
  color: 'whitesmoke',
}));

type Props = {
  children?: React.ReactElement,
}

const ScrollTop = ({ children }: Props) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 80
  })

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

export default function Navbar(props: Props) {
  const theme = useTheme();
  const minWidthLarge = useMediaQuery(MEDIA_QUERY_CONSTRAINTS.MIN_WIDTH_LARGE);
  const { navObjects, user } = useContext(GlobalContext);

  return (
    <Grid item xs={12}>
      <Grid container item sm={12} alignItems={'center'} marginTop={2} marginBottom={2}>
        <MuiLink sx={{margin: '0 1.5em'}} href='https://www.facebook.com/groups/304290420272589' rel='noopener noreferrer' target='_blank' >
          <FacebookIcon />
        </MuiLink>
        <MuiLink  href='https://sderesearchnetwork.slack.com/' rel='noopener noreferrer' target='_blank'>
          <img alt='slack' height='24px' src={SlackLogo} />
        </MuiLink>
        {user.researcherId === 0 &&
        <>
          <Link to={ROUTES.LOGIN}>
            <Button sx={{marginLeft: 3, backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}}>
              Members
            </Button>
          </Link>
        </>
        }
        {((!minWidthLarge)) &&
          <SideBar />
        }
      </Grid>
      <Box sx={{ flexGrow: 1 }} className='navigation'>
        <AppBar position='static'>
          <StyledToolbar id="back-to-top-anchor">
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, alignSelf: 'flex-end' }}
            >
              <Link to='/'>
                <Box
                  component="img"
                  sx={{
                    height: '12vh',
                    margin: '2% 0'
                  }}
                  alt="SDE Research Group"
                  src={NavPhoto}
                />
              </Link>
            </Typography>
            {minWidthLarge &&
              navObjects.map((headerInfoObject, i) => {
                return (
                  <NavDropDown key={i} headerInfo={headerInfoObject} />
                );
              })
            }
            {user.researcherId !== 0 &&
              <AccountNavigation profilePicture={user.profilePicture} />
            }
          </StyledToolbar>
        </AppBar>
      </Box>
      <ScrollTop {...props}>
        <Fab size="large" aria-label="scroll back to top">
          <KeyboardArrowUpIcon sx={{}} />
        </Fab>
      </ScrollTop>
    </Grid>
  );
}
