import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Input,
  InputLabel,
  MenuItem,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import ArchiveIcon from '@material-ui/icons/Archive';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Save from '@material-ui/icons/Save';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import { MAIN_COLOR } from '../../../colors';
import { sendAlert } from '../../../components/Alert';
import { ProfileImage, Text, Title } from '../../../components/common';
import DatePicker from '../../../components/DatePicker';
import Popup from '../../../components/Popup';
import * as rolesKey from '../../../constants';
import * as authData from '../../../data/auth';
import * as userData from '../../../data/users/student';
import * as userType from '../../../data/users/type';

type UpdateStudentProps = {
  selected: userType.Student;
  refreshTable: () => void;
  selectRow: (student: userType.Student | null) => void;
  onChangeField: (name: string, value: any) => void;
};

type UpdateStudentState = {
  roles: userType.Role[];
  userRoles: number[];
  file: File | null;
  imagePreview: string | null;
  openArchivePopup: boolean;
};

export default class UpdateStudent extends React.Component<
  UpdateStudentProps,
  UpdateStudentState
> {
  state: UpdateStudentState = {
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

  componentDidUpdate(prevProps: UpdateStudentProps) {
    if (
      this.props.selected &&
      this.props.selected.id !== prevProps.selected.id
    ) {
      this.loadStudentRoles(this.props.selected.id);
    }
  }

  onChangeField = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  changeFile = (files: FileList | null) => {
    if (files) {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          file: files[0],
          imagePreview: reader.result as string,
        });
      };

      reader.readAsDataURL(files[0]);
    }
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
                <Flex alignItems="center">
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
              <Flex alignItems="center">
                <Box mr={1}>
                  {imagePreview && (
                    <img
                      alt="student"
                      src={imagePreview}
                      style={{ width: 100 }}
                    />
                  )}
                  {!imagePreview && (
                    <ProfileImage
                      src={selected.photoUrlThumb}
                      alt=""
                      w="100px"
                    />
                  )}
                </Box>
                <Box>
                  <input
                    onChange={e => this.changeFile(e.target.files)}
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
                  date={selected.birthDate ? selected.birthDate : Date.now()}
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
