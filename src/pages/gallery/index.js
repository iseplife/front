// @flow

import React from 'react';

import { Flex, Box } from 'grid-styled';
import {Link, Redirect} from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

import {
  Title,
  FluidContent,
  Image,
  Text,
  ScrollToTopOnMount,
  FileUpload,
} from '../../components/common';

import FullScreenGallery from '../../components/FullScreen/Gallery';
import Loader from '../../components/Loader';
import Time from '../../components/Time';

import { ADMIN, POST_MANAGER } from '../../constants';

import LazyLoad from 'react-lazyload';

import { backUrl } from '../../config';
import styled from 'styled-components';

import type {
  Gallery as GalleryType,
  Image as ImageType,
} from '../../data/media/type';

import * as mediaData from '../../data/media/image';
import * as authData from '../../data/auth';
import * as postData from '../../data/post';
import Popup from "../../components/Popup";

const ImagePlaceholder = styled.div`
  background: #eee;
  height: 130;
`;

const Edit = props => {
  return (
    <div style={{ marginBottom: 10 }}>
      <Checkbox onChange={props.onSelect(props.img)} />
    </div>
  );
};

class ThumbnailAnimation extends React.Component<{}, {}> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    const img = new window.Image();
    img.onload = () => {
      this.setState({ loaded: true });
    };
    img.src = backUrl + this.props.src;
  }

  render() {
    const { loaded } = this.state;
    return this.props.children(loaded);
  }
}

type State = {
  isLoading: boolean,
  gallery: GalleryType,
  galleryOpen: boolean,
  galleryIndex: number,
  images: ImageType[],
  selectedImages: number[],
  isPostAuthor: boolean,
  isEditing: boolean,
  isAdding: boolean,
  deleteEnable: boolean,
};

export default class GalleryPage extends React.Component<{}, State> {
  state = {
    isLoading: false,
    gallery: null,
    galleryOpen: false,
    galleryIndex: 0,
    images: [],
    selectedImages: [],
    isPostAuthor: false,
    isEditing: false,
    isAdding: false,
    deleteEnable: false
  };

  galleryId: number;
  photoId: number;

  componentDidMount() {
    const { match, history } = this.props;
    this.galleryId = match.params['id'];
    if (history.location.state) {
      this.photoId = history.location.state['imageId'];
    }
    this.getGallery();
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  componentWillReceiveProps(props) {
    if (props.history.location.state) {
      const photoId = props.history.location.state.imageId;
      const index = this.state.images.findIndex(e => e.id === photoId);
      this.selectPhoto(index);
    }
  }

  async getGallery() {
    this.setState({ isLoading: true });
    const galleryRes = await mediaData.getGallery(this.galleryId);
    const imagesRes = await mediaData.getGalleryImages(this.galleryId);

    this.verifyAuthor(galleryRes.data.postId);
    this.setState({
      images: imagesRes.data,
      gallery: galleryRes.data,
      isLoading: false,
    });
    if (this.photoId) {
      const index = imagesRes.data.findIndex(e => e.id === this.photoId);
      this.selectPhoto(index);
    }
  }

  refreshGallery = () => {
    mediaData.getGalleryImages(this.galleryId).then(res => {
      this.setState({ images: res.data });
    });
  };

  verifyAuthor = id => {
    const user = authData.getUser();
    if (user) {
      postData.getPost(id).then(res => {
        const post = res.data;
        if (post.author.authorType === 'club') {
          if (user.clubsAdmin.includes(post.author.id)) {
            this.setState({ isPostAuthor: true });
          }
        }
        if (post.author.authorType === 'student') {
          if (post.author.id === user.id) {
            this.setState({ isPostAuthor: true });
          }
        }
      });
    }
  };

  showGallery = () => this.setState({ galleryOpen: true });

  hideGallery = () => {
    this.refreshGallery();
    this.props.history.replace({
      ...this.props.history.location,
      state: null,
    });
    this.setState({ galleryOpen: false });
  };

  selectPhoto = index => {
    this.setState({ galleryIndex: index });
    this.showGallery();
  };

  selectPhotoEdit = img => e => {
    const { selectedImages } = this.state;
    if (!selectedImages.includes(img.id)) {
      selectedImages.push(img.id);
      this.setState({ selectedImages });
      return;
    }
    const newSelection = selectedImages.filter(id => id !== img.id);
    this.setState({ selectedImages: newSelection });
  };

  toggleEdit = () => {
    if (this.state.isEditing) {
      this.setState({ selectedImages: [] });
    }
    this.setState({ isEditing: !this.state.isEditing });
  };

  addPhotos = photos => {
    const { gallery } = this.state;
    this.setState({ isAdding: true });
    mediaData.addImages(gallery.id, photos).then(res => {
      this.refreshGallery();
      this.setState({ isAdding: false });
    });
  };

  deletePhotos = () => {
    const { selectedImages, gallery, images } = this.state;
    this.setState({ selectedImages: [] });
    if(selectedImages.length === images.length) this.state.deleteEnabled = true;
    else{
      mediaData.deleteImages(gallery.id, selectedImages).then(res => {
        this.refreshGallery();
      });
    }
  };

  deleteGallery = (ok: boolean) => {
    if (ok) {
      postData.deletePost(this.state.gallery.postId).then(res => {
        this.props.history.push('/');
      });

    }
    this.setState({
      deleteEnabled: false,
    });
  };

  render() {
    const {
      isLoading,
      gallery,
      galleryOpen,
      galleryIndex,
      images,
      selectedImages,
      isPostAuthor,
      isEditing,
      isAdding,
    } = this.state;

    const countImages = selectedImages.length;
    const canEdit = isPostAuthor || authData.hasRole([ADMIN, POST_MANAGER]);
    const shouldEdit = canEdit && isEditing;

    return (
      <FluidContent>
        <ScrollToTopOnMount />
        <Title invert fontSize={1}>
          GALERIE
        </Title>
        <Loader loading={isLoading}>
          {gallery && (
            <div style={{ minHeight: 500 }}>
              <Flex align="center">
                <Box>
                  <Title>{gallery.name}</Title>
                  <Text mb={1}>
                    Créée le{' '}
                    <Time
                      date={gallery.creation}
                      format="DD/MM/YYYY [à] HH:mm"
                    />
                  </Text>
                  <Text mb={1} fs="13px">
                    {images.length} photo
                    {images.length !== 1 && 's'}
                  </Text>
                </Box>
                <Box ml="auto">
                  {canEdit && (
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.toggleEdit}
                    >
                      {isEditing ? 'Ok' : 'Editer'}
                    </Button>
                  )}
                </Box>
              </Flex>
              {shouldEdit && (
                <Flex align="center">
                  <Box p={1}>
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.deletePhotos}
                      disabled={selectedImages.length === 0}
                    >
                      Supprimer
                    </Button>
                  </Box>
                  <Box p={1}>
                    <FileUpload
                      multiple
                      style={{
                        marginTop: 0,
                      }}
                      btnProps={{
                        variant: 'raised',
                        color: 'secondary',
                        disabled: isAdding,
                      }}
                      onFile={this.addPhotos}
                      accept={['jpg', 'JPG', 'jpeg', 'png']}
                    >
                      {isAdding ? 'Ajout en cours' : 'Ajouter'}
                    </FileUpload>
                  </Box>
                  <Box ml="auto">
                    <Text fs="1.2em">
                      {countImages} photo
                      {countImages !== 1 && 's'} sélectionnée
                      {countImages !== 1 && 's'}
                    </Text>
                  </Box>
                </Flex>
              )}
              <Flex flexWrap="wrap" style={{ marginTop: 30 }}>
                {images.map((img, index) => {
                  return (
                    <Box key={img.id} w={[1 / 2, 1 / 4, 1 / 5]} p={1}>
                      <LazyLoad
                        height="130px"
                        offsetTop={100}
                        placeholder={<ImagePlaceholder />}
                        once
                      >
                        <Flex
                          align="center"
                          justify="center"
                          flexDirection="column"
                          style={{ height: '100%' }}
                        >
                          <Link
                            to={{
                              pathname: '/gallery/' + gallery.id,
                              state: { imageId: img.id },
                            }}
                            style={{ width: '100%' }}
                          >
                            <ThumbnailAnimation src={img.thumbUrl}>
                              {loaded => (
                                <Fade in={loaded} timeout={500}>
                                  <Image w="100%" src={img.thumbUrl} />
                                </Fade>
                              )}
                            </ThumbnailAnimation>
                          </Link>
                          {shouldEdit && (
                            <Edit img={img} onSelect={this.selectPhotoEdit} />
                          )}
                        </Flex>
                      </LazyLoad>
                    </Box>
                  );
                })}
              </Flex>
            </div>
          )}
          <Popup
            title="Suppression"
            description="Attention si vous supprimez toutes les photos, le post sera lui aussi supprimé !"
            open={this.state.deleteEnabled}
            onRespond={this.deleteGallery}
          />
        </Loader>

        <FullScreenGallery
          index={galleryIndex}
          visible={galleryOpen}
          images={images}
          onEscKey={this.hideGallery}
        />
      </FluidContent>
    );
  }
}
