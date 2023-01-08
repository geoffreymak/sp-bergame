import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import Logo from './Logo';

// eslint-disable-next-line no-unused-vars
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 30,
  backgroundColor: 'transparent'
}));

const MainNavbar = (props) => (
  <StyledAppBar elevation={0} {...props}>
    <Toolbar sx={{ height: 64 }}>
      <RouterLink to="/">
        <Logo />
      </RouterLink>
    </Toolbar>
  </StyledAppBar>
);

export default MainNavbar;
