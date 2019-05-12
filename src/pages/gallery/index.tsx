import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Fade from '@material-ui/core/Fade';
import { Box, Flex } from '@rebass/grid';
import React from 'react';
import LazyLoad from 'react-lazyload';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import {
  FileUpload,
  FluidContent,
  Image,
  ScrollToTopOnMount,
  Text,
  Title,
} from '../../components/common';
import FullScreenGallery from '../../components/FullScreen/Gallery';
import Loader from '../../components/Loader';
import Time from '../../components/Time';
import { backUrl } from '../../config';
import { ADMIN, POST_MANAGER } from '../../constants';
import * as authData from '../../data/auth';
import * as mediaData from '../../data/media/image';
import * as postData from '../../data/post';
import * as mediaTypes from '../../data/media/type';

const ImagePlaceholder = styled.div`
  background: #eee;
  height: 130;
`;
type EditProps = {
  onSelect: (img: mediaTypes.Image) => () => void;
  img: mediaTypes.Image;
};
const Edit: React.FC<EditProps> = props => {
  return (
    <div style={{ marginBottom: 10 }}>
      <Checkbox onChange={props.onSelect(props.img)} />
    </div>
  );
};

type ThumbnailAnimationProps = {
  src: string;
  children(props: boolean): React.ReactNode;
};
type ThumbnailAnimationState = {
  loaded: boolean;
};

class ThumbnailAnimation extends React.Component<
  ThumbnailAnimationProps,
  ThumbnailAnimationState
> {
  state: ThumbnailAnimationState = {
    loaded: false,
  };

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    const img = new (window as any).Image();
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
type GalleryPageProps = RouteComponentProps<{ id: string }>;
type GalleryPageState = {
  isLoading: boolean;
  gallery: mediaTypes.Gallery | null;
  galleryOpen: boolean;
  galleryIndex: number;
  images: mediaTypes.Image[];
  selectedImages: number[];
  isPostAuthor: boolean;
  isEditing: boolean;
  isAdding: boolean;
};

type GalleryPageRouteState = {
  imageId: number;
};

export default class GalleryPage extends React.Component<
  GalleryPageProps,
  GalleryPageState
> {
  state: GalleryPageState = {
    isLoading: false,
    gallery: null,
    galleryOpen: false,
    galleryIndex: 0,
    images: [],
    selectedImages: [],
    isPostAuthor: false,
    isEditing: false,
    isAdding: false,
  };

  galleryId?: number;
  photoId?: number;

  componentDidMount() {
    const { match, history } = this.props;
    this.galleryId = parseInt(match.params.id, 10);
    const routerState = history.location.state as GalleryPageRouteState;
    if (routerState) {
      this.photoId = routerState.imageId;
    }
    this.getGallery();
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  static getDerivedStateFromProps(
    props: GalleryPageProps,
    state: GalleryPageState
  ): Partial<GalleryPageState> | null {
    const routeState = props.history.location.state as GalleryPageRouteState;
    if (
      state.images.length > 0 &&
      routeState &&
      routeState.imageId !== state.galleryIndex
    ) {
      const photoId = routeState.imageId;
      const index = state.images.findIndex(e => e.id === photoId);

      return {
        galleryIndex: index,
        galleryOpen: true,
      };
    }
    return null;
  }

  componentDidUpdate() {
    console.log(this.props.location.state);
  }

  async getGallery() {
    if (this.galleryId) {
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
  }

  refreshGallery = () => {
    if (this.galleryId) {
      mediaData.getGalleryImages(this.galleryId).then(res => {
        this.setState({ images: res.data });
      });
    }
  };

  verifyAuthor = (postId: number) => {
    const user = authData.getUser();
    if (user) {
      postData.getPost(postId).then(res => {
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

  selectPhoto = (index: number) => {
    this.setState({ galleryIndex: index });
    this.showGallery();
  };

  selectPhotoEdit = (img: mediaTypes.Image) => () => {
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

  addPhotos = (photos: FileList | null) => {
    const { gallery } = this.state;
    if (gallery && photos) {
      this.setState({ isAdding: true });
      mediaData.addImages(gallery.id, photos).then(res => {
        this.refreshGallery();
        this.setState({ isAdding: false });
      });
    }
  };

  deletePhotos = () => {
    const { selectedImages, gallery } = this.state;
    if (gallery) {
      this.setState({ selectedImages: [] });
      mediaData.deleteImages(gallery.id, selectedImages).then(res => {
        this.refreshGallery();
      });
    }
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
              <Flex alignItems="center">
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
                <Flex alignItems="center">
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
                    <Box key={img.id} width={[1 / 2, 1 / 4, 1 / 5]} p={1}>
                      <LazyLoad
                        height="130px"
                        offset={[100, 0]}
                        placeholder={<ImagePlaceholder />}
                        once
                      >
                        <Flex
                          alignItems="center"
                          justifyContent="center"
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
                                  <Image w="100%" alt="" src={img.thumbUrl} />
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
