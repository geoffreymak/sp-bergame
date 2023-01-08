/* eslint-disable arrow-body-style */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
/* eslint-disable object-curly-newline */
/* eslint-disable indent */
// import { matchPath } from 'react-router';
import PropTypes from 'prop-types';
import { Button, ListItem } from '@material-ui/core';

const NavItemButton = ({ icon: Icon, title, onClick, ...rest }) => {
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        py: 0
      }}
      {...rest}
    >
      <Button
        onClick={onClick}
        sx={{
          color: 'text.secondary',
          fontWeight: 'medium',
          justifyContent: 'flex-start',
          letterSpacing: 0,
          py: 1.25,
          textTransform: 'none',
          width: '100%',
          '& svg': {
            mr: 1
          }
        }}
      >
        {Icon && <Icon size="20" />}
        <span>{title}</span>
      </Button>
    </ListItem>
  );
};

NavItemButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItemButton;
