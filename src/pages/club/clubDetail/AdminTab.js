// @flow

import React from 'react';

import { Box, Flex } from 'grid-styled';

import { Title, Text, Paper } from 'components/common';

import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Delete from '@material-ui/icons/Delete';
import Done from '@material-ui/icons/Done';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import DeleteIcon from '@material-ui/icons/Delete';

import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import { MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { Input, InputLabel } from '@material-ui/core';

import Autocomplete from '../../../components/Autocomplete';
import Popup from 'components/Popup';

import * as clubData from '../../../data/club';
import * as authData from '../../../data/auth';
import * as userData from '../../../data/users/student';
import { backUrl } from '../../../config';
import { ADMIN, CLUB_MANAGER } from '../../../constants';

const defaultRoles = [
  { id: 1, name: 'Président' },
  { id: 2, name: 'Trésorier' },
  { id: 3, name: 'Membre' },
];

class RightsPanel extends React.Component {
  state = {
    roles: [],
  };

  componentDidMount() {
    clubData.getClubRoles(this.props.clubid).then(res => {
      this.setState({ roles: res.data });
    });
  }

  render() {
    const {
      selection,
      handleSelectRole,
      isMemberAdmin,
      setAdmin,
      userid,
      getRole,
      deleteMember,
    } = this.props;
    const roles = [...defaultRoles, ...this.state.roles];
    return (
      <div>
        <Title invert>Droits</Title>
        {!selection && <Text>Sélectionnez un membre</Text>}
        {selection && (
          <div>
            <Text>
              {selection.member.firstname} {selection.member.lastname}
            </Text>

            <Box mt={3}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Select
                  fullWidth
                  value={getRole(selection)}
                  onChange={handleSelectRole}
                  input={<Input fullWidth id="role" />}
                >
                  {roles.map(ro => {
                    return (
                      <MenuItem key={ro.id} value={ro.id}>
                        {ro.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={
                    selection.member.id === userid &&
                    !authData.hasRole([ADMIN, CLUB_MANAGER])
                  }
                  checked={isMemberAdmin(selection.member.id)}
                  onChange={setAdmin}
                />
              }
              label="Admin"
            />

            <div>
              <IconButton onClick={deleteMember}>
                <Delete />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class AddUserPanel extends React.Component {
  state = {
    selected: false,
    selectedUser: 0,
    selectValue: '',
  };

  selectUser = (user, fullName) => {
    this.setState({
      selectedUser: user.id,
      selectValue: fullName,
      selected: true,
    });
  };

  searchUser = search => {
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

  renderSuggestion = e => {
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
        <Autocomplete
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

export class AddRolePanel extends React.Component {
  state = {
    name: '',
    roles: [],
    openDeletePopup: false,
    roleToDelete: null,
  };

  componentDidMount() {
    this.loadClubRoles();
  }

  loadClubRoles() {
    clubData.getClubRoles(this.props.clubid).then(res => {
      this.setState({ roles: res.data });
    });
  }

  disabled() {
    const { name } = this.state;
    return name === '';
  }

  onRoleChange = event => {
    this.setState({ name: event.target.value });
  };

  addRole = () => {
    clubData.addRoleName(this.props.clubid, this.state.name).then(res => {
      this.loadClubRoles();
      this.setState({ name: '' });
    });
  };

  deleteAccepted = ok => {
    if (ok) {
      const { roleToDelete } = this.state;
      clubData.deleteClubRole(this.props.clubid, roleToDelete.id).then(res => {
        this.loadClubRoles();
      });
    }
    this.setState({ openDeletePopup: false });
  };

  render() {
    const { name } = this.state;
    return (
      <div>
        <Title invert>Rôles</Title>
        {this.state.roles.map(r => {
          return (
            <Flex align="center" key={r.id}>
              <Box>
                <Text>{r.name}</Text>
              </Box>
              <Box ml="auto">
                <Button
                  mini
                  variant="fab"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      roleToDelete: r,
                      openDeletePopup: true,
                    })
                  }
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Flex>
          );
        })}
        <TextField
          margin="normal"
          fullWidth
          value={name}
          label="Nom du rôle"
          onChange={this.onRoleChange}
        />
        <Box mt="1">
          <Button
            color="secondary"
            disabled={this.disabled()}
            onClick={this.addRole}
          >
            Ajouter
          </Button>
        </Box>
        <Popup
          title="Suppression"
          description="ATTENTION! Supprimer ce rôle entrainera la suppression de tout les membres portant ce rôle dans l'association."
          open={this.state.openDeletePopup}
          onRespond={this.deleteAccepted}
        />
      </div>
    );
  }
}

export default class MembersTab extends React.Component {
  state = {
    members: [],
    admins: [],
    selection: null,
    mode: '',
    openDeletePopup: false,
  };

  componentDidMount() {
    this.userid = authData.getUser().id;
    this.loadMembers();
  }

  loadMembers() {
    clubData.getMembers(this.props.clubid).then(res => {
      this.setState({ members: res.data });
    });
    clubData.getAdmins(this.props.clubid).then(res => {
      this.setState({ admins: res.data });
    });
  }

  selectMember = member => e => {
    this.setState({ selection: member, mode: '' });
  };

  isMemberAdmin = (memberid: number) => {
    return this.state.admins.filter(m => m.id === memberid).length > 0;
  };

  getRole = selection => {
    const member = this.state.members.filter(m => m.id === selection.id);
    if (member.length === 1) {
      return member[0].role.id;
    }
    return null;
  };

  handleSelectRole = event => {
    clubData
      .updateMemberRole(this.state.selection.id, event.target.value)
      .then(res => {
        this.loadMembers();
      });
  };

  setAdmin = () => {
    const { selection } = this.state;
    if (selection) {
      if (this.isMemberAdmin(selection.member.id)) {
        clubData
          .removeAdmin(this.props.clubid, selection.member.id)
          .then(res => {
            this.loadMembers();
          });
      } else {
        clubData.addAdmin(this.props.clubid, selection.member.id).then(res => {
          this.loadMembers();
        });
      }
    }
  };

  addMember = selectedUser => {
    clubData.addMember(this.props.clubid, selectedUser).then(res => {
      this.loadMembers();
      this.setState({ mode: 'addUser' });
    });
  };

  deleteMember = () => {
    this.setState({ openDeletePopup: true });
  };

  deleteAccepted = ok => {
    if (ok) {
      clubData.deleteMember(this.state.selection.id).then(res => {
        this.loadMembers();
        this.setState({ selection: null });
      });
    }
    this.setState({ openDeletePopup: false });
  };

  render() {
    const { members, selection, mode, openDeletePopup } = this.state;
    return (
      <div>
        <Button
          color="secondary"
          onClick={() =>
            this.setState({
              mode: 'addUser',
              selection: null,
            })
          }
        >
          Ajouter membre
        </Button>
        <Button
          color="secondary"
          onClick={() =>
            this.setState({
              mode: 'addRole',
              selection: null,
            })
          }
        >
          Rôles
        </Button>
        <Flex flexWrap="wrap" style={{ minHeight: 400 }}>
          <Box w={[1, 1 / 3]} p={2}>
            <Paper p="2em">
              {mode === '' && (
                <RightsPanel
                  selection={selection}
                  isMemberAdmin={this.isMemberAdmin}
                  setAdmin={this.setAdmin}
                  handleSelectRole={this.handleSelectRole}
                  userid={this.userid}
                  getRole={this.getRole}
                  clubid={this.props.clubid}
                  deleteMember={this.deleteMember}
                />
              )}
              {mode === 'addUser' && (
                <AddUserPanel members={members} addMember={this.addMember} />
              )}
              {mode === 'addRole' && (
                <AddRolePanel clubid={this.props.clubid} />
              )}
            </Paper>
          </Box>
          <Box w={[1, 2 / 3]} p={2}>
            <Paper p="1em">
              <List>
                {members.map(user => (
                  <ListItem
                    key={user.id}
                    size="small"
                    button
                    onClick={this.selectMember(user)}
                  >
                    <Avatar
                      alt="photo"
                      src={
                        user.member.photoUrlThumb
                          ? backUrl + user.member.photoUrlThumb
                          : '/img/svg/user.svg'
                      }
                    />
                    <ListItemText
                      primary={`${user.member.firstname} ${
                        user.member.lastname
                      }`}
                    />
                    {this.isMemberAdmin(user.member.id) && (
                      <VerifiedUser
                        style={{ color: '#999', marginRight: 10 }}
                      />
                    )}
                    {selection &&
                      selection.id === user.id && (
                        <ListItemIcon>
                          <Done style={{ display: 'inline' }} />
                        </ListItemIcon>
                      )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Flex>
        <Popup
          title="Suppression"
          description="Voulez vous supprimer ce Membre ?"
          open={openDeletePopup}
          onRespond={this.deleteAccepted}
        />
      </div>
    );
  }
}
