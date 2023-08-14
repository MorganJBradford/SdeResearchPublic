import { useState, useContext } from 'react';
import { Avatar, Box, Button, Card, CardActions, CardContent, Typography, useTheme } from '@mui/material';
import { HttpStatusCode, Researcher, ServerResponse } from '../utils/types';
import { GlobalContext } from '../contexts/GlobalContext';
import { API_ROUTES } from '../utils/constants';
import { enqueueSnackbar } from 'notistack';
import ConfirmationDialog from './ConfirmationDialog';

type ProfileCardProps = {
  sx?: object,
  isWhoWeAre?: boolean,
  researcher: Researcher,
  getResearchers?: () => void
}

export default function ProfileCard({ sx, researcher, getResearchers, isWhoWeAre = false}: ProfileCardProps) {
  const theme = useTheme();
  const { user } = useContext(GlobalContext);
  const { firstName, lastName, profilePicture, hasAdminApprovedProfile, institution, department, biography } = researcher;
  const [isBioShowing, setIsBioShowing] = useState<boolean>(isWhoWeAre);

  const approveResearcherProfileById = () => {
    const url = `${API_ROUTES.RESEARCHER.APPROVE_RESEARCHER_PROFILE_BY_ID}/${researcher.researcherId}`;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse )=> {
        const { statusCode, message} = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
          getResearchers && getResearchers();
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((e) => {
        console.error(e);
      });
  }

  const dialogProps = {
    dialogTitle: hasAdminApprovedProfile ? 'Hide Profile': 'Approve Profile',
    dialogDescription: hasAdminApprovedProfile ? 'Hiding a researchers profile will: 1) Remove the researcher from the "Who We Are" page; 2) Hide any pages the researcher authors; 3) Hide any publications uploaded by the researcher.' : 'By approving a researchers profile you are allowing the following: 1) A researchers profile may be viewed on the "Who Are We" page; 2) Researchers are able to author a topic page (subject to admin approval).',
    openDialogButtonProps: {
      text: hasAdminApprovedProfile ? 'Make Private' : 'Approve Profile',
      styles: { margin: 2, color: 'whitesmoke', "&:hover": { backgroundColor: hasAdminApprovedProfile ? 'red' : 'green'},},
    },
    confirmationButtonProps: {
      text: hasAdminApprovedProfile ? 'Hide' : 'Approve',
      styles: { margin: 2, color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, "&:hover": { backgroundColor: hasAdminApprovedProfile ? 'red' : 'green'},},
      onConfirm: approveResearcherProfileById
    }
  }

  return (
    <Card
      sx={sx}
    >
      <CardContent>
        <Box sx={{ display: 'flex', marginBottom: '14px' }}>
          <Avatar alt='researcher' src={profilePicture} sx={{ width: 56, height: 56, margin: '2px 10px 10px 2px' }} />
          <Typography  >
            <Typography sx={{ fontSize: '24px' }} >
              {firstName} {lastName}
            </Typography>
            <Typography>
              {institution}
            </Typography>
            <Typography>
              {department}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{display: 'flex'}}>
          {isBioShowing &&
            <Typography sx={{padding: 1}}>
              {biography}
            </Typography>
          }
        </Box>
      </CardContent>
      <CardActions>
        {!isWhoWeAre &&
          <Button sx={{margin: 2, color: 'whitesmoke', "&:hover": { backgroundColor: theme.palette.primaryPalette.blueColor }}} onClick={() => setIsBioShowing(!isBioShowing)}>Read Bio</Button>
        }
        {user.isAdmin &&

          <ConfirmationDialog
            dialogTitle={dialogProps.dialogTitle}
            dialogDescription={dialogProps.dialogDescription}
            openDialogButtonProps={dialogProps.openDialogButtonProps}
            confirmationButtonProps={dialogProps.confirmationButtonProps}
          />
        }
      </CardActions>
    </Card>
  );
}
