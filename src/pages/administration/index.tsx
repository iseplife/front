import { Tab, Tabs } from '@material-ui/core';
import { LinkAdapter } from 'components/utils';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import Import from './import';
import Isepdor from './isepdor';
import Users from './users';

const routes = ['/utilisateur', '/importer', '/isep-dor'];

type AdminProps = RouteComponentProps;
type AdminState = {
  tabOpen: number;
};

class Admin extends React.Component<AdminProps, AdminState> {
  state: AdminState = {
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

  handleChangeTab = (event: any, index: any) => {
    this.setState({ tabOpen: index as number });
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
            to={`${match.url}/utilisateurs`}
            component={LinkAdapter}
          />
          <Tab
            label="Importer"
            to={`${match.url}/importer`}
            component={LinkAdapter}
          />
          <Tab
            label="Isep d'or"
            to={`${match.url}/isep-dor`}
            component={LinkAdapter}
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
