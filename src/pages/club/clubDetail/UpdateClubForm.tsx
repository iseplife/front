import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { Text } from '../../../components/common';
import DatePicker from '../../../components/DatePicker';
import * as userData from '../../../data/users/student';
import { Club, Student } from '../../../data/users/type';

type UpdateClubFormProps = {
  open: boolean;
  title: string;
  form?: Club | null;
  onSave: (state: UpdateClubFormData) => void;
  handleRequestClose: () => void;
};
type UpdateClubFormState = {
  name: string;
  creation: number;
  description: string;
  website: string;
  logo: File | null;
};

export type UpdateClubFormData = UpdateClubFormState;

export default class UpdateClubForm extends React.Component<
  UpdateClubFormProps,
  UpdateClubFormState
> {
  state: UpdateClubFormState = {
    name: '',
    creation: Date.now(),
    description: '',
    website: '',
    logo: null,
  };

  componentDidUpdate(prevProps: UpdateClubFormProps) {
    const { form } = this.props;
    if (form && form !== prevProps.form) {
      this.setState({
        name: form.name,
        creation: form.creation,
        description: form.description,
        website: form.website,
      });
    }
  }

  change = (name: keyof UpdateClubFormState, value: any) => {
    this.setState(state => ({
      ...state,
      [name]: value,
    }));
  };

  changeLogo = (files: FileList | null) => {
    if (files) {
      this.setState({
        logo: files[0],
      });
    }
  };

  handleInput = (name: keyof UpdateClubFormState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => this.change(name, event.target.value);

  search = async (value: string) => {
    const res = await userData.searchStudents(value, [], 'a', 0);
    return res.data.content;
  };

  renderSuggestion = (sug: Student) => `${sug.firstname} ${sug.lastname}`;

  handleSave = () => {
    this.props.onSave(this.state);
  };

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <Dialog
        open={props.open}
        TransitionComponent={Slide}
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
              onChange={e => this.changeLogo(e.target.files)}
              accept="jpg,jpeg,JPG,JPEG"
              id="file"
              type="file"
              style={{ display: 'none' }}
            />
            <label htmlFor="file">
              <Button variant="contained" component="span">
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
