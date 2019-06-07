import { Menu, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import styled from 'styled-components';
import { sendAlert } from '../../components/Alert';
import { ProfileImage, Text } from '../../components/common';
import {
  DocumentForm,
  EventForm,
  GalleryForm,
  GazetteForm,
  ImageForm,
  MediaCreator,
  PollForm,
  VideoEmbedForm,
  VideoForm,
} from '../../components/PostList/MediaForms';
import * as authData from '../../data/auth';
import * as mediaData from '../../data/media';
import * as imageData from '../../data/media/image';
import * as pollData from '../../data/media/poll';
import * as videoData from '../../data/media/video';
import * as postData from '../../data/post';
import { PostCreation } from '../../data/post/type';
import * as userTypes from '../../data/users/type';
import { CancelablePromise, makeCancelable } from '../../data/util';

const PublishBox = styled.div`
  background: ${props => props.theme.main};
  padding: 20px;
  margin-bottom: 3px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

type TitleBoxProps = { m?: string };
const TitleBox = styled.input`
  font-family: 'Roboto';
  font-size: 1.3em;
  padding: 0.4em;
  border: 5px solid transparent;
  outline: 0;
  border-radius: 5px;
  width: 100%;
  margin-bottom: ${(props: TitleBoxProps) => props.m || '5px'};
`;

let MessageBox = TitleBox.withComponent('textarea');
MessageBox = styled(MessageBox)`
  resize: none;
  min-height: 80px;
`;

interface PublishBoxAuthor {
  id: number;
  name: string;
  image: string;
  type: userTypes.AuthorType;
  isAdmin: boolean;
}

interface SendAsProps {
  author?: PublishBoxAuthor | null;
  c?: string;
}

const SendAs: React.FC<SendAsProps> = ({ author, c }) => {
  return (
    <Flex alignItems="center">
      <Box mr="10px">
        <ProfileImage
          alt="Sender image"
          w="20px"
          src={author && author.image}
        />
      </Box>
      <Box>
        <Text color={c || 'white'} m="0">
          {author && author.name}
        </Text>
      </Box>
    </Flex>
  );
};

type MediaChoice = {
  id: string;
  name: string;
};

const mediaAvailable = [
  {
    id: 'poll',
    name: 'Sondage',
  },
  {
    id: 'image',
    name: 'Image',
  },
  {
    id: 'document',
    name: 'Pièce jointe',
  },
  {
    id: 'video',
    name: 'Video',
  },
  // {
  //   id: 'videoEmbed',
  //   name: 'Video FB/YT',
  // },
];

type PublishBoxProps = {
  refreshPosts: () => void;
};

type CustomAuthorType = {
  id: number;
  name: string;
  image: string;
  type: userTypes.AuthorType;
  isAdmin: boolean;
};

type PublishBoxState = {
  title: string;
  message: string;
  isPrivateMessage: boolean;
  selectedIndex: number;
  mediaMenuOpen: boolean;
  authorMenuOpen: boolean;
  author: PublishBoxAuthor | null;
  authorList: CustomAuthorType[];
  mediaCreatorOpen: boolean;
  form: any | null;
  mediaSelected: MediaChoice | null;
  isUploading: boolean;
  uploadMode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  uploadProgress: number;
  messageRows: number;
  anchorEl?: any;
};

class PublishBoxView extends Component<PublishBoxProps, PublishBoxState> {
  state: PublishBoxState = {
    title: '',
    message: '',
    isPrivateMessage: true,
    selectedIndex: -1,
    mediaMenuOpen: false,
    authorMenuOpen: false,
    author: null,
    authorList: [],
    mediaCreatorOpen: false,
    form: null,
    mediaSelected: null,
    isUploading: false,
    uploadMode: 'indeterminate',
    uploadProgress: 0,
    messageRows: 2,
    anchorEl: null,
  };

  getAuthorsReq?: CancelablePromise;

  componentDidMount() {
    if (authData.isLoggedIn()) {
      const savedMessage = localStorage.getItem('saved-message');
      if (savedMessage) {
        this.setState({ message: savedMessage });
      }

      this.getAuthorsReq = makeCancelable(postData.getAuthors());
      this.getAuthorsReq.promise.then(res => {
        const authors = res.data.map(
          (author: userTypes.Author): PublishBoxAuthor => {
            return {
              id: author.id,
              name:
                author.authorType === 'student'
                  ? 'Moi'
                  : (author as userTypes.Club).name,
              image:
                author.authorType === 'club'
                  ? (author as userTypes.Club).logoUrl
                  : (author as userTypes.Student).photoUrlThumb || '',
              type: author.authorType,
              isAdmin:
                author.authorType === 'club'
                  ? (author as userTypes.Club).admin
                  : false,
            };
          }
        );
        this.setState({ authorList: authors, author: authors[0] });
      });
    }
  }

  componentWillUnmount() {
    if (this.getAuthorsReq) {
      this.getAuthorsReq.cancel();
    }
  }

  onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.currentTarget.value });
  };

  onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = event.currentTarget.value;
    localStorage.setItem('saved-message', message);
    const numLines = message.split('\n').length;
    this.setState({
      message,
      messageRows: Math.min(numLines + 1, 15),
    });
  };

  onPrivateToggle = () => {
    this.setState({ isPrivateMessage: !this.state.isPrivateMessage });
  };

  async createPost(): Promise<number> {
    if (!this.state.author) {
      throw new Error('no author');
    }

    const post: PostCreation = {
      authorId: this.state.author.id,
      content: this.state.message,
      title: this.state.title,
      private: this.state.isPrivateMessage,
    };

    const postRes = await postData.createPost(post);
    // await postData.publishPost(postRes.data.id);

    return postRes.data.id;
  }

  handleErrors = (err?: Error) => {
    console.log(err);
    this.setState({ isUploading: false });
    sendAlert("Le post n'a pu être publié", 'error');
  };

  onPublish = async () => {
    if (this.state.mediaSelected) {
      const toUpload = ['gallery', 'video', 'document', 'image'];
      if (toUpload.includes(this.state.mediaSelected.id)) {
        this.setState({ isUploading: true });
      }

      try {
        // create post in WAITING state
        const postResId = await this.createPost();
        // upload media and save entity
        if (postResId) {
          await this.createMedia(postResId);
        }
      } catch (error) {
        this.handleErrors(error);
        return;
      }

      // link media to post
      //await postData.addMedia(postResId, mediaRes.data.id);
      // if (.includes(this.state.mediaSelected.id)) {
      // set post state to PUBLISHED
      // await postData.publishPost(postResId);
      // }
      this.closeMediaCreator();

      sendAlert('Post publié');
      localStorage.removeItem('saved-message');

      this.setState({ title: '', message: '', isUploading: false });
      this.props.refreshPosts();
      return;
    }

    try {
      // create post without media
      const postId = await this.createPost();
      if (postId) {
        // set post state to PUBLISHED
        await postData.publishPost(postId);
      }
      sendAlert('Post publié');
      localStorage.removeItem('saved-message');

      this.setState({ title: '', message: '' });

      this.props.refreshPosts();
    } catch (error) {
      this.handleErrors(error);
    }
  };

  handleMediaSelect = (item: MediaChoice) => {
    this.setState({ mediaSelected: item, mediaCreatorOpen: true });
    this.handleMediaMenuClose();
  };

  handleMediaMenuClose = () => {
    this.setState({ mediaMenuOpen: false });
  };

  openMediaMenu = (event: React.MouseEvent) => {
    this.setState({ mediaMenuOpen: true, anchorEl: event.currentTarget });
  };

  handleAuthorMenuClose = () => {
    this.setState({ authorMenuOpen: false });
  };

  handleAuthorSelect = (author: CustomAuthorType) => {
    this.setState({
      title: '',
      message: '',
      author,
      authorMenuOpen: false,
    });
  };

  changeAuthor = (event: React.MouseEvent) => {
    this.setState({
      authorMenuOpen: true,
      anchorEl: event.currentTarget,
    });
  };

  closeMediaCreator = () => {
    this.setState({ mediaCreatorOpen: false, form: null, mediaSelected: null });
  };

  onFormChange = (form: any) => {
    this.setState({ form });
  };

  onProgress = (progressEvent: { loaded: number; total: number }) => {
    if (this.state.isUploading) {
      const percent = Math.floor(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (percent === 100) {
        this.setState({ uploadMode: 'indeterminate' });
      } else {
        this.setState({ uploadMode: 'determinate', uploadProgress: percent });
      }
    }
  };

  canPublish() {
    const { author, title, message, mediaSelected } = this.state;

    if (author && author.type === 'club') {
      if (title && message && title !== '' && message !== '') {
        return true;
      }
    } else {
      if (message && message !== '') {
        return true;
      }
    }
    return false;
  }

  getMediaPublishList() {
    const { author } = this.state;
    if (author && author.type === 'club') {
      let list = [
        ...mediaAvailable,
        { id: 'gallery', name: 'Galerie' },
        { id: 'event', name: 'Evenement' },
      ];
      if (author.isAdmin) {
        list.push({ id: 'gazette', name: 'Gazette' });
      }
      return list;
    }
    return mediaAvailable;
  }

  createMedia = (postId: number) => {
    if (this.state.mediaSelected) {
      switch (this.state.mediaSelected.id) {
        case 'poll':
          return pollData.createPoll(postId, this.state.form);
        case 'image':
          return imageData.createImage(
            postId,
            this.state.form.file,
            this.onProgress
          );
        // case 'videoEmbed':
        //   return videoData.createVideoEmbed(this.state.form);
        case 'video':
          return videoData.createVideo(
            postId,
            this.state.form,
            this.onProgress
          );
        case 'gallery':
          return imageData.createGallery(
            postId,
            this.state.form,
            this.onProgress
          );
        case 'event':
          if (this.state.author) {
            return mediaData.createEvent(
              postId,
              this.state.form,
              this.state.author.id
            );
          }
          break;
        case 'document':
          return mediaData.createDocument(postId, this.state.form);
        case 'gazette':
          return mediaData.createGazette(postId, this.state.form);
        default:
          break;
      }
    }
  };

  renderForm() {
    if (this.state.mediaSelected) {
      switch (this.state.mediaSelected.id) {
        case 'poll':
          return <PollForm update={this.onFormChange} />;
        case 'image':
          return <ImageForm update={this.onFormChange} />;
        case 'videoEmbed':
          return <VideoEmbedForm update={this.onFormChange} />;
        case 'video':
          return <VideoForm update={this.onFormChange} />;
        case 'gallery':
          return <GalleryForm update={this.onFormChange} />;
        case 'document':
          return <DocumentForm update={this.onFormChange} />;
        case 'gazette':
          return <GazetteForm update={this.onFormChange} />;
        case 'event':
          return <EventForm update={this.onFormChange} />;
        default:
          break;
      }
    }
  }

  onMessageBoxKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.keyCode === 13 && this.canPublish()) {
      this.onPublish();
    }
  };

  render() {
    const { author, isUploading } = this.state;
    const canPublish = this.canPublish();
    return (
      <div style={{ marginBottom: 20 }}>
        <PublishBox>
          {author && author.type === 'club' && (
            <TitleBox
              placeholder="Titre"
              m="15px"
              onChange={this.onTitleChange}
              value={this.state.title}
            />
          )}
          <MessageBox
            rows={this.state.messageRows}
            placeholder="Tapez votre message"
            onChange={this.onMessageChange}
            value={this.state.message}
            onKeyDown={this.onMessageBoxKeyDown}
          />
          {this.state.mediaSelected && (
            <MediaCreator
              title={this.state.mediaSelected.name}
              show={this.state.mediaCreatorOpen}
              onDelete={this.closeMediaCreator}
            >
              {this.renderForm()}
            </MediaCreator>
          )}
          <Flex alignItems="center" flexWrap="wrap">
            <Box>
              <IconButton onClick={this.openMediaMenu}>
                <AddCircleIcon style={{ color: 'white' }} />
              </IconButton>
            </Box>
            <Box ml="auto">
              <FormControlLabel
                color="secondary"
                control={
                  <Checkbox
                    checked={this.state.isPrivateMessage}
                    style={{ color: 'white' }}
                    onChange={this.onPrivateToggle}
                  />
                }
                label={
                  <span style={{ color: 'white', fontWeight: 500 }}>PRIVÉ</span>
                }
              />
            </Box>
            <Box ml="5px">
              <Button onClick={this.changeAuthor}>
                <SendAs author={this.state.author} />
              </Button>
            </Box>
            <Box ml="10px">
              <Button
                variant="contained"
                color="secondary"
                style={{ float: 'right' }}
                onClick={this.onPublish}
                disabled={!canPublish || isUploading}
              >
                Publier
              </Button>
            </Box>
          </Flex>
          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.authorMenuOpen}
            onClose={this.handleAuthorMenuClose}
          >
            {this.state.authorList.map(a => {
              return (
                <MenuItem
                  key={a.id}
                  onClick={() => this.handleAuthorSelect(a)}
                  selected={this.state.author === a}
                >
                  <SendAs author={a} c="black" />
                </MenuItem>
              );
            })}
          </Menu>
          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.mediaMenuOpen}
            onClose={this.handleMediaMenuClose}
          >
            {this.getMediaPublishList().map(l => {
              return (
                <MenuItem
                  key={l.name}
                  onClick={() => this.handleMediaSelect(l)}
                >
                  {l.name}
                </MenuItem>
              );
            })}
          </Menu>
        </PublishBox>
        {isUploading && (
          <LinearProgress
            color="primary"
            variant={this.state.uploadMode}
            value={this.state.uploadProgress}
          />
        )}
      </div>
    );
  }
}

export default PublishBoxView;
