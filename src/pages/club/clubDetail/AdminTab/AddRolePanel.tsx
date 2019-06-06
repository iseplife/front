import { Button, Fab, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Text, Title } from '../../../../components/common';
import Popup from '../../../../components/Popup';
import * as clubData from '../../../../data/club';
import { ClubRole } from '../../../../data/club/type';

type AddRolePanelProps = {
  clubid?: number;
};
type AddRolePanelState = {
  name: string;
  roles: ClubRole[];
  openDeletePopup: boolean;
  roleToDelete: ClubRole | null;
};

export class AddRolePanel extends React.Component<
  AddRolePanelProps,
  AddRolePanelState
> {
  state: AddRolePanelState = {
    name: '',
    roles: [],
    openDeletePopup: false,
    roleToDelete: null,
  };

  componentDidMount() {
    this.loadClubRoles();
  }

  loadClubRoles() {
    if (this.props.clubid) {
      clubData.getClubRoles(this.props.clubid).then(res => {
        this.setState({ roles: res.data });
      });
    }
  }

  disabled() {
    const { name } = this.state;
    return name === '';
  }

  onRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  addRole = () => {
    if (this.props.clubid) {
      clubData.addRoleName(this.props.clubid, this.state.name).then(() => {
        this.loadClubRoles();
        this.setState({ name: '' });
      });
    }
  };

  deleteAccepted = (ok: boolean) => {
    const { roleToDelete } = this.state;
    if (ok && this.props.clubid && roleToDelete) {
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
            <Flex alignItems="center" key={r.id}>
              <Box>
                <Text>{r.name}</Text>
              </Box>
              <Box ml="auto">
                <Fab
                  size="small"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      roleToDelete: r,
                      openDeletePopup: true,
                    })
                  }
                >
                  <DeleteIcon />
                </Fab>
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
