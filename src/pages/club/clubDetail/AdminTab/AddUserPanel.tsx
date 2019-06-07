import { Avatar, Button } from '@material-ui/core';
import { Box } from '@rebass/grid';
import React from 'react';
import Autocomplete from '../../../../components/Autocomplete';
import { Title } from '../../../../components/common';
import { backUrl } from '../../../../config';
import { ClubMember } from '../../../../data/club/type';
import * as userData from '../../../../data/users/student';

type AddUserPanelProps = {
  members: ClubMember[];
  addMember: (id: number) => void;
};
type AddUserPanelState = {
  selected: boolean;
  selectedUser: number;
  selectValue: string;
};

export class AddUserPanel extends React.Component<
  AddUserPanelProps,
  AddUserPanelState
> {
  state: AddUserPanelState = {
    selected: false,
    selectedUser: 0,
    selectValue: '',
  };

  selectUser = (user: ClubMember) => {
    this.setState({
      selectedUser: user.id,
      selectValue: `${user.member.firstname} ${user.member.lastname}`,
      selected: true,
    });
  };

  searchUser = (search: string) => {
    this.setState({ selectValue: search });
    if (search.length === 0) {
      this.setState({ selected: false });
      return Promise.resolve([]);
    }
    return userData.searchStudents(search, [], 'a', 0).then(res => {
      return res.data.content.filter(
        user =>
          this.props.members.filter(m => m.member.id === user.id).length === 0
      );
    });
  };

  addUser = () => {
    this.setState({ selectValue: '', selected: false });
    this.props.addMember(this.state.selectedUser);
  };

  renderSuggestion = (e: any) => {
    const name = `${e.firstname} ${e.lastname}`;
    const url = e.photoUrlThumb
      ? backUrl + e.photoUrlThumb
      : '/img/svg/user.svg';
    return (
      <div style={{ display: 'inherit', alignItems: 'inherit' }}>
        <Avatar alt={name} src={url} style={{ marginRight: 10 }} />
        <span>{name}</span>
      </div>
    );
  };

  render() {
    return (
      <div>
        <Title invert>Ajouter membre</Title>
        <Autocomplete<ClubMember>
          label="Etudiant"
          value={this.state.selectValue}
          onSelect={this.selectUser}
          search={this.searchUser}
          renderSuggestion={this.renderSuggestion}
        />
        <Box mt={1}>
          <Button
            color="secondary"
            onClick={this.addUser}
            disabled={!this.state.selected}
          >
            Ajouter
          </Button>
        </Box>
      </div>
    );
  }
}
