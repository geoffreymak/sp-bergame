import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { useGlobalState } from "contexts/GlobalState";

const RouteWithLayout = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;
  // const { isAuth } = useGlobalState();
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
