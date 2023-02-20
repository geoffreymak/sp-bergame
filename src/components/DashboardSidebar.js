/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-curly-brace-presence */
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ClosedCaptionOutlinedIcon from '@mui/icons-material/ClosedCaptionOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { useSelector } from 'react-redux';

import NavItem from './NavItem';
import logo from '../images/bergame.png';

const items = [
  {
    href: '/app/home',
    icon: HomeOutlinedIcon,
    title: 'Acceuil'
  },
  // {
  //   href: '/app/account-daily',
  //   icon: AccountBalanceOutlinedIcon,
  //   title: 'Journal de Banque'
  // },
  // {
  //   href: '/app/cash-daily',
  //   icon: SavingsOutlinedIcon,
  //   title: 'Journal de Caisse'
  // },
  {
    href: '/app/various-daily',
    icon: SyncAltOutlinedIcon,
    title: 'Operations diverse'
  },
  {
    href: '/app/correction-daily',
    icon: ErrorOutlineOutlinedIcon,
    title: 'Corrections'
  },
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Correction Ecritures'
  // },
  {
    href: '/app/accounts',
    icon: AccountBalanceWalletOutlinedIcon,
    title: 'Comptes'
  },

  {
    href: '/app/correspond',
    icon: ClosedCaptionOutlinedIcon,
    title: 'Communautés'
  },
  // {
  //   href: '/app/daily',
  //   icon: TableViewOutlinedIcon,
  //   title: 'Journaux'
  // },
  {
    href: '/app/exchange-rate',
    icon: MonetizationOnOutlinedIcon,
    title: 'Saisie lignes budgetaires'
  },
  {
    href: '/app/report',
    icon: DescriptionOutlinedIcon,
    title: 'Rapports'
  }
  // {
  //   href: '/app/products',
  //   icon: ShoppingBagIcon,
  //   title: 'Products'
  // },
  // {
  //   href: '/app/account',
  //   icon: UserIcon,
  //   title: 'Account'
  // },
  // {
  //   href: '/app/settings',
  //   icon: SettingsIcon,
  //   title: 'Settings'
  // },
  // {
  //   href: '/login',
  //   icon: LockIcon,
  //   title: 'Login'
  // },
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   href: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const exercices = useSelector((state) => state.exercices.data);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Avatar
          component={RouterLink}
          src={logo}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 'auto',
            marginBottom: 2
          }}
          variant="square"
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {user && user.username}
        </Typography>
        {/* <Typography color="textSecondary" variant="body2"></Typography> */}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
          {user && (user?.attribut === 'A1' || user?.attribut === 'A0') && (
            <NavItem
              href={'/app/admin-portal'}
              title={'Espace Administrateur'}
              icon={AdminPanelSettingsOutlinedIcon}
            />
          )}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          m: 2,
          p: 2
        }}
      >
        <Typography align="center" gutterBottom variant="h4">
          S.P BERGAME
        </Typography>
        <Typography align="center" variant="body2">
          {`EXERCICE: ${exercices[0]?.code}`}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
              top: 30,
              height: 'calc(100% - 30px)',
              paddingBottom: 30
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 30,
              height: 'calc(100% - 30px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default DashboardSidebar;
