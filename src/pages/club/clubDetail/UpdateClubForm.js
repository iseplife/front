// @flow

import React from 'react';

import { Text } from 'components/common';

import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

import DatePicker from '../../../components/DatePicker';
import * as userData from '../../../data/users/student';

export default class AddClubForm extends React.Component {
  state = {
    name: '',
    creation: new Date(),
    description: '',
    website: '',
    logo: null,
  };

  componentWillReceiveProps(props) {
    if (props.form) {
      const form = props.form;
      this.setState({
        name: form.name,
        creation: new Date(form.creation),
        description: form.description,
        website: form.website,
      });
    }
  }

  change = (name, value) => {
    this.setState(state => ({
      ...state,
      [name]: value,
    }));
  };

  handleInput = name => event => this.change(name, event.target.value);

  search = value => {
    return userData
      .searchStudents(value, [], 'a', 0)
      .then(res => res.data.content);
  };

  renderSuggestion = sug => `${sug.firstname} ${sug.lastname}`;

  handleSave = e => {
    this.props.onSave(this.state);
  };

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <Dialog
        open={props.open}
        transition={Slide}
        onClose={props.handleRequestClose}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            fullWidth
            margin="normal"
            value={state.name}
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

          <TextField
            label="Description"
            multiline
            rows="4"
            fullWidth
            margin="normal"
            value={state.description}
            onChange={this.handleInput('description')}
          />

          <TextField
            label="Site Internet"
            fullWidth
            margin="normal"
            value={state.website}
            onChange={this.handleInput('website')}
          />

          <div style={{ marginTop: 10 }}>
            <input
              onChange={e => this.change('logo', e.target.files[0])}
              accept="jpg,jpeg,JPG,JPEG"
              id="file"
              type="file"
              style={{ display: 'none' }}
            />
            <label htmlFor="file">
              <Button variant="raised" component="span">
                Ajouter logo
              </Button>
            </label>
          </div>
          {this.state.logo && (
            <Text>Fichier sélectionné: {this.state.logo.name}</Text>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleRequestClose} color="primary">
            Annuler
          </Button>
          <Button color="secondary" onClick={this.handleSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
