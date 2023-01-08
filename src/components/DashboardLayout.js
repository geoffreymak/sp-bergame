import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import DashboardNavbar from './DashboardNavbar';
// eslint-disable-next-line import/no-named-as-default
import DashboardSidebar from './DashboardSidebar';

// eslint-disable-next-line no-unused-vars
const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: 'transparent',
  // eslint-disable-next-line quotes
  // backgroundImage: `url("/images/bg.svg")`,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const DashboardLayoutWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 15,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 256
  }
}));

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const DashboardLayout = ({ children }) => {
  const user = useSelector((state) => state.user.data);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <DashboardSidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node
};

export default DashboardLayout;
