import React from 'react';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';

export const NavLinkAdapter = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => <NavLink innerRef={ref as any} {...props} />
);

export const LinkAdapter = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link innerRef={ref as any} {...props} />
);
