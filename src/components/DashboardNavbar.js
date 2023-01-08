// import { useState } from 'react';

import PropTypes from 'prop-types';
// eslint-disable-next-line object-curly-newline
import { AppBar, Box, Hidden, Toolbar } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
// import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';

import { setUser } from '../redux/user/userSlice';
// eslint-disable-next-line no-unused-vars
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 30,
  backgroundColor: 'transparent'
}));
const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  // const [notifications] = useState([]);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setUser(null));
  };
  return (
    <StyledAppBar elevation={0} {...rest}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden xlDown>
          <Stack direction="row" spacing={1}>
            <Fab color="primary" size="small" onClick={handleLogout}>
              <InputIcon />
            </Fab>
          </Stack>
        </Hidden>
        <Hidden lgUp>
          <Fab color="primary" onClick={onMobileNavOpen} size="small">
            <MenuIcon />
          </Fab>
        </Hidden>
      </Toolbar>
    </StyledAppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
