import { createContext, useEffect, useState, Dispatch, SetStateAction, ReactNode } from 'react';
import { enqueueSnackbar } from 'notistack';
import { NavObject, NavOption, User, GetScholarshipSummaries, TopicIdName, HttpStatusCode, AuthResponse } from '../utils/types';
import { API_ROUTES } from '../utils/constants';

export interface IGlobalContext {
  user: User,
  navObjects: NavObject[],
  setUser: Dispatch<SetStateAction<User>>,
  getPublishedTopics: () => void,
}

const defaultNavObjects = [
  { header: 'About Us', navOptions: [{ subheader: 'Purpose', link: '/purpose' }, { subheader: 'Who we are', link: '/who-we-are' }, {subheader: 'What is SDE?', link : '/what-is-sde'},] },
  { header: 'Scholarship Summaries' },
  { header: 'Publications', navOptions: [{ subheader: 'Academic', link: '/publications/academic' }, { subheader: 'Practitioner', link: '/publications/practitioner' }, { subheader: 'Other Media', link: '/other-media' }] },
  { header: 'Get Involved', link: '/get-involved' }
]

export const defaultUser: User = {
  email: '',
  profilePicture: '',
  researcherName: '',
  researcherId: 0,
  isAdmin: false
}

const defaultState = {
  user: {
    email: '',
    profilePicture: '',
    isAdmin: false,
  },
  navObjects: defaultNavObjects,
} as IGlobalContext

export const GlobalContext = createContext(defaultState);

type GlobalProviderProps = {
  children: ReactNode
}


export default function GlobalProvider({ children }: GlobalProviderProps) {
  const [navObjects, setNavObjects] = useState<NavObject[]>(defaultNavObjects);
  const userJson = localStorage.getItem('user');
  const storedUser = userJson !== null && JSON.parse(userJson);
  const [user, setUser] = useState<User>(storedUser !== false ? storedUser : defaultUser);

  const checkAuth = (localUser: User | null) => {
    const url = API_ROUTES.AUTH.REFRESH_TOKEN;

    if (localUser !== null) {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
        .then(res => {
          if (res.status === 401) {
            throw new Error('Unauthorized');
          }

          return res.json()
        })
        .then((serverResponse: AuthResponse) => {
          if (serverResponse.statusCode === HttpStatusCode.OK) {
            const userToSave: User = {
              email: serverResponse.data.email,
              profilePicture: serverResponse.data.profilePicture,
              researcherName: serverResponse.data.researcherName,
              researcherId: serverResponse.data.researcherId,
              isAdmin: serverResponse.data.isAdmin,
            };
            localStorage.setItem('user', JSON.stringify(userToSave));
            setUser(userToSave);
          }
        })
        .catch((error) => {
          if (error.message === 'Unauthorized') {
            localStorage.removeItem('user');
            setUser(defaultUser);
            enqueueSnackbar('Please login', { variant: 'info', autoHideDuration: 2000 });
          } else {
            console.error(error);
          }
        });
    }
  };

  const getPublishedTopics = () => {
    const url = API_ROUTES.TOPIC.GET_SCHOLARSHIP_SUMMARIES;

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    })
      .then(res => res.json())
      .then((serverResponse: GetScholarshipSummaries) => {
        if (serverResponse.statusCode === HttpStatusCode.OK) {
          handleNavObjects(serverResponse.data);
        } else {
          setNavObjects(defaultNavObjects);
        }
      })
      .catch((error => {
        console.error(error);
      }));
  }

  const handleNavObjects = (summaryLinks: TopicIdName[]) => {
    let tempNav = navObjects;
    const navOptions: NavOption[] = summaryLinks.map((summary) => {
      const { topicName } = summary;
      const link = topicName.replace(/\s/g, "");
      return { subheader: topicName, link: `/scholarship-summaries/${link}`, id: summary.topicId };
    });

    const topicsObject: NavObject = { header: 'Scholarship Summaries', navOptions: navOptions }
    tempNav[1] = topicsObject;
    setNavObjects(tempNav);
  }

  useEffect(() => {
    getPublishedTopics();
    checkAuth(JSON.parse(localStorage.getItem('user') || 'null'));

    const refreshInterval = setInterval(() => {
      checkAuth(JSON.parse(localStorage.getItem('user') || 'null'));
    }, 2400000);

    return () => {
      clearInterval(refreshInterval);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <GlobalContext.Provider value={
      {
        navObjects,
          getPublishedTopics,
        user,
          setUser,
      }
    }>
      {children}
    </GlobalContext.Provider>
  );
}
