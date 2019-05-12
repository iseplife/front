import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FileDownload from '@material-ui/icons/CloudDownload';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import SlideShow from '../../components/SlideShow';
import { backUrl } from '../../config';
import React, { Component } from 'react';
import styled from 'styled-components';
import Auth from '../Auth/AuthComponent';
import PeopleMatcher from './PeopleMatcher';
import { Image } from '../../data/media/type';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  top: 0;
  left: 0;
  z-index: 1100;
  overflow: auto;
`;

const GalleryStyle = styled.div`
  position: relative;
  height: 80vh;
  margin: 5vh;
`;

interface GalleryProps {
  visible?: boolean;
  index: number;
  images: Image[];
  onEscKey: () => void;
}
interface GalleryState {
  currentIndex: number;
  matcherOpen: boolean;
  isPlaying: boolean;
}

class Gallery extends Component<GalleryProps, GalleryState> {
  state: GalleryState = {
    currentIndex: 0,
    matcherOpen: false,
    isPlaying: false,
  };

  componentWillUnmount() {
    this.removeEscListener();
  }

  openMatcher = (open: boolean) => {
    this.setState({ matcherOpen: open });
  };

  removeEscListener() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  componentDidUpdate(prevProps: GalleryProps) {
    if (prevProps.visible !== this.props.visible) {
      if (!this.props.visible) {
        this.removeEscListener();
        this.setState({ isPlaying: false });
      } else {
        document.addEventListener('keydown', this.keyHandler);
      }
    }

    document.body.style.overflow = this.props.visible ? 'hidden' : 'auto';

    if (this.props.index !== this.state.currentIndex) {
      this.setState({ currentIndex: this.props.index });
    }
  }

  keyHandler = ({ key }: KeyboardEvent) => {
    if (key === 'Escape' && !this.state.matcherOpen) {
      this.props.onEscKey();
    }
  };

  updateIndex = (index: number) => {
    this.setState({ currentIndex: index });
  };

  togglePlay = () => {
    this.setState({ isPlaying: !this.state.isPlaying });
  };

  render() {
    const lightButton = {
      color: 'white',
      background: 'rgba(255,255,255,0.1)',
      marginRight: 10,
    };

    const { visible, images, index } = this.props;
    if (!visible) return null;
    return (
      <Wrapper>
        <IconButton
          style={{
            float: 'right',
            top: 20,
            right: 20,
            zIndex: 3,
          }}
          onClick={() => this.props.onEscKey()}
        >
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
        <GalleryStyle>
          <SlideShow
            handleKey
            showControls
            play={this.state.isPlaying}
            coverMode="contain"
            initPos={index}
            onChange={this.updateIndex}
            items={images.map(img => backUrl + img.fullSizeUrl)}
            duration={5}
          />
        </GalleryStyle>
        {images.length > 0 && (
          <div style={{ margin: 30 }}>
            <Button
              style={lightButton}
              download
              size="small"
              href={backUrl + images[this.state.currentIndex].originalUrl}
            >
              <FileDownload style={{ marginRight: 5 }} /> Télecharger
            </Button>
            {this.state.isPlaying ? (
              <Button
                style={lightButton}
                size="small"
                onClick={this.togglePlay}
              >
                <PauseIcon style={{ marginRight: 5 }} /> Pause
              </Button>
            ) : (
              <Button
                style={lightButton}
                size="small"
                onClick={this.togglePlay}
              >
                <PlayIcon style={{ marginRight: 5 }} /> Lecture
              </Button>
            )}
            {!this.state.isPlaying && (
              <Auth logged>
                <PeopleMatcher
                  onOpenMatcher={this.openMatcher}
                  image={images[this.state.currentIndex]}
                />
              </Auth>
            )}
          </div>
        )}
      </Wrapper>
    );
  }
}

export default Gallery;
