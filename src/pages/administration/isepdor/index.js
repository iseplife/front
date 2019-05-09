// @flow

import React from 'react';

import { Tabs, Tab } from '@material-ui/core';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import { FluidContent, Title, Paper } from '../../../components/common';

import { routes } from './isepdor.routes';

import Session from './Session';
import Question from './Question';
import Events from './Events';
import Employee from './Employee';
import Diploma from './Diploma';

type State = {
  activeTab: number,
};

export default class ImportStudents extends React.Component<{}, State> {
  state = {
    activeTab: 0,
  };

  componentDidMount() {
    const routeIndex = this.findRouteIndex(this.props.location.pathname);
    if (routeIndex !== -1) {
      this.setState({
        activeTab: routeIndex,
      });
    }
  }

  findRouteIndex(path: string): number {
    const { match, location } = this.props;
    return routes.findIndex(e => match.url + e.path === location.pathname);
  }

  handleChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  render() {
    const { activeTab } = this.state;
    const { match } = this.props;
    return (
      <div style={{ margin: 30 }}>
        <Title invert>ISEP d'Or</Title>
        <div style={{ minHeight: 500 }}>
          <Tabs
            textColor="primary"
            value={activeTab}
            onChange={this.handleChange}
          >
            {routes.map(r => (
              <Tab
                key={r.path}
                label={r.tabName}
                component={Link}
                to={match.url + r.path}
              />
            ))}
          </Tabs>
          <Switch>
            <Redirect exact path={`${match.url}`} to={`${match.url}/session`} />
            {routes.map(r => (
              <Route
                key={r.path}
                path={match.url + r.path}
                component={r.comp}
              />
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}
