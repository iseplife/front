// @flow

import React from 'react';
import { Route, Redirect } from 'react-router';
import { hasRole } from "data/auth";

type Props = {
  component: React.Component<*>,
  [key: string]: any, // allow any props
};

const AuthenticatedRoute = ({
  component: Component,
  roles,
  ...rest
  }: Props) => {
  const authenticated = hasRole(roles);
  return (
    <Route {...rest} render={props => (authenticated
      ? (<Component {...props} />)
      : (<Redirect to={{
        pathname: '/connexion',
        state: {
          from: props.location
        }
      }} />))} />
  );
};

export default AuthenticatedRoute;
