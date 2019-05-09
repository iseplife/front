// @flow

import React from 'react';
import { Flex, Box } from 'grid-styled';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ArchiveIcon from '@material-ui/icons/Archive';
import Save from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core';

import { MenuItem } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { Input, InputLabel } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

import DatePicker from '../../../components/DatePicker';
import { Title, Text, ProfileImage } from '../../../components/common';
import Popup from '../../../components/Popup';

import { Link } from 'react-router-dom';

import * as userData from '../../../data/users/student';
import * as authData from '../../../data/auth';
import * as rolesKey from '../../../constants';

import { MAIN_COLOR } from '../../../colors';

import { sendAlert } from '../../../components/Alert';
import type {
  Role as RoleType,
  Student as StudentType,
} from '../../../data/users/type';

type UpdateProps = {
  selected: StudentType,
  refreshTable: () => mixed,
  selectRow: (student: ?StudentType) => mixed,
  onChangeField: (name: string, value: string) => mixed,
};

type UpdateState = {
  roles: RoleType[],
  userRoles: number[],
  file: ?File,
  imagePreview: ?string,
  openArchivePopup: boolean,
};

export default class UpdateStudent extends React.Component<
  UpdateProps,
  UpdateState
> {
  state = {
    roles: [],
    userRoles: [],
    file: null,
    imagePreview: null,
    openArchivePopup: false,
  };

  componentDidMount() {
    this.loadAllRoles();
    this.loadStudentRoles(this.props.selected.id);
  }

  componentWillReceiveProps(props: UpdateProps) {
    if (props.selected && props.selected.id !== this.props.selected.id) {
      this.loadStudentRoles(props.selected.id);
    }
  }

  onChangeField = (name: string) => (e: SyntheticEvent<HTMLInputElement>) => {
    this.props.onChangeField(name, e.currentTarget.value);
  };

  handleSelectRoles = (e: any) => {
    this.setState({ userRoles: e.target.value });
  };

  loadAllRoles() {
    authData.getAllRoles().then(res => {
      this.setState({ roles: res.data });
    });
  }

  loadStudentRoles(id: number) {
    userData.getStudentRoles(id).then(res => {
      this.setState({ userRoles: res.data.map(r => r.id) });
    });
  }

  getRoleName(role: string) {
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

  updateUser = () => {
    const data = {
      ...this.props.selected,
      roles: this.state.userRoles,
      file: this.state.file,
    };

    userData.updateStudentFull(data).then(res => {
      this.props.refreshTable();
      this.props.selectRow(res.data);
      sendAlert('Etudiant mis à jour');
    });
  };

  changeFile = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreview: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  archiveAccepted = (ok: boolean) => {
    if (ok) {
      userData.toggleArchiveStudent(this.props.selected.id).then(res => {
        this.props.refreshTable();
        this.props.selectRow(null);
        sendAlert('Etudiant Archivé');
      });
    }
    this.setState({ openArchivePopup: false });
  };

  render() {
    const { selected } = this.props;
    const {
      roles,
      userRoles,
      imagePreview,
      file,
      openArchivePopup,
    } = this.state;
    return (
      <div>
        <Link to={`/annuaire/${selected.id}`}>
          <Title fontSize={1.1}>
            {selected.firstname} {selected.lastname}
          </Title>
        </Link>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Text>Infos</Text>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              {selected.archived && (
                <Flex align="center">
                  <Box p={1}>
                    <Text fs="13px">Cet étudiant est archivé </Text>
                  </Box>
                  <Box ml="auto">
                    <Button
                      size="small"
                      style={{ fontSize: 12 }}
                      onClick={() => this.archiveAccepted(true)}
                    >
                      Annuler
                    </Button>
                  </Box>
                </Flex>
              )}
              <TextField
                margin="normal"
                label="Prénom"
                value={selected.firstname || ''}
                fullWidth
                onChange={this.onChangeField('firstname')}
              />
              <TextField
                margin="normal"
                label="Nom"
                value={selected.lastname || ''}
                fullWidth
                onChange={this.onChangeField('lastname')}
              />
              <Flex align="center">
                <Box mr={1}>
                  {imagePreview && (
                    <img
                      alt="student"
                      src={imagePreview}
                      style={{ width: 100 }}
                    />
                  )}
                  {!imagePreview && (
                    <ProfileImage src={selected.photoUrlThumb} sz="100px" />
                  )}
                </Box>
                <Box>
                  <input
                    onChange={e => this.changeFile(e.target.files[0])}
                    accept=".jpg,.jpeg,.JPG,.JPEG"
                    id="image"
                    type="file"
                    style={{ display: 'none' }}
                  />

                  {!file && (
                    <label htmlFor="image">
                      <Button variant="raised" component="span">
                        Modifier
                      </Button>
                    </label>
                  )}
                  {file && (
                    <Button
                      variant="raised"
                      onClick={() =>
                        this.setState({ file: null, imagePreview: null })
                      }
                    >
                      Supprimer
                    </Button>
                  )}
                </Box>
              </Flex>
              <TextField
                type="number"
                margin="normal"
                label="Promotion"
                value={selected.promo || ''}
                fullWidth
                onChange={this.onChangeField('promo')}
              />
              <TextField
                margin="normal"
                label="Numéro ISEP"
                value={selected.studentId || ''}
                disabled
                fullWidth
              />
              <TextField
                margin="normal"
                label="Email"
                value={selected.mail || ''}
                fullWidth
                onChange={this.onChangeField('mail')}
              />
              <TextField
                margin="normal"
                label="Email ISEP"
                value={selected.mailISEP || ''}
                fullWidth
                onChange={this.onChangeField('mailISEP')}
              />
              <TextField
                margin="normal"
                label="Téléphone"
                value={selected.phone || ''}
                fullWidth
                onChange={this.onChangeField('phone')}
              />
              <TextField
                margin="normal"
                label="Adresse"
                value={selected.address || ''}
                fullWidth
                onChange={this.onChangeField('address')}
              />
              <div>
                <Text>Date de naissance</Text>
                <DatePicker
                  dateonly
                  startYear={new Date().getFullYear() - 30}
                  date={
                    selected.birthDate
                      ? new Date(selected.birthDate)
                      : new Date()
                  }
                  onChange={date => this.props.onChangeField('birthDate', date)}
                />
              </div>
              <TextField
                multiline
                rows="4"
                margin="normal"
                label="Bio"
                value={selected.bio || ''}
                fullWidth
                onChange={this.onChangeField('bio')}
              />
              <TextField
                margin="normal"
                label="Lien Facebook"
                value={selected.facebook || ''}
                fullWidth
                onChange={this.onChangeField('facebook')}
              />
              <TextField
                margin="normal"
                label="Lien Twitter"
                value={selected.twitter || ''}
                fullWidth
                onChange={this.onChangeField('twitter')}
              />
              <TextField
                margin="normal"
                label="Lien Instagram"
                value={selected.instagram || ''}
                fullWidth
                onChange={this.onChangeField('instagram')}
              />
              <TextField
                margin="normal"
                label="Lien Snapchat"
                value={selected.snapchat || ''}
                fullWidth
                onChange={this.onChangeField('snapchat')}
              />
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Text>Roles</Text>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormControl style={{ width: '100%' }}>
              <InputLabel htmlFor="roles">Roles</InputLabel>
              <Select
                fullWidth
                multiple
                value={userRoles}
                onChange={this.handleSelectRoles}
                input={<Input fullWidth id="roles" />}
              >
                {roles.map(r => (
                  <MenuItem
                    key={r.id}
                    value={r.id}
                    style={{
                      background:
                        this.state.userRoles.indexOf(r.id) !== -1
                          ? MAIN_COLOR
                          : 'inherit',
                      color:
                        this.state.userRoles.indexOf(r.id) !== -1
                          ? 'white'
                          : 'black',
                    }}
                  >
                    {this.getRoleName(r.role)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <div style={{ margin: 10 }}>
          <Button
            variant="fab"
            color="primary"
            style={{ margin: 5 }}
            onClick={this.updateUser}
          >
            <Save />
          </Button>
          {!selected.archived && (
            <Button
              variant="fab"
              color="secondary"
              style={{ margin: 5 }}
              onClick={() =>
                this.setState({
                  openArchivePopup: true,
                })
              }
            >
              <ArchiveIcon />
            </Button>
          )}
        </div>
        <Popup
          title="Archivage"
          description="Voulez vous archiver cet étudiant ?"
          open={openArchivePopup}
          onRespond={this.archiveAccepted}
        />
      </div>
    );
  }
}
