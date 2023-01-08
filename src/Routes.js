/* eslint-disable arrow-body-style */
/* eslint-disable object-curly-newline */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { Switch, Redirect } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import RouteWithLayout from './components/RouteWithLayout';
import Account from './pages/Account';
import AccountDaily from './pages/AccountDaily';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import CashDaily from './pages/CashDaily';
import VariousDaily from './pages/VariousDaily';
import Budget from './pages/Budget';
import Daily from './pages/Daily';
import Home from './pages/Home';
import Report from './pages/Report';
import Correspond from './pages/Correspond';
import AdminPortal from './pages/AdminPortal';

// import CustomerList from './pages/CustomerList';
// import Dashboard from './pages/Dashboard';
// import NotFound from './pages/NotFound';
// import ProductList from './pages/ProductList';
// import Register from './pages/Register';
// import Settings from './pages/Settings';

// const routes = [
//   {
//     path: '/',
//     element: <MainLayout />,
//     children: [
//       { path: 'login', element: <Login /> },
//       { path: '/', element: <Navigate to="/login" /> },
//       { path: '*', element: <Navigate to="/login" /> }
//     ]
//   },
//   {
//     path: 'app',
//     element: <DashboardLayout />,
//     children: [
//       { path: 'home', element: <Home /> },
//       { path: 'account', element: <Account /> },
//       { path: 'accounts', element: <Accounts /> },
//       { path: 'account-daily', element: <AccountDaily /> },
//       { path: 'cash-daily', element: <CashDaily /> },
//       { path: 'various-daily', element: <VariousDaily /> },
//       { path: 'daily', element: <Daily /> },
//       { path: 'correspond', element: <Correspond /> },
//       { path: 'report', element: <Report /> },
//       { path: 'exchange-rate', element: <Exchange /> },
//       { path: 'customers', element: <CustomerList /> },
//       { path: 'dashboard', element: <Dashboard /> },
//       { path: 'products', element: <ProductList /> },
//       { path: 'settings', element: <Settings /> },
//       { path: '*', element: <Navigate to="/login" /> }
//     ]
//   }
// ];

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/login" />
      <RouteWithLayout
        component={Login}
        exact
        layout={MainLayout}
        path="/login"
      />

      <RouteWithLayout
        component={Home}
        exact
        layout={DashboardLayout}
        path="/app/home"
      />

      <RouteWithLayout
        component={Account}
        exact
        layout={DashboardLayout}
        path="/app/account"
      />

      <RouteWithLayout
        component={Accounts}
        exact
        layout={DashboardLayout}
        path="/app/accounts"
      />

      <RouteWithLayout
        component={AccountDaily}
        exact
        layout={DashboardLayout}
        path="/app/account-daily"
      />

      <RouteWithLayout
        component={CashDaily}
        exact
        layout={DashboardLayout}
        path="/app/cash-daily"
      />

      <RouteWithLayout
        component={VariousDaily}
        exact
        layout={DashboardLayout}
        path="/app/various-daily"
      />

      <RouteWithLayout
        component={Daily}
        exact
        layout={DashboardLayout}
        path="/app/daily"
      />

      <RouteWithLayout
        component={Budget}
        exact
        layout={DashboardLayout}
        path="/app/exchange-rate"
      />

      <RouteWithLayout
        component={Correspond}
        exact
        layout={DashboardLayout}
        path="/app/correspond"
      />

      <RouteWithLayout
        component={Report}
        exact
        layout={MainLayout}
        path="/app/report"
      />
      <RouteWithLayout
        component={AdminPortal}
        exact
        layout={DashboardLayout}
        path="/app/admin-portal"
      />
      <Redirect to="/login" />
    </Switch>
  );
};

export default Routes;
