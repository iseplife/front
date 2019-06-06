import { Tab, Tabs } from '@material-ui/core';
import { LinkAdapter } from 'components/utils';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Title } from '../../../components/common';
import { routes } from './isepdor.routes';

type ImportStudentsProps = RouteComponentProps;
type ImportStudentsState = {
  activeTab: number;
};

export default class ImportStudents extends React.Component<
  ImportStudentsProps,
  ImportStudentsState
> {
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
                to={match.url + r.path}
                component={LinkAdapter}
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
