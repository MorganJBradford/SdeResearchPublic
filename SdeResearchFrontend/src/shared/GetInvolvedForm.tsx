import React, { useRef, useState, FormEvent } from 'react';
import { TextField, Button, FormGroup, FormControl, FormLabel, FormControlLabel, Checkbox, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { API_ROUTES } from '../utils/constants';
import { HttpStatusCode, ServerResponse } from '../utils/types';

type FormInfo = {
  name: string;
  email: string;
  subjects: string[];
  body: string;
};

export default function GetInvolvedForm() {
  const theme = useTheme();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    setSelectedSubjects((prevSelectedSubjects) => {
      if (checked) {
        return [...prevSelectedSubjects, value];
      } else {
        return prevSelectedSubjects.filter((subject) => subject !== value);
      }
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formInfo = new FormData(e.currentTarget);
    const url = API_ROUTES.EMAIL.GET_INVOLVED;

    const data: FormInfo = {
      name: formInfo.get('name') as string,
      email: formInfo.get('email') as string,
      subjects: selectedSubjects,
      body: formInfo.get('body') as string,
    };

    if (data.subjects.length < 1) {
      enqueueSnackbar('Please select a subject', { variant: 'info', autoHideDuration: 5000 });
      return;
    }

    const requestBody = {
      name: data.name,
      replyTo: data.email,
      subject: data.subjects.join('; '),
      body: data.body,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 5000 });
          formRef.current?.reset();
          setSelectedSubjects([]);
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 5000 });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={onSubmit} ref={formRef}>
      <FormControl sx={{ display: 'flex' }}>
        <FormGroup>
          <TextField name="name" required type="text" label="Name" margin="dense" />
          <TextField name="email" required type="email" label="Email" margin="dense" />
        </FormGroup>
        <FormGroup sx={{ margin: '20px' }}>
          <FormLabel>Subject</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                name="subjects"
                value={'Subscribe to Newsletter'}
                checked={selectedSubjects.includes('Subscribe to Newsletter')}
                onChange={handleSubjectChange}
              />
            }
            label={'Subscribe to Newsletter'}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="subjects"
                value={'Researcher Interested in Membership'}
                checked={selectedSubjects.includes('Researcher Interested in Membership')}
                onChange={handleSubjectChange}
              />
            }
            label={'Researcher Interested in Membership'}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="subjects"
                value={'Research Participant (student, graduate, parent, staff)'}
                checked={selectedSubjects.includes('Research Participant (student, graduate, parent, staff)')}
                onChange={handleSubjectChange}
              />
            }
            label={'Research Participant (student, graduate, parent, staff)'}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="subjects"
                value={'Media and Other Inquiries'}
                checked={selectedSubjects.includes('Media and Other Inquiries')}
                onChange={handleSubjectChange}
              />
            }
            label={'Media and Other Inquiries'}
          />
        </FormGroup>
        <TextField required name="body" multiline rows={6} type="text" label="Message" margin="dense" />
      </FormControl>
      <Button sx={{display: 'block', width: '100%', margin: '12px auto',backgroundColor: theme.palette.primaryPalette.lightColor, color: 'whitesmoke', ":hover": { backgroundColor: 'green'}}} type="submit">Submit</Button>
    </form>
  );
}
