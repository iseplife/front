import * as React from 'react';
import { hasRole, isLoggedIn } from '../../data/auth';

type AuthProps = {
  roles?: string[];
  not?: boolean;
  logged?: boolean;
};

class Auth extends React.Component<AuthProps> {
  render() {
    const { children, roles = [], not, logged } = this.props;

    if (!children) {
      return null;
    }

    if (isLoggedIn() && not) {
      return null;
    }

    if (!isLoggedIn() && !not) {
      return null;
    }

    if (roles.length > 0 && !hasRole(roles)) {
      return null;
    }

    // if (children) {
    //   if (isLoggedIn() && logged)
    //     return <React.Fragment>{children}</React.Fragment>;

    //   if (not && !isLoggedIn())
    //     return <React.Fragment>{children}</React.Fragment>;

    //   if (!not && isLoggedIn())
    //     return <React.Fragment>{children}</React.Fragment>;

    //   if (isLoggedIn() && hasRole(roles))
    //     return <React.Fragment>{children}</React.Fragment>;
    // }

    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default Auth;
