// @flow

import React from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';

import ArrRight from '@material-ui/icons/ChevronRight';
import ArrLeft from '@material-ui/icons/ChevronLeft';

import Transition from 'react-transition-group/Transition';

const Controls = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
`;

const Control = styled.div`
  position: absolute;
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
`;
const ImageList = styled.div`
  position: relative;
  display: block;
  overflow: hidden;
  height: ${props => props.h || '100%'};
  width: ${props => props.w || '100%'};
`;

const Image = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: ${props => props.coverMode};
  background-image: url(${props => props.img});
  background-repeat: no-repeat;
  overflow: hidden;
`;

class ImageLoader extends React.Component {
  state = {
    url: null,
    loadImage: null,
    loaded: false,
  };

  componentDidMount() {
    if (this.props.load) {
      this.setState({ loadImage: this.props.img });
    }
  }

  componentWillReceiveProps(props) {
    if (props.load) {
      this.setState({ loadImage: this.props.img });
    }
  }

  handleImageLoaded = () => {
    this.setState({ url: this.props.img, loaded: true });
  };

  handleImageErrored = () => {};

  render() {
    return (
      <span>
        <img
          src={this.state.loadImage}
          alt="loading"
          style={{ display: 'none' }}
          onLoad={this.handleImageLoaded}
          onError={this.handleImageErrored}
        />
        <span
          style={{
            transition: 'opacity .5s ease',
            opacity: this.state.loaded ? 1 : 0,
          }}
        >
          <Image {...this.props} img={this.state.url} />
        </span>
      </span>
    );
  }
}

const DIR_FORWARD = 1;
const DIR_BACKWARD = -1;

const transitionStyles = {
  entering: { opacity: 0, transform: 'scale(.9)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  // exiting: { opacity: 0, transform: 'scale(.4)' },
};

const ImageTransition = props => (
  <Transition in={props.in} timeout={props.duration}>
    {state => (
      <ImageLoader
        load={props.shouldLoad}
        coverMode={props.coverMode}
        style={{
          transition: `all ${props.duration}ms ease`,
          opacity: 0,
          ...transitionStyles[state],
        }}
        img={props.image}
      />
    )}
  </Transition>
);

type SlideShowState = {
  pos: number,
  animEnabled: boolean,
  direction: number,
};

type SlideShowProps = {
  duration: number,
  initPos: number,
  auto: boolean,
  handleKey: boolean,
  play: boolean,
  loop: boolean,
  showControls: boolean,
  coverMode: boolean,
  items: any[],
  onChange: (newPos: number) => mixed,
};

export default class SlideShow extends React.Component<
  SlideShowProps,
  SlideShowState
> {
  state = {
    pos: 0,
    animEnabled: true,
    direction: DIR_FORWARD,
  };

  task: any;

  getDuration() {
    return (this.props.duration || 5) * 1000 + 500;
  }

  componentDidMount() {
    if (this.props.auto) {
      this.autoSlide();
    }

    if (this.props.initPos) {
      this.setState({ pos: this.props.initPos });
    }

    document.addEventListener('keydown', this.handleKey);
  }

  componentWillReceiveProps(props: SlideShowProps) {
    if (props.play === true) {
      this.autoSlide();
    }
    if (props.play === false) {
      if (this.task) clearInterval(this.task);
    }
  }

  componentWillUnmount() {
    if (this.task) {
      clearInterval(this.task);
    }
    document.removeEventListener('keydown', this.handleKey);
  }

  handleKey = ({ key }: KeyboardEvent) => {
    if (this.props.handleKey) {
      const { pos } = this.state;
      switch (key) {
        case 'ArrowRight':
          this.goTo(pos + 1, DIR_FORWARD);
          break;
        case 'ArrowLeft':
          this.goTo(pos - 1, DIR_BACKWARD);
          break;
        default:
          break;
      }
    }
  };

  handleArrow = (direction: number) => () => {
    const { pos } = this.state;
    this.goTo(pos + direction, direction);
  };

  autoSlide() {
    if (this.task) clearInterval(this.task);
    this.task = setInterval(() => {
      const { pos } = this.state;
      this.goTo(pos + 1, DIR_FORWARD);
    }, this.getDuration());
  }

  goTo(targetPos: number, direction: number) {
    const { items, loop } = this.props;

    if (targetPos > items.length - 1) {
      if (loop) {
        this.updatePos(0);
      }
      return;
    }

    if (targetPos < 0) {
      if (loop) {
        this.updatePos(items.length - 1);
      }
      return;
    }

    this.updatePos(targetPos);
  }

  updatePos(newPos: number) {
    this.setState({ pos: newPos });
    if (this.props.onChange) {
      this.props.onChange(newPos);
    }
  }

  shouldLoadImage(imgPos: number) {
    const { pos } = this.state;
    return Math.abs(imgPos - pos) < 3;
  }

  render() {
    const { showControls, items } = this.props;
    const { pos } = this.state;
    return (
      <ImageList>
        {showControls && (
          <Controls>
            <Control>
              {pos !== 0 && (
                <IconButton onClick={this.handleArrow(DIR_BACKWARD)}>
                  <ArrLeft style={{ color: 'white' }} />
                </IconButton>
              )}
            </Control>
            <Control style={{ right: 0 }}>
              {pos !== items.length - 1 && (
                <IconButton onClick={this.handleArrow(DIR_FORWARD)}>
                  <ArrRight style={{ color: 'white' }} />
                </IconButton>
              )}
            </Control>
          </Controls>
        )}
        {items.map((img, key) => {
          return (
            <ImageTransition
              key={key}
              in={key === pos}
              shouldLoad={this.shouldLoadImage(key)}
              coverMode={this.props.coverMode}
              duration={200}
              image={img}
            />
          );
        })}
      </ImageList>
    );
  }
}
