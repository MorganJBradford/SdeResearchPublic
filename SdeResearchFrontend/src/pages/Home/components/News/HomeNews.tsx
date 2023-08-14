import { useContext, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  useTheme
} from '@mui/material';
import HomeNewsCard from './HomeNewsCard';
import AddNewsCard from './AddNewsCard';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { API_ROUTES } from '../../../../utils/constants';
import { enqueueSnackbar } from 'notistack';
import ConfirmationDialog from '../../../../shared/ConfirmationDialog';
import { ConfirmationDialogProps, HttpStatusCode, News, ServerResponse } from '../../../../utils/types';


type HomeNewsProps = {
  news: News[],
  getLatestNews: () => void
}
const defaultNews = {
  title: '',
  body: '',
}


export default function HomeNews({ news, getLatestNews }: HomeNewsProps) {
  const theme = useTheme();
  const { user } = useContext(GlobalContext);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [title, setTitle] = useState<string>();
  const [body, setBody] = useState<string>();

  const handleIsAddingNews = () => {
    setTitle('');
    setBody('');
    setIsEditing(null);
    setIsAddingNews(!isAddingNews);
  }

  const handleIsEditing = (index: number) => {
    setIsAddingNews(false)
    if (index === isEditing) {
      setIsEditing(null);
    } else {
      setIsEditing(index);
    }
  }

  const handleNewsChange = (editedContent: string, editingTitle: boolean) => {
    if (editingTitle) {
      setTitle(editedContent);
    } else {
      setBody(editedContent);
    }
  }

  const handleAddNews = () => {
    const url = API_ROUTES.NEWS.ADD_NEWS;

    const dataToPass = {
      title: title,
      body: body,
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          getLatestNews();
          setIsAddingNews(false);
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((e) => {
        console.error(e);
      });
  }

  const handleUpdateNewsItem = (id: number) => {
    const url = API_ROUTES.NEWS.UPDATE_NEWS_ITEM;

    const dataToPass = {
      id: id,
      title: title,
      body: body,
    }

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(dataToPass)
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.Created) {
          getLatestNews();
          setIsEditing(null);
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((e) => {
        console.error(e);
      });
  }

  const handleDeleteNewsItem = (id: number) => {
    const url = `${API_ROUTES.NEWS.DELETE_NEWS_ITEM_BY_ID}/${id}`

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          getLatestNews();
          enqueueSnackbar(message, { variant: 'success', autoHideDuration: 1000 });
        } else {
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((e) => {
        console.error(e);
      })
  }

  const addNewsConfirmationProps: ConfirmationDialogProps = {
    dialogTitle: 'Add News',
    dialogDescription: 'Post news article?',
    openDialogButtonProps: {
      styles: { color: 'green' },
      text: 'Add',
    },
    confirmationButtonProps: {
      onConfirm: handleAddNews,
      styles: { color: 'green' },
      text: 'Save'
    }
  }

  const updateNewsItemConfirmationProps: ConfirmationDialogProps = {
    dialogTitle: 'Update Post',
    dialogDescription: 'Save changes to post?',
    openDialogButtonProps: {
      styles: { color: 'green' },
      text: 'Update',
    },
    confirmationButtonProps: {
      onConfirmById: handleUpdateNewsItem,
      styles: { color: 'green' },
      text: 'Update'
    }
  }

  const deleteNewsItemConfirmationProps: ConfirmationDialogProps = {
    dialogTitle: 'Delete News',
    dialogDescription: 'Delete news post?',
    openDialogButtonProps: {
      styles: { color: 'red' },
      text: 'Delete',
    },
    confirmationButtonProps: {
      onConfirmById: handleDeleteNewsItem,
      styles: { color: 'red' },
      text: 'Delete'
    }
  }

  return (
    <>
      {(news.length > 0 || user.isAdmin) &&
        <>
          <Grid item xs={12} sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}>
            <h1 style={{ textAlign: 'center' }}>
              What's New?
            </h1>
          </Grid>
          <Grid container item paddingBottom={6} spacing={0} sx={{backgroundColor: theme.palette.primaryPalette.lightColor}}>
            <Box sx={{ padding: '0 7.5% 0 7.5%', flexGrow: 1 }}>
              <Grid container direction='column' alignItems='center' justifyContent='center' spacing={6}>
                {user.isAdmin &&
                  <Grid item>
                    {!isAddingNews &&
                      <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleIsAddingNews()}>
                        Add News
                      </Button>
                    }
                  </Grid>
                }
                {isAddingNews &&
                  <Grid item>
                    <AddNewsCard news={defaultNews} onChange={handleNewsChange} />
                    <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => setIsAddingNews(false)}>Cancel</Button>
                    <ConfirmationDialog
                      dialogTitle={addNewsConfirmationProps.dialogTitle}
                      dialogDescription={addNewsConfirmationProps.dialogDescription}
                      openDialogButtonProps={addNewsConfirmationProps.openDialogButtonProps}
                      confirmationButtonProps={addNewsConfirmationProps.confirmationButtonProps}
                    />
                  </Grid>
                }
                {news.map((newsItem, index) => {
                  return (
                    <Grid
                      item
                      key={index}
                      style={{ marginBottom: `${index === news.length - 1 ? '20px' : '0'}` }}
                    >
                      {isEditing === index ?
                        <AddNewsCard news={newsItem} onChange={handleNewsChange} />
                        :
                        <HomeNewsCard news={newsItem} />
                      }
                      {user.isAdmin &&
                        <>
                          <Button sx={{backgroundColor: theme.palette.primaryPalette.darkColor, color: 'whitesmoke', ":hover": { backgroundColor: theme.palette.primaryPalette.blueColor}}} onClick={() => handleIsEditing(index)}>
                            {isEditing === index ?
                              'Cancel'
                              :
                              'Edit'
                            }
                          </Button>
                          <ConfirmationDialog
                            dialogTitle={deleteNewsItemConfirmationProps.dialogTitle}
                            dialogDescription={deleteNewsItemConfirmationProps.dialogDescription}
                            openDialogButtonProps={deleteNewsItemConfirmationProps.openDialogButtonProps}
                            confirmationButtonProps={deleteNewsItemConfirmationProps.confirmationButtonProps}
                            id={newsItem.id}
                          />
                          {isEditing === index &&
                            <ConfirmationDialog
                              dialogTitle={updateNewsItemConfirmationProps.dialogTitle}
                              dialogDescription={updateNewsItemConfirmationProps.dialogDescription}
                              openDialogButtonProps={updateNewsItemConfirmationProps.openDialogButtonProps}
                              confirmationButtonProps={updateNewsItemConfirmationProps.confirmationButtonProps}
                              id={newsItem.id}
                            />
                          }
                        </>
                      }
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          </Grid>
        </>
      }
    </>
  );
}
