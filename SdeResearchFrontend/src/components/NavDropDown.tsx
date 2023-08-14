import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useMediaQuery from '@mui/material/useMediaQuery';
import { MEDIA_QUERY_CONSTRAINTS } from '../utils/constants';
import { NavOption, NavObject } from '../utils/types';

type NavDropDownProps = {
  headerInfo: NavObject,
  mobile?: boolean,
}

export default function NavDropDown({ headerInfo, mobile }: NavDropDownProps) {
  const { header, link, navOptions } = headerInfo;
  const MIN_WIDTH_LARGE = useMediaQuery(MEDIA_QUERY_CONSTRAINTS.MIN_WIDTH_LARGE);
  const [open, setOpen] = useState(mobile ? true : false);

  const handleShowNavItems = (bool: boolean) => {
    if (!mobile) {
      setOpen(bool)
    }
  }

  return (
    <div
      style={{ flexGrow: 1, alignSelf: 'center'}}
      onMouseEnter={() => handleShowNavItems(true)}
      onMouseLeave={() => handleShowNavItems(false)}
      data-testid="nav-dropdown-wrapper"
      className='dropdown-container'
    >
      {link ?
        <Link to={link} className='nav-header nav-link'>
          {header}
        </Link>
        :
        <span className='nav-header'>
          {header}
        </span>
      }
      {(navOptions && MIN_WIDTH_LARGE) &&
        <ArrowDropDownIcon className='nav-arrow' />
      }

      {(open && navOptions) &&
        <div data-testid="nav-dropdown-list" className='nav-dropdown'>
          {navOptions.map((option: NavOption, i) => {
            const { subheader, link, id } = option;
            return (
              <Link to={link} state={{ topicId: id }} className='nav-item nav-link' key={i}>
                {subheader}
              </Link>
            );
          })}
        </div>
      }
    </div>
  );
}
