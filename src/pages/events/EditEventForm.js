// @flow
import React from 'react';

import styled from 'styled-components';

import { Box, Flex } from 'grid-styled';
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

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
`;

export default class EditEventForm extends React.Component {
  state = {
    title: '',
    location: '',
    date: new Date(),
    description: '',
    image: null,
    imagePreview: null,
  };

  componentWillReceiveProps(props) {
    if (props.event) {
      this.setState({ ...props.event });
    }
  }

  handleFileSelect = files => {
    const reader = new FileReader();
    const file = files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreview: reader.result,
        image: file,
      });
    };

    reader.readAsDataURL(file);
  };

  change = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeDate = (date: Date) => {
    this.setState({ date });
  };

  handleSave = () => {
    this.props.saveEvent(this.state);
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleRequestClose}>
        <DialogTitle>Editer l'évenement</DialogTitle>
        <DialogContent>
          <Flex flexWrap="wrap">
            <Box w={1} mb={2}>
              <TextField
                fullWidth
                label="Titre"
                value={this.state.title}
                onChange={this.change('title')}
              />
            </Box>
            <Box w={1} mb={2}>
              <TextField
                fullWidth
                label="Lieu"
                value={this.state.location}
                onChange={this.change('location')}
              />
            </Box>
          </Flex>
          <Flex flexWrap="wrap">
            <Box w={1} mb={2}>
              <DatePicker
                date={this.state.date}
                onChange={this.handleChangeDate}
              />
            </Box>
            <Box w={1} mb={2}>
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
            {this.state.image &&
              this.state.imagePreview && (
                <Flex justify="center">
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
