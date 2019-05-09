// @flow

import React, { Component } from 'react';

import { Banner, Filler, FluidContent, Header } from 'components/common';

class UserAgreement extends Component {
  render() {
    return (
      <div>
        <Header url="/img/background.jpg">
          <Filler h={50} />
          <Banner>
            <h1>Convention d'utilisation</h1>
            <p>On vous dévoile tout !</p>
          </Banner>
        </Header>
        <FluidContent>
          <Filler h={200} />
        </FluidContent>
      </div>
    );
  }
}

export default UserAgreement;
