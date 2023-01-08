import PropTypes from 'prop-types';
import { styled } from '@material-ui/core/styles';
// import MainNavbar from './MainNavbar';

// eslint-disable-next-line no-unused-vars
const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: 'transparent',
  // eslint-disable-next-line quotes
  // backgroundImage: `url("/images/bg.svg")`,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const MainLayoutWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 0
});

const MainLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const MainLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const MainLayout = ({ children }) => (
  <MainLayoutRoot>
    {/* <MainNavbar /> */}
    <MainLayoutWrapper>
      <MainLayoutContainer>
        <MainLayoutContent>{children}</MainLayoutContent>
      </MainLayoutContainer>
    </MainLayoutWrapper>
  </MainLayoutRoot>
);
MainLayout.propTypes = {
  children: PropTypes.node
};
export default MainLayout;
