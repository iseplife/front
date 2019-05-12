import { Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box, Flex } from '@rebass/grid';
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'styled-components';
import { FileUpload, Text, Title } from '../../components/common';
import { Media } from '../../data/media/type';
import { Post } from '../../data/post/type';
import DatePicker from '../DatePicker';

const AddButton = styled(Button)`
  margin-top: 10px;
` as any;

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

interface MediaCreatorProps {
  title: string;
  show: boolean;
  onDelete: () => void;
}

export const MediaCreator: React.FC<MediaCreatorProps> = props => {
  if (props.show) {
    return (
      <MediaCreatorWrap>
        <Flex alignItems="center">
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
};

interface UpdateForm<T> {
  update: (data: T) => void;
}

interface PollFormState {
  title: string;
  answers: string[];
  multiAnswers: boolean;
  duration: number;
  endDate: number;
}

export class PollForm extends Component<
  UpdateForm<PollFormState>,
  PollFormState
> {
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

  deleteAnswer = (index: number) => {
    const { answers } = this.state;
    answers.splice(index, 1);
    this.props.update({ ...this.state, answers });
    this.setState({ answers });
  };

  changeAnswer = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { answers } = this.state;
    answers[index] = event.target.value;
    this.props.update({ ...this.state, answers });
    this.setState({ answers });
  };

  changeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  changeQues = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            <Flex alignItems="center" key={index} mt={2}>
              <Box flex="1 1 auto">
                <TextField
                  fullWidth
                  label={`Réponse ${index + 1}`}
                  onChange={e =>
                    this.changeAnswer(
                      e as React.ChangeEvent<HTMLInputElement>,
                      index
                    )
                  }
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

interface ImageFormProps {
  file: File;
}

export class ImageForm extends Component<UpdateForm<ImageFormProps>> {
  state = {
    imagePreview: null,
  };

  handleImageSelect = (files: FileList | null) => {
    if (files) {
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
    }
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {this.state.imagePreview && (
          <Flex justifyContent="center">
            <Box p={2}>
              <PreviewImage src={this.state.imagePreview || ''} alt="" />
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

interface VideoEmbedFormProps {
  url: string;
  type: string;
}

type VideoEmbedType = 'YOUTUBE' | 'FACEBOOK';
interface VideoEmbedFormState {
  openTypeMenu: boolean;
  type: VideoEmbedType;
  id: string;
  anchorEl: any;
}

export class VideoEmbedForm extends Component<
  UpdateForm<VideoEmbedFormProps>,
  VideoEmbedFormState
> {
  state: VideoEmbedFormState = {
    openTypeMenu: false,
    type: 'YOUTUBE',
    id: '',
    anchorEl: null,
  };

  changeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    this.setState({ id });
    this.update(id, this.state.type);
  };

  changeType = (type: VideoEmbedType) => {
    this.setState({ type });
    this.closeMenu();
    this.update(this.state.id, type);
  };

  update = (id: string, type: VideoEmbedType) => {
    const ytUrl = `https://www.youtube.com/embed/${id}`;
    this.props.update({
      url: type === 'YOUTUBE' ? ytUrl : id,
      type: type,
    });
  };

  closeMenu = () => {
    this.setState({ openTypeMenu: false });
  };

  openMenu = (e: React.MouseEvent) => {
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

interface VideoFormState {
  name: string;
  video: File | null;
}

export class VideoForm extends Component<
  UpdateForm<VideoFormState>,
  VideoFormState
> {
  state: VideoFormState = {
    name: '',
    video: null,
  };

  handleVideoSelect = (files: FileList | null) => {
    if (files) {
      const video = files[0];
      this.setState({ video });
      if (this.state.name === '') {
        this.props.update({ ...this.state, video, name: video.name });
        return this.setState({ name: video.name });
      }
      this.props.update({ ...this.state, video });
    }
  };

  changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
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

interface GalleryFormState {
  title: string;
  images: FileList | null;
}

export class GalleryForm extends Component<
  UpdateForm<GalleryFormState>,
  GalleryFormState
> {
  state: GalleryFormState = {
    title: '',
    images: null,
  };

  handleFileSelect = (files: FileList | null) => {
    this.update({ images: files });
  };

  changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    this.update({ title });
  };

  update(state: Partial<GalleryFormState>) {
    this.setState(state as any);
    this.props.update({ ...this.state, ...state });
  }

  render() {
    const { images } = this.state;
    const p = (word: string) =>
      word + (images && images.length !== 1 ? 's' : '');
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
            value={this.state.title}
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

interface DocumentFormState {
  name: string;
  document: File | null;
}

export class DocumentForm extends Component<
  UpdateForm<DocumentFormState>,
  DocumentFormState
> {
  state: DocumentFormState = {
    name: '',
    document: null,
  };

  handleFileSelect = (files: FileList | null) => {
    if (files) {
      this.update({ document: files[0] });
    }
  };

  changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    this.update({ name });
  };

  update(state: Partial<DocumentFormState>) {
    this.setState(state as any);
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

interface GazetteFormState {
  title: string;
  file: File | null;
}

export class GazetteForm extends Component<
  UpdateForm<GazetteFormState>,
  GazetteFormState
> {
  state: GazetteFormState = {
    title: '',
    file: null,
  };

  handleFileSelect = (files: FileList | null) => {
    if (files) {
      this.update({ file: files[0] });
    }
  };

  changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    this.update({ title });
  };

  update(state: Partial<GazetteFormState>) {
    this.setState(state as any);
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

interface EventFormProps extends UpdateForm<EventFormState> {
  post?: Post;
  fullw?: boolean;
}

interface EventFormState {
  title: string;
  location: string;
  date: number;
  description: string;
  image: File | null;
  imagePreview: string | ArrayBuffer | null;
  media: Media | null;
}

export class EventForm extends Component<EventFormProps, EventFormState> {
  state: EventFormState = {
    title: '',
    location: '',
    date: Date.now(),
    description: '',
    image: null,
    imagePreview: null,
    media: null,
  };

  componentDidMount() {
    if (this.props.post) {
      this.setState({ media: this.props.post.media });
    }
  }

  handleFileSelect = (files: FileList | null) => {
    if (files) {
      const reader = new FileReader();
      const file = files[0];

      reader.onloadend = () => {
        this.setState({
          imagePreview: reader.result,
        });
      };

      reader.readAsDataURL(file);
      this.update({ image: file });
    }
  };

  change = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.update({ [name]: event.target.value });
  };

  update(state: Partial<EventFormState>) {
    this.setState(state as any);
    this.props.update({ ...this.state, ...state });
  }

  handleChangeDate = (date: Date) => {
    this.update({ date: date.getTime() });
  };

  render() {
    const widthTF = this.props.fullw ? 1 : [1, 1, 1 / 2];
    return (
      <div>
        <Flex flexWrap="wrap">
          <Box width={widthTF} mb={2}>
            <TextField
              fullWidth
              label="Titre"
              value={this.state.title}
              onChange={this.change('title')}
            />
          </Box>
          <Box width={widthTF} mb={2}>
            <TextField
              fullWidth
              label="Lieu"
              value={this.state.location}
              onChange={this.change('location')}
            />
          </Box>
        </Flex>
        <Flex flexWrap="wrap">
          <Box width={widthTF} mb={2}>
            <DatePicker
              date={this.state.date}
              onChange={this.handleChangeDate}
            />
          </Box>
          <Box width={widthTF} mb={2}>
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
                <PreviewImage src={this.state.imagePreview as string} alt="" />
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
