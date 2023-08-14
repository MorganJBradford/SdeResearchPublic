import { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, IconButton } from '@mui/material';
import { defaultUser, GlobalContext } from '../contexts/GlobalContext';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../utils/constants';
import { HttpStatusCode, ServerResponse } from '../utils/types';



type AccountNavigationProps = {
  profilePicture: string | undefined
}

export default function AccountNavigation({ profilePicture }: AccountNavigationProps) {
  const navigate = useNavigate();
  const { setUser } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    const url = API_ROUTES.AUTH.ACCOUNT_LOGOUT;

    fetch(url, {
      method: 'POST',
      credentials: 'include'
    }).then(res => res.json())
      .then((serverResponse: ServerResponse) => {
        const { statusCode, message } = serverResponse;
        if (statusCode === HttpStatusCode.OK) {
          localStorage.removeItem("user");
          setUser(defaultUser);
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'success', autoHideDuration: 1000 });
          navigate('/');
        } else {
          localStorage.removeItem("user");
          setUser(defaultUser);
          enqueueSnackbar(`${statusCode}: ${message}`, { variant: 'error', autoHideDuration: 1000 });
        }
      }).catch((error) => {
        localStorage.removeItem("user");
        setUser(defaultUser);
        console.error(error);
      })
  }

  return (
    <div className='account'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className='avatar-button-wrapper'>
        <IconButton onClick={() => setOpen(!open)}>
          <Avatar alt='profile' src={profilePicture} sx={{ width: 56, height: 56 }} />
        </IconButton>
        {open &&
          <div className='nav-dropdown'>
            <Link to='/profile' className='nav-item nav-link'>
              Profile
            </Link>
            <div aria-label='logout button' onClick={() => handleLogout()} className='nav-item nav-link'>Logout</div>
          </div>
        }
      </div>
    </div>
  );

}
