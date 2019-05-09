// @flow

import React, { Component } from 'react';

import { Banner, Filler, Header } from 'components/common';
import { Link, Route, Switch, Redirect } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import { Tabs, Tab } from '@material-ui/core';

import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';

import Team from './team';
import HallOfFame from './hallOfFame';
import Target from './target';

class Whoarewe extends Component {
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

  handleChangeTab = (event: Event, index: number) => {
    this.setState({ tabOpen: index });
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
              component={Link}
              to={`${match.url}/target`}
            />
            <Tab
              label="Notre équipe"
              component={Link}
              to={`${match.url}/team`}
            />
            <Tab
              label="Hall of Fame"
              component={Link}
              to={`${match.url}/hall-of-fame`}
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
