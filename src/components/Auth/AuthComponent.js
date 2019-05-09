// @flow

import * as React from 'react';

import { hasRole, isLoggedIn } from 'data/auth';

class Auth extends React.Component {
  render() {
    const { children, roles, not, logged } = this.props;

    if (children) {
      if (isLoggedIn() && logged)
        return <React.Fragment>{children}</React.Fragment>;

      if (not && !isLoggedIn())
        return <React.Fragment>{children}</React.Fragment>;

      if (!roles && !not && isLoggedIn())
        return <React.Fragment>{children}</React.Fragment>;

      if (roles && isLoggedIn() && hasRole(roles))
        return <React.Fragment>{children}</React.Fragment>;
    }

    return null;
  }
}

export default Auth;
