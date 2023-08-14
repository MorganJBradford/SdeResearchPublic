import { useContext, useState, KeyboardEvent, MouseEvent } from 'react';
import { Box, Button, IconButton, Drawer, List } from '@mui/material';
import NavDropDown from './NavDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import { GlobalContext } from '../contexts/GlobalContext';

export default function SideBar() {
  const { navObjects } = useContext(GlobalContext);
  const [state, setState] = useState({
    top: false,
  });


  /* istanbul ignore next */
  const toggleDrawer = (anchor: string, open: boolean) =>
    (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as KeyboardEvent).key === 'Tab' ||
          (event as KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: string) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {navObjects.map((headerInfoObject, i) => (
          <NavDropDown
            key={i}
            headerInfo={headerInfoObject}
            mobile
          />
        ))}
      </List>
    </Box>
  );

  return (
    <div style={{ position: 'absolute', right: 0 }}>
      <Button onClick={toggleDrawer('top', true)}>
        <IconButton
          size="large"
          edge="start"
          aria-label="open drawer"
          data-testid='burger-menu'
        >
          <MenuIcon />
        </IconButton>
      </Button>
      <Drawer
        anchor={'top'}
        open={state['top']}
        onClose={toggleDrawer('top', false)}
        data-testid='sidebar-drawer'

      >
        <div className='nav-sidebar'>
          {list('top')}
        </div>
      </Drawer>
    </div>
  );
}
