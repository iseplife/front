import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import AutoComplete from '../../components/Autocomplete';
import { Text } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import { backUrl } from '../../config';
import * as userData from '../../data/users/student';
import { Student } from '../../data/users/type';

type AddClubFormState = {
  name: string;
  creation: number;
  president: number;
  description: string;
  website: string;
  logo: File | null;
  autocompleteValue: string;
};

type AddClubFormProps = {
  onSave: (s: AddClubFormState) => Promise<any>;
  handleRequestClose: () => void;
  open: boolean;
  title: string;
};

export default class AddClubForm extends React.Component<
  AddClubFormProps,
  AddClubFormState
> {
  state: AddClubFormState = {
    name: '',
    creation: Date.now(),
    president: -1,
    description: '',
    website: '',
    logo: null,
    autocompleteValue: '',
  };

  change = (name: string, value: any): string => {
    this.setState(state => ({
      ...state,
      [name]: value,
    }));
    return '';
  };

  changeLogo = (files: FileList | null) => {
    if (files && files.length > 0) {
      this.setState({ logo: files[0] });
    }
  };

  handleInput = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => this.change(name, event.target.value);

  search = (value: string) => {
    this.setState({ autocompleteValue: value });
    return userData
      .searchStudents(value, [], 'a', 0)
      .then(res => res.data.content);
  };

  renderSuggestion = (e: Student) => {
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

  canSave = () => {
    const { name, president, description, logo } = this.state;
    return (
      name !== '' && president !== -1 && description !== '' && logo !== null
    );
  };

  handleSave = () => {
    this.props.onSave(this.state).then(() => {
      this.props.handleRequestClose();
    });
  };

  render() {
    const props = this.props;
    return (
      <Dialog
        open={props.open}
        TransitionComponent={Slide}
        onClose={props.handleRequestClose}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Nom"
            fullWidth
            margin="normal"
            onChange={this.handleInput('name')}
          />
          <div style={{ margin: '20px 0' }}>
            <Text>Création</Text>
            <DatePicker
              dateonly
              date={this.state.creation}
              startYear={1956}
              endYear={new Date().getFullYear() + 1}
              onChange={date => this.change('creation', date)}
            />
          </div>
          <AutoComplete
            label="Président *"
            search={this.search}
            onSelect={val => this.change('president', val.id)}
            renderSuggestion={this.renderSuggestion}
          />
          <TextField
            required
            label="Description"
            multiline
            rows="4"
            fullWidth
            margin="normal"
            onChange={this.handleInput('description')}
          />
          <TextField
            label="Site Internet"
            fullWidth
            margin="normal"
            onChange={this.handleInput('website')}
          />
          <div style={{ marginTop: 10 }}>
            <input
              onChange={e => this.changeLogo(e.target.files)}
              accept="jpg,jpeg,JPG,JPEG"
              id="file"
              type="file"
              style={{ display: 'none' }}
            />
            <label htmlFor="file">
              <Flex alignItems="center">
                <Box>
                  <Button color="primary" variant="raised" component="span">
                    Choisir logo
                  </Button>
                </Box>
                <Box p={2}>
                  {this.state.logo && (
                    <Text>Fichier sélectionné: {this.state.logo.name}</Text>
                  )}
                </Box>
              </Flex>
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleRequestClose} color="primary">
            Annuler
          </Button>
          <Button
            color="secondary"
            onClick={this.handleSave}
            disabled={!this.canSave()}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
