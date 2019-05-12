import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Done from '@material-ui/icons/Done';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Paper } from '../../../../components/common';
import Popup from '../../../../components/Popup';
import { backUrl } from '../../../../config';
import * as authData from '../../../../data/auth';
import * as clubData from '../../../../data/club';
import { ClubMember } from '../../../../data/club/type';
import { Student } from '../../../../data/users/type';
import { AddRolePanel } from './AddRolePanel';
import { AddUserPanel } from './AddUserPanel';
import { RightsPanel } from './RightsPanel';

type MembersTabProps = {
  clubid: number;
};
type MembersTabState = {
  members: ClubMember[];
  admins: Student[];
  selection: ClubMember | null;
  mode: 'default' | 'addUser' | 'addRole';
  openDeletePopup: boolean;
};

export default class MembersTab extends React.Component<
  MembersTabProps,
  MembersTabState
> {
  state: MembersTabState = {
    members: [],
    admins: [],
    selection: null,
    mode: 'default',
    openDeletePopup: false,
  };

  userid?: number;

  componentDidMount() {
    const user = authData.getUser();
    if (user) {
      this.userid = user.id;
    }
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

  selectMember = (member: ClubMember) => () => {
    this.setState({ selection: member, mode: 'default' });
  };

  isMemberAdmin = (memberid: number) => {
    return this.state.admins.filter(m => m.id === memberid).length > 0;
  };

  getRole = (selection: ClubMember) => {
    const member = this.state.members.filter(m => m.id === selection.id);
    if (member.length === 1) {
      return member[0].role.id;
    }
    return null;
  };

  handleSelectRole = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (this.state.selection) {
      await clubData.updateMemberRole(
        this.state.selection.id,
        parseInt(event.target.value, 10)
      );
      this.loadMembers();
    }
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

  addMember = async (selectedUser: number) => {
    await clubData.addMember(this.props.clubid, selectedUser);
    this.loadMembers();
    this.setState({ mode: 'addUser' });
  };

  deleteMember = () => {
    this.setState({ openDeletePopup: true });
  };

  deleteAccepted = async (ok: boolean) => {
    if (ok && this.state.selection) {
      await clubData.deleteMember(this.state.selection.id);
      this.loadMembers();
      this.setState({ selection: null });
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
          <Box width={[1, 1 / 3]} p={2}>
            <Paper p="2em">
              {mode === 'default' && (
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
          <Box width={[1, 2 / 3]} p={2}>
            <Paper p="1em">
              <List>
                {members.map(user => (
                  <ListItem
                    key={user.id}
                    dense
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
                    {selection && selection.id === user.id && (
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
