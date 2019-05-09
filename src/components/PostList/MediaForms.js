// @flow

import React, { Component } from 'react';

import { Box, Flex } from 'grid-styled';

import { Title, Text, FileUpload } from 'components/common';

import { Menu, MenuItem } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import styled from 'styled-components';

import DatePicker from '../../components/DatePicker';

import * as moment from 'moment';

const AddButton = styled(Button)`
  margin-top: 10px;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const MediaCreatorWrap = styled.div`
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
  border-radius: 5px;
`;

export function MediaCreator(props) {
  if (props.show) {
    return (
      <MediaCreatorWrap>
        <Flex align="center">
          <Title invert fontSize={1.7}>
            {props.title}
          </Title>
          <Box ml="auto">
            <IconButton onClick={props.onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Flex>
        {props.children}
      </MediaCreatorWrap>
    );
  }
  return null;
}

export class PollForm extends Component {
  state = {
    title: '',
    answers: ['', ''],
    multiAnswers: false,
    duration: 24,
    endDate: new Date().getTime() + 24 * 3600 * 1000,
  };

  addAnswer = () => {
    const { answers } = this.state;
    this.setState({ answers: [...answers, ''] });
  };

  deleteAnswer = index => {
    const { answers } = this.state;
    answers.splice(index, 1);
    this.props.update({ ...this.state, answers });
    this.setState({ answers });
  };

  changeAnswer = (event, index) => {
    const { answers } = this.state;
    answers[index] = event.target.value;
    this.props.update({ ...this.state, answers });
    this.setState({ answers });
  };

  changeDuration = event => {
    const dur = parseInt(event.target.value, 10);
    if (isNaN(dur)) return;
    if (dur < 0) return;
    const now = new Date().getTime();
    this.props.update({
      ...this.state,
      endDate: now + dur * 3600 * 1000,
    });
    this.setState({
      endDate: now + dur * 3600 * 1000,
      duration: dur,
    });
  };

  changeMultiAnswer = () => {
    this.props.update({
      ...this.state,
      multiAnswers: !this.state.multiAnswers,
    });
    this.setState({ multiAnswers: !this.state.multiAnswers });
  };

  changeQues = event => {
    this.props.update({ ...this.state, title: event.target.value });
    this.setState({ title: event.target.value });
  };

  render() {
    const { answers } = this.state;
    return (
      <FormWrapper>
        <TextField fullWidth label="Question" onChange={this.changeQues} />
        {answers.map((a, index) => {
          return (
            <Flex align="center" key={index} mt={2}>
              <Box flex="1 1 auto">
                <TextField
                  fullWidth
                  label={`Réponse ${index + 1}`}
                  onChange={e => this.changeAnswer(e, index)}
                />
              </Box>
              <Box mb="-15px">
                {index > 1 && (
                  <IconButton onClick={() => this.deleteAnswer(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Flex>
          );
        })}
        <AddButton color="secondary" onClick={this.addAnswer}>
          Ajouter une réponse
        </AddButton>
        <Flex flexWrap="wrap">
          <Box width={1} mt={2}>
            <TextField
              type="number"
              fullWidth
              label="Durée (h)"
              value={this.state.duration}
              onChange={this.changeDuration}
              helperText={`Fin le ${moment(this.state.endDate).format(
                'Do MMMM YYYY HH:mm'
              )}`}
            />
          </Box>
          <Box width={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.multiAnswers}
                  onChange={this.changeMultiAnswer}
                />
              }
              label="Autorise plusieurs réponses"
            />
          </Box>
        </Flex>
      </FormWrapper>
    );
  }
}

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
`;

export class ImageForm extends Component {
  state = {
    imagePreview: null,
  };

  handleImageSelect = files => {
    const reader = new FileReader();
    const file = files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreview: reader.result,
      });
    };

    this.props.update({ file });
    reader.readAsDataURL(file);
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.imagePreview && (
          <Flex justify="center">
            <Box p={2}>
              <PreviewImage src={this.state.imagePreview} alt="" />
            </Box>
          </Flex>
        )}
        <FileUpload
          accept={['jpg', 'jpeg', 'JPG', 'JPEG']}
          onFile={this.handleImageSelect}
        >
          Choisir une image
        </FileUpload>
      </div>
    );
  }
}

export class VideoEmbedForm extends Component {
  state = {
    openTypeMenu: false,
    type: 'YOUTUBE',
    id: '',
  };

  changeUrl = event => {
    const id = event.target.value;
    this.setState({ id });
    this.update(id, this.state.type);
  };

  changeType = type => {
    this.setState({ type });
    this.closeMenu();
    this.update(this.state.id, type);
  };

  update = (id, type) => {
    const ytUrl = `https://www.youtube.com/embed/${id}`;
    this.props.update({
      url: type === 'YOUTUBE' ? ytUrl : id,
      type: type,
    });
  };

  closeMenu = () => {
    this.setState({ openTypeMenu: false });
  };

  openMenu = e => {
    this.setState({ openTypeMenu: true, anchorEl: e.target });
  };

  render() {
    return (
      <div>
        <div>
          <Button color="secondary" onClick={this.openMenu}>
            Choisir Type
          </Button>{' '}
          {this.state.type === 'YOUTUBE' ? 'Youtube' : 'Facebook'}
        </div>
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.openTypeMenu}
          onClose={this.closeMenu}
        >
          <MenuItem
            onClick={() => this.changeType('YOUTUBE')}
            selected={this.state.type === 'YOUTUBE'}
          >
            Youtube
          </MenuItem>
          <MenuItem
            onClick={() => this.changeType('FACEBOOK')}
            selected={this.state.type === 'FACEBOOK'}
          >
            Facebook
          </MenuItem>
        </Menu>
        <TextField label="ID de la Video" fullWidth onChange={this.changeUrl} />
      </div>
    );
  }
}

export class VideoForm extends Component {
  state = {
    name: '',
    video: null,
  };

  handleVideoSelect = files => {
    const video = files[0];
    this.setState({ video });
    if (this.state.name === '') {
      this.props.update({ ...this.state, video, name: video.name });
      return this.setState({ name: video.name });
    }
    this.props.update({ ...this.state, video });
  };

  changeName = event => {
    const name = event.target.value;
    this.props.update({ ...this.state, name });
    this.setState({ name });
  };

  render() {
    return (
      <div>
        <div>
          <TextField
            fullWidth
            label="Nom"
            value={this.state.name}
            onChange={this.changeName}
          />
        </div>
        <FileUpload accept={['mp4', 'mov']} onFile={this.handleVideoSelect}>
          Choisir une video
        </FileUpload>
      </div>
    );
  }
}

export class GalleryForm extends Component {
  state = {
    title: '',
    images: null,
  };

  handleFileSelect = files => {
    this.update({ images: files });
  };

  changeTitle = event => {
    const title = event.target.value;
    this.update({ title });
  };

  update(state) {
    this.setState({ ...state });
    this.props.update({ ...this.state, ...state });
  }

  render() {
    const { images } = this.state;
    const p = word => word + (images.length !== 1 ? 's' : '');
    return (
      <div>
        <div>
          {images && (
            <Text>
              {images.length} {p('image')} {p('sélectionnée')}
            </Text>
          )}
          <TextField
            fullWidth
            label="Nom"
            value={this.state.name}
            onChange={this.changeTitle}
          />
        </div>
        <FileUpload
          accept={['jpg', 'jpeg']}
          multiple
          onFile={this.handleFileSelect}
        >
          Ajouter des images
        </FileUpload>
      </div>
    );
  }
}

export class DocumentForm extends Component {
  state = {
    name: '',
    document: null,
  };

  handleFileSelect = files => {
    this.update({ document: files[0] });
  };

  changeName = event => {
    const name = event.target.value;
    this.update({ name });
  };

  update(state) {
    this.setState({ ...state });
    this.props.update({ ...this.state, ...state });
  }

  render() {
    const { document } = this.state;
    return (
      <div>
        <div>
          {document && <Text>Fichier sélectionné: {document.name}</Text>}
          <TextField
            fullWidth
            label="Nom"
            value={this.state.name}
            onChange={this.changeName}
          />
        </div>
        <FileUpload multiple onFile={this.handleFileSelect}>
          Ajouter un fichier
        </FileUpload>
      </div>
    );
  }
}

export class GazetteForm extends Component {
  state = {
    title: '',
    file: null,
  };

  handleFileSelect = files => {
    this.update({ file: files[0] });
  };

  changeName = event => {
    const title = event.target.value;
    this.update({ title });
  };

  update(state) {
    this.setState({ ...state });
    this.props.update({ ...this.state, ...state });
  }

  render() {
    const { file } = this.state;
    return (
      <div>
        <div>
          {file && <Text>Fichier sélectionné: {file.name}</Text>}
          <TextField
            fullWidth
            label="Nom"
            value={this.state.title}
            onChange={this.changeName}
          />
        </div>
        <FileUpload accept={['pdf']} onFile={this.handleFileSelect}>
          Ajouter un fichier
        </FileUpload>
      </div>
    );
  }
}

export class EventForm extends Component {
  state = {
    title: '',
    location: '',
    date: new Date(),
    description: '',
    image: null,
    imagePreview: null,
  };

  componentDidMount() {
    if (this.props.post) {
      this.setState({ ...this.props.post.media });
    }
  }

  handleFileSelect = files => {
    const reader = new FileReader();
    const file = files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreview: reader.result,
      });
    };

    reader.readAsDataURL(file);
    this.update({ image: file });
  };

  change = name => event => {
    this.update({ [name]: event.target.value });
  };

  update(state) {
    this.setState({ ...state });
    this.props.update({ ...this.state, ...state });
  }

  handleChangeDate = (date: Date) => {
    this.update({ date });
  };

  render() {
    const widthTF = this.props.fullw ? 1 : [1, 1, 1 / 2];
    return (
      <div>
        <Flex flexWrap="wrap">
          <Box w={widthTF} mb={2}>
            <TextField
              fullWidth
              label="Titre"
              value={this.state.title}
              onChange={this.change('title')}
            />
          </Box>
          <Box w={widthTF} mb={2}>
            <TextField
              fullWidth
              label="Lieu"
              value={this.state.location}
              onChange={this.change('location')}
            />
          </Box>
        </Flex>
        <Flex flexWrap="wrap">
          <Box w={widthTF} mb={2}>
            <DatePicker
              date={this.state.date}
              onChange={this.handleChangeDate}
            />
          </Box>
          <Box w={widthTF} mb={2}>
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
            Ajouter une photo
          </FileUpload>
        </div>
      </div>
    );
  }
}
