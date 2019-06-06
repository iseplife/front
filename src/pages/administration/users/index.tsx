import {
  Input,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import { MAIN_COLOR } from '../../../colors';
import { Paper, ProfileImage, Text, Title } from '../../../components/common';
import * as rolesKey from '../../../constants';
import * as userData from '../../../data/users/student';
import { getPromo } from '../../../data/users/student';
import { Student } from '../../../data/users/type';
import UpdateStudent from './UpdateStudent';

function getRoleName(role: string) {
  switch (role) {
    case rolesKey.ADMIN:
      return 'Super Admin';
    case rolesKey.CLUB_MANAGER:
      return 'Gestion associations';
    case rolesKey.EVENT_MANAGER:
      return 'Gestion évenements';
    case rolesKey.POST_MANAGER:
      return 'Gestion posts';
    case rolesKey.USER_MANAGER:
      return 'Gestion utilisateurs';
    case rolesKey.STUDENT:
      return 'Eleve';

    default:
      return role;
  }
}

type SelectRolesProps = {
  roles: string[];
  filterRoles: string[];
  handleSelectRoles: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
};
const SelectRoles: React.FC<SelectRolesProps> = props => {
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel htmlFor="roles">Roles</InputLabel>
      <Select
        fullWidth
        multiple
        value={props.filterRoles}
        onChange={props.handleSelectRoles}
        input={<Input fullWidth id="roles" />}
      >
        {props.roles.map(r => (
          <MenuItem
            key={r}
            value={r}
            style={{
              color: props.filterRoles.includes(r) ? MAIN_COLOR : 'black',
            }}
          >
            {getRoleName(r)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type SelectPromoProps = {
  filterPromo: number[];
  years: number[];
  onPromoFilter: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
};
const SelectPromo: React.FC<SelectPromoProps> = props => {
  return (
    <FormControl style={{ width: '100%' }}>
      <InputLabel htmlFor="year-multiple">Promotions</InputLabel>
      <Select
        multiple
        value={props.filterPromo}
        renderValue={years =>
          (years as number[]).map(year => getPromo(year) || year).join(', ')
        }
        onChange={props.onPromoFilter}
        input={<Input id="year-multiple" />}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {props.years.map(year => (
          <MenuItem
            key={year}
            value={year}
            style={{
              color: props.filterPromo.includes(year) ? MAIN_COLOR : 'black',
            }}
          >
            <span>
              {year} {getPromo(year, v => `(${v})`) || ''}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type UsersProps = {};
type UsersState = {
  users: Student[];
  page: number;
  total: number;
  selected: Student | null;

  filter: string;
  filterRoles: string[];
  filterPromo: number[];
};

class Users extends Component<UsersProps, UsersState> {
  state: UsersState = {
    users: [],
    page: 0,
    total: 0,
    selected: null,

    filter: '',
    filterRoles: [],
    filterPromo: [],
  };

  filterTimeout?: number;

  componentDidMount() {
    this.loadUsers(0);
  }

  loadUsers(page: number) {
    userData.getStudentsForAdmin(page).then(res => {
      this.setState({
        users: res.data.content,
        page,
        total: res.data.totalElements,
      });
    });
  }

  filterUsers = (
    filter: string,
    filterRoles: string[],
    filterPromo: number[],
    page: number
  ) => {
    if (filter !== '' || filterRoles.length > 0 || filterPromo.length > 0) {
      if (this.filterTimeout) clearTimeout(this.filterTimeout);
      this.filterTimeout = window.setTimeout(() => {
        userData
          .searchStudentsAdmin(filter, filterRoles, filterPromo, 'a', page)
          .then(res => {
            this.setState({
              users: res.data.content,
              total: res.data.totalElements,
              page,
            });
          });
      }, 300);
    } else {
      this.loadUsers(page);
    }

    this.setState({ filter, filterRoles, filterPromo });
  };

  handleChangePage = (event: any, page: number) => {
    this.filterUsers(
      this.state.filter,
      this.state.filterRoles,
      this.state.filterPromo,
      page
    );
  };

  changeFilter = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const filter = event.target.value as string;
    this.filterUsers(filter, this.state.filterRoles, this.state.filterPromo, 0);
  };

  selectRow = (selected: Student) => () => {
    this.setState({ selected });
  };

  onChangeField = (name: string, value: any) => {
    this.setState(state => {
      if (state.selected) {
        return {
          selected: {
            ...state.selected,
            [name]: value,
          },
        } as any;
      }
      return state;
    });
  };

  handleSelectRoles = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { options } = e.target as HTMLSelectElement;
    const filterRoles = Array.from(options)
      .filter(opt => opt.selected)
      .map(opt => opt.value);
    this.filterUsers(this.state.filter, filterRoles, this.state.filterPromo, 0);
  };

  onPromoFilter = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { options } = e.target as HTMLSelectElement;
    const filterPromo = Array.from(options)
      .filter(opt => opt.selected)
      .map(opt => parseInt(opt.value, 10));
    this.filterUsers(this.state.filter, this.state.filterRoles, filterPromo, 0);
  };

  getYears() {
    let now = new Date().getFullYear();
    if (new Date().getMonth() < 9) {
      now--;
    }
    let years = [];
    for (var i = 5; i > -15; i--) {
      years.push(now + i);
    }
    return years;
  }

  render() {
    const { users, page, total, filter, selected } = this.state;
    return (
      <div style={{ margin: 30 }}>
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 3]} p={1}>
            <div>
              <Title invert>Etudiant</Title>
              {!selected && <Text>Sélectionnez un étudiant</Text>}
              {selected && (
                <UpdateStudent
                  selected={selected}
                  onChangeField={this.onChangeField}
                  refreshTable={() => this.loadUsers(this.state.page)}
                  selectRow={selected => this.setState({ selected })}
                />
              )}
            </div>
          </Box>
          <Box width={[1, 2 / 3]} p={1} pl={2}>
            <Paper p="1em">
              <Flex>
                <Box p={1} width={1 / 2}>
                  <TextField
                    label="Filtrer par nom et prénom"
                    fullWidth
                    type="text"
                    value={filter}
                    onChange={this.changeFilter}
                  />
                </Box>
                <Box p={1} width={1 / 4}>
                  <SelectPromo
                    filterPromo={this.state.filterPromo}
                    onPromoFilter={this.onPromoFilter}
                    years={this.getYears()}
                  />
                </Box>
                <Box p={1} width={1 / 4}>
                  <SelectRoles
                    filterRoles={this.state.filterRoles}
                    handleSelectRoles={this.handleSelectRoles}
                    roles={[
                      rolesKey.ADMIN,
                      rolesKey.CLUB_MANAGER,
                      rolesKey.USER_MANAGER,
                      rolesKey.EVENT_MANAGER,
                      rolesKey.POST_MANAGER,
                      rolesKey.STUDENT,
                    ]}
                  />
                </Box>
              </Flex>
            </Paper>
            <br />
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[20]}
                      count={total}
                      rowsPerPage={20}
                      page={page}
                      onChangePage={this.handleChangePage}
                    />
                  </TableRow>
                  <TableRow>
                    <TableCell>Photo</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Promotion</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => {
                    return (
                      <TableRow
                        key={u.id}
                        hover
                        style={{
                          opacity: u.archived ? 0.2 : 1,
                          cursor: 'pointer',
                          backgroundColor:
                            (selected && u.id === selected.id && '#e2e7ff') ||
                            '',
                        }}
                        selected={(selected && u.id === selected.id) || false}
                        onClick={this.selectRow(u)}
                      >
                        <TableCell>
                          <ProfileImage alt="" src={u.photoUrlThumb} w="50px" />
                        </TableCell>
                        <TableCell>
                          {u.firstname} {u.lastname}
                        </TableCell>
                        <TableCell>{u.promo}</TableCell>
                        <TableCell>
                          {u.rolesValues.map(v => getRoleName(v)).join(', ')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[20]}
                      count={total}
                      rowsPerPage={20}
                      page={page}
                      onChangePage={this.handleChangePage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Paper>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default Users;
