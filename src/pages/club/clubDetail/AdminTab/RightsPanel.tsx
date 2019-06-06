import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box } from '@rebass/grid';
import React from 'react';
import { Text, Title } from '../../../../components/common';
import { ADMIN, CLUB_MANAGER } from '../../../../constants';
import * as authData from '../../../../data/auth';
import * as clubData from '../../../../data/club';
import { ClubMember, ClubRole } from '../../../../data/club/type';

const defaultRoles = [
  { id: 1, name: 'Président' },
  { id: 2, name: 'Trésorier' },
  { id: 3, name: 'Membre' },
];

type RightsPanelProps = {
  clubid: number;
  userid?: number;
  selection: ClubMember | null;
  handleSelectRole: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => Promise<void>;
  getRole: (role: ClubMember) => number | null;
  isMemberAdmin: (memberId: number) => boolean;
  setAdmin: () => void;
  deleteMember: () => void;
};
type RightsPanelState = {
  roles: ClubRole[];
};

export class RightsPanel extends React.Component<
  RightsPanelProps,
  RightsPanelState
> {
  state: RightsPanelState = {
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
                  value={getRole(selection) || ''}
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
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}
