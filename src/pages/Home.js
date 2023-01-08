/* eslint-disable no-unused-vars */
import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Budget from '../components/dashboard/Budget';
// import LatestOrders from '../components/dashboard/LatestOrders';
// import LatestProducts from '../components/dashboard/LatestProducts';
import Sales from '../components/dashboard/Sales';
import TasksProgress from '../components/dashboard/TasksProgress';
import TotalCustomers from '../components/dashboard/TotalCustomers';
import TotalProfit from '../components/dashboard/TotalProfit';
import TrafficByDevice from '../components/dashboard/TrafficByDevice';

import logo from '../images/bergame.png';

const Home = () => (
  <>
    <Helmet>
      <title>Accueil</title>
    </Helmet>
    <Box
      sx={{
        height: '100%',
        minHeight: '100%'
        // pt: 6,
        // pb: 3
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          height: '100%',
          width: '100%'
        }}
      >
        {/* <Card>
          <CardContent> */}
        <Avatar
          src={logo}
          variant="square"
          sx={{
            width: 300,
            height: 'auto'
          }}
        />
        {/* </CardContent>
        </Card> */}
      </Stack>
      {/* <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalCustomers />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid>
           <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container> */}
    </Box>
  </>
);

export default Home;
