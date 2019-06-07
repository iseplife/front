import { Tab, Tabs } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { LinkAdapter } from 'components/utils';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Banner, Filler, Header } from '../../components/common';
import HallOfFame from './hallOfFame';
import Target from './target';
import Team from './team';

type WhoareweProps = RouteComponentProps;

class Whoarewe extends Component<WhoareweProps> {
  state = {
    tabOpen: 0,
  };

  componentDidMount() {
    const base = this.props.match.url;
    const urlToTab = {
      [base + '/target']: 0,
      [base + '/team']: 1,
      [base + '/hall-of-fame']: 2,
    };
    if (urlToTab[this.props.location.pathname]) {
      this.setState({ tabOpen: urlToTab[this.props.location.pathname] });
    }
  }

  handleChangeTab = (event: React.ChangeEvent<{}>, index: any) => {
    this.setState({ tabOpen: index as number });
  };

  render() {
    const { match } = this.props;
    const { tabOpen } = this.state;
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Qui sommes-nous ?</h1>
            <p>Nos objectifs, Notre équipe, Notre histoire, Hall of Fame...</p>
          </Banner>
        </Header>
        <Paper>
          <Tabs
            value={tabOpen}
            onChange={this.handleChangeTab}
            indicatorColor="secondary"
            textColor="primary"
            centered
          >
            <Tab
              label="Nos objectifs"
              to={`${match.url}/target`}
              component={LinkAdapter}
            />
            <Tab
              label="Notre équipe"
              to={`${match.url}/team`}
              component={LinkAdapter}
            />
            <Tab
              label="Hall of Fame"
              to={`${match.url}/hall-of-fame`}
              component={LinkAdapter}
            />
          </Tabs>
          <Switch>
            <Redirect path={`${match.url}`} exact to={`${match.url}/target`} />
            <Route path={`${match.url}/target`} component={Target} />
            <Route path={`${match.url}/team`} component={Team} />
            <Route path={`${match.url}/hall-of-fame`} component={HallOfFame} />
          </Switch>
        </Paper>
      </div>
    );
  }
}

export default Whoarewe;
