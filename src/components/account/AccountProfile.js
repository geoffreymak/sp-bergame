/* eslint-disable  */
import { Avatar, Box, Card, CardContent, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import logo from '../../images/bergame.png';

const AccountProfile = (props) => {
  const user = useSelector((state) => state.user.data);
  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={logo}
            sx={{
              cursor: 'pointer',
              width: 100,
              height: 'auto',
              marginBottom: 2
            }}
            variant="square"
          />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user && user.username}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountProfile;
