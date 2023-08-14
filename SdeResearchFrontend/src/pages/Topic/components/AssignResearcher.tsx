import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { MenuItem, TextField, useTheme } from '@mui/material';
import { GetResearchersIdsNames, HttpStatusCode, ResearcherIdName, ServerResponse } from '../../../utils/types';
import { API_ROUTES } from '../../../utils/constants';
import { enqueueSnackbar } from 'notistack';



type AssignResearcherProps = {
  authorId: number;
  authorName: string;
  topicId: number;
  hasDetails: boolean
}

export default function AssignResearcher({
  authorId,
  authorName,
  topicId,
  hasDetails
}: AssignResearcherProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [researchers, setResearchers] = useState<ResearcherIdName[]>([{
    researcherId: 0,
    researcherName: ''
  }]);
  const [idToSend, setIdToSend] = useState<number>(authorId);

  const handleClickOpen = () => {
    const url = API_ROUTES.RESEARCHER.GET_ALL_IDS_NAME;

    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: GetResearchersIdsNames) => {
        const { data, statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          setResearchers(data);
          setOpen(true);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 2000 });
        }
      }).catch((error) => {
        console.error(error);
      });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIdToSend(parseInt(e.target.value));
  }

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    const url = `${API_ROUTES.TOPIC.ASSIGN_AUTHOR}`

    if (idToSend === 0)
      return enqueueSnackbar("Please select a researcher", { variant: 'info', autoHideDuration: 5000});

    const data = {
      topicId,
      researcherId: idToSend
    }

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    }).then(res => res.json())
    .then((serverResponse: ServerResponse) => {
      const { statusCode, message } = serverResponse;
      if (statusCode === HttpStatusCode.Created)
      enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000});
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <div style={{ display: 'inline-flex' }}>
      <Button sx={{ color: 'whitesmoke', backgroundColor: theme.palette.primaryPalette.lightColor, '&:hover': { backgroundColor: hasDetails ? 'red' : 'green' } }} onClick={handleClickOpen}>
        {hasDetails ?
          'Change Author'
          :
          'Assign Author'
        }
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <TextField sx={{ width: '100%' }} label='Author' select defaultValue={authorName} onChange={onChange}>
            {researchers.map((researcher: ResearcherIdName, i: number) =>
              <MenuItem value={researcher.researcherId} key={i}>
                {researcher.researcherName}
              </MenuItem>
            )}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirm} autoFocus>
            Confirm Button
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
