import React from 'react';

import styled from 'styled-components';

import { Box, Flex } from '@rebass/grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { FileUpload } from '../../components/common';
import DatePicker from '../../components/DatePicker';
import { Event } from '../../data/media/type';

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
`;

type EditEventFormProps = {
  open: boolean;
  event: Event | null;
  saveEvent: (save: Event) => void;
  handleRequestClose: () => void;
};
type EditEventFormState = {
  title: string;
  location: string;
  date: number;
  description: string;
  image: File | null;
  imagePreview: string | null;
};

export default class EditEventForm extends React.Component<
  EditEventFormProps,
  EditEventFormState
> {
  state: EditEventFormState = {
    title: '',
    location: '',
    date: Date.now(),
    description: '',
    image: null,
    imagePreview: null,
  };

  componentDidUpdate(prevProps: EditEventFormProps) {
    const { event } = this.props;
    if (event && event !== prevProps.event) {
      this.setState({
        title: event.title,
        location: event.location,
        date: event.date,
        description: event.description,
      });
    }
  }

  handleFileSelect = (files: FileList | null) => {
    if (files) {
      const reader = new FileReader();
      const file = files[0];

      reader.onloadend = () => {
        this.setState({
          imagePreview: reader.result as string,
          image: file,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  change = (name: keyof EditEventFormState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ [name]: event.target.value } as any);
  };

  handleChangeDate = (date: Date) => {
    this.setState({ date: date.getTime() });
  };

  handleSave = () => {
    const { title, location, description, date } = this.state;
    this.props.saveEvent({
      title,
      location,
      description,
      date,
    } as Event);
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleRequestClose}>
        <DialogTitle>Editer l'évenement</DialogTitle>
        <DialogContent>
          <Flex flexWrap="wrap">
            <Box width={1} mb={2}>
              <TextField
                fullWidth
                label="Titre"
                value={this.state.title}
                onChange={this.change('title')}
              />
            </Box>
            <Box width={1} mb={2}>
              <TextField
                fullWidth
                label="Lieu"
                value={this.state.location}
                onChange={this.change('location')}
              />
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            <Box width={1} mb={2}>
              <DatePicker
                date={this.state.date}
                onChange={this.handleChangeDate}
              />
            </Box>
            <Box width={1} mb={2}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={5}
                value={this.state.description}
                onChange={this.change('description')}
              />
            </Box>
          </Flex>
          <div style={{ textAlign: 'center' }}>
            {this.state.image && this.state.imagePreview && (
              <Flex justifyContent="center">
                <Box p={2}>
                  <PreviewImage src={this.state.imagePreview} alt="" />
                </Box>
              </Flex>
            )}
            <FileUpload accept={['jpg', 'jpeg']} onFile={this.handleFileSelect}>
              Modifier la photo
            </FileUpload>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleRequestClose} color="primary">
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
