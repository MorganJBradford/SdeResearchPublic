import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './static/styles/index.scss';
import { SnackbarProvider } from 'notistack';

import * as ROUTES from './utils/routes';

import GlobalProvider from './contexts/GlobalContext';
import Home from './pages/Home/Home';
import Purpose from './pages/Purpose';
import WhoWeAre from './pages/WhoWeAre';
import WhatIsSde from './pages/WhatIsSde';
import Publications from './pages/Publication/Publications';
import Topic from './pages/Topic/Topic';
import GetInvolved from './pages/GetInvolved';
import OtherMedia from './pages/OtherMedia/OtherMedia';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import RedirectToHome from './pages/RedirectToHome';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ManagementDashboard from './pages/ManagementDashboard/ManagementDashboard';

function App() {

  return (
    <SnackbarProvider>
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.PURPOSE} element={<Purpose />} />
            <Route path={ROUTES.WHO_WE_ARE} element={<WhoWeAre />} />
            <Route path={ROUTES.WHAT_IS_SDE} element={<WhatIsSde />} />
            <Route path={ROUTES.PUBLICATIONS} element={<Publications />} />
            <Route path={ROUTES.TOPIC_NAME} element={<Topic />} />
            <Route path={ROUTES.GET_INVOLVED} element={<GetInvolved />} />
            <Route path={ROUTES.OTHER_MEDIA} element={<OtherMedia />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.RESET} element={<ResetPassword/>} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.MANAGEMENT_DASHBOARD} element={<ManagementDashboard/>}/>
            <Route path='*' element={<RedirectToHome />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </SnackbarProvider>
  );
}

export default App;
