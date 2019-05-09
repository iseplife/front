// @flow

import React from 'react';

import { Link, Route, Switch, Redirect } from 'react-router-dom';

import { Tabs, Tab } from '@material-ui/core';

import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';

import Users from './users';
import Import from './import';
import Isepdor from './isepdor';

const routes = ['/utilisateur', '/importer', '/isep-dor'];

class Admin extends React.Component {
  state = {
    tabOpen: 0,
  };

  componentDidMount() {
    const routeIndex = this.getRoute();
    if (routeIndex !== -1) {
      this.setState({ tabOpen: routeIndex });
    }
  }

  getRoute() {
    const { match, location } = this.props;
    return routes.findIndex(r => location.pathname.includes(match.url + r));
  }

  handleChangeTab = (event: Event, index: number) => {
    this.setState({ tabOpen: index });
  };

  render() {
    const { match } = this.props;
    const { tabOpen } = this.state;
    return (
      <main>
        <Tabs
          value={tabOpen}
          indicatorColor="secondary"
          textColor="primary"
          centered
          onChange={this.handleChangeTab}
        >
          <Tab
            label="Utilisateurs"
            component={Link}
            to={`${match.url}/utilisateurs`}
          />
          <Tab label="Importer" component={Link} to={`${match.url}/importer`} />
          <Tab
            label="Isep d'or"
            component={Link}
            to={`${match.url}/isep-dor`}
          />
        </Tabs>
        <Switch>
          <Redirect
            path={`${match.url}`}
            exact
            to={`${match.url}/utilisateurs`}
          />
          <Route path={`${match.url}/utilisateurs`} component={Users} />
          <Route path={`${match.url}/importer`} component={Import} />
          <Route path={`${match.url}/isep-dor`} component={Isepdor} />
        </Switch>
      </main>
    );
  }
}

export default Admin;
