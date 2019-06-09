import React, { Component } from 'react';
import * as clubData from '../../data/club';
import * as userTypes from '../../data/users/type';
import ClubView from './view';

type ClubState = {
  clubs: userTypes.Club[];
  loading: boolean;
};

class Club extends Component<{}, ClubState> {
  state: ClubState = {
    clubs: [],
    loading: false,
  };

  componentDidMount() {
    this.getClubs();
  }

  getClubs = () => {
    this.setState({ loading: true });
    clubData.getClubs().then(res => {
      this.setState({ clubs: res.data, loading: false });
    });
  };

  addClub = (form: React.FormEvent) => {
    return clubData.createClub(form as any).then(res => {
      this.getClubs();
      return res;
    });
  };

  render() {
    return (
      <ClubView
        loading={this.state.loading}
        clubs={this.state.clubs}
        addClub={this.addClub}
      />
    );
  }
}

export default Club;
