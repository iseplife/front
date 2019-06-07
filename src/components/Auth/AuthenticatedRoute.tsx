import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { hasRole } from '../../data/auth';

interface AuthenticatedRouteProps extends RouteProps {
  roles: string[];
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const authenticated = hasRole(roles);
  return (
    <Route
      {...rest}
      render={props =>
        authenticated && Component ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/connexion',
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
