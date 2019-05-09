// @flow

import React, { Component } from 'react';

import { FluidContent, ScrollToTopOnMount } from 'components/common';

class Team extends Component {
  render() {
    return (
      <div>
        <ScrollToTopOnMount />
        <FluidContent style={{textAlign: 'center'}}>
          <h1 style={{color: '#ffc000'}}>Notre équipe</h1>
          <img src="/img/team.jpg" alt="Team" width="100%" />
        </FluidContent>
      </div>
    );
  }
}

export default Team;
