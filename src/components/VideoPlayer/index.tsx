import IconButton from '@material-ui/core/IconButton';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import MuteIcon from '@material-ui/icons/VolumeOff';
import SoundIcon from '@material-ui/icons/VolumeUp';
import React, { Component } from 'react';
import styled from 'styled-components';
import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';
import { backUrl } from '../../config';

const Controls = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  transition: opacity 1s ease;
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(10px);
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
  }

  ${Controls} {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
`;

const PlayPause = styled.div``;

const ProgressBar = styled.div`
  border-radius: 20px;
  height: 20px;
  background: red;
`;

const ProgressSlider = styled.input`
  position: relative;
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 10px;
    background: ${props => props.theme.main};
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.4); */
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const RangeStyle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0 10px;
`;

const Abs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const btnStyle = {
  color: MAIN_COLOR,
};

const Duration = styled.div`
  width: 50px;
  font-size: 14px;
  color: ${props => props.theme.main};
`;

const BackgroundRangeBar = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: white;
  margin: 0 5px;
  overflow: hidden;
`;

const RangeBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: ${props => props.theme.accent};
`;

interface RangeProps {
  currentTime: number;
  vidLength: number;
  seekVideo: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Range: React.FC<RangeProps> = props => {
  const width = (props.currentTime * 100) / props.vidLength + '%';
  return (
    <RangeStyle>
      <Abs>
        <BackgroundRangeBar>
          <RangeBar style={{ width }} />
        </BackgroundRangeBar>
      </Abs>
      <ProgressSlider
        type="range"
        min={0}
        max={props.vidLength}
        step={0.01}
        value={props.currentTime}
        onChange={props.seekVideo}
      />
    </RangeStyle>
  );
};

function pad(n: number, width: number): string {
  const number = String(n);
  return number.length >= width
    ? number
    : new Array(width - number.length + 1).join('0') + number;
}

const LargePlayBtn: React.FC<{ huge: boolean }> = props => (
  <img
    style={{ width: props.huge ? 140 : 90, cursor: 'pointer' }}
    src="/img/svg/play.svg"
    alt="play"
  />
);

interface VideoPlayerProps {
  source: string;
  poster?: string;
  preload?: string;
  hugePlayButton?: boolean;
}

type VideoPlayerState = {
  isPlaying: boolean;
  vidLength: number;
  currentTime: number;
  showControls: boolean;
  started: boolean;
  mute: boolean;
};

class VideoPlayer extends Component<VideoPlayerProps, VideoPlayerState> {
  state: VideoPlayerState = {
    started: false,
    isPlaying: false,
    vidLength: 0,
    currentTime: 0,
    showControls: true,
    mute: false,
  };

  video?: HTMLVideoElement | null;

  componentDidMount() {
    if (this.video && this.video.canPlayType) {
      this.video.controls = false;
      this.video.addEventListener('loadedmetadata', () => {
        if (this.video) {
          this.setState({ vidLength: this.video.duration });
        }
      });

      this.video.addEventListener('timeupdate', () => {
        if (this.video) {
          this.setState({ currentTime: this.video.currentTime });
        }
      });

      this.video.addEventListener('ended', () => {
        this.setState({ isPlaying: false });
      });
    }
  }

  togglePlay = () => {
    if (this.video!.paused || this.video!.ended) {
      this.video!.play();
      this.setState({ isPlaying: true });
      this.hideControls();
    } else {
      this.setState({ isPlaying: false });
      this.video!.pause();
    }
  };

  seekVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value);
    this.video!.currentTime = time;
    this.setState({ currentTime: time });
  };

  hideControls() {
    setTimeout(() => {
      if (this.state.isPlaying) {
        this.setState({
          showControls: false,
        });
      }
    }, 2000);
  }

  onHover = () => {
    this.setState({
      showControls: true,
    });
  };

  onMouseLeave = () => {
    this.hideControls();
  };

  toggleFullscreen = () => {
    const videoEl = this.video!.parentElement as any;
    const document = window.document as any;
    if (videoEl) {
      videoEl.requestFullscreen =
        videoEl.requestFullscreen ||
        videoEl.msRequestFullscreen ||
        videoEl.mozRequestFullScreen ||
        videoEl.webkitRequestFullscreen;
      document.exitFullscreen =
        document.exitFullscreen ||
        document.msExitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen;
      const fullscreenElement =
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      if (fullscreenElement === videoEl) {
        document.exitFullscreen();
      } else {
        videoEl.requestFullscreen();
      }
    }
  };

  toggleSound = () => {
    this.video!.muted = !this.state.mute;
    this.setState({
      mute: !this.state.mute,
    });
  };

  getDuration() {
    const { currentTime, vidLength } = this.state;
    const remaining = Math.round(vidLength - currentTime);
    const minutes = remaining > 60 ? Math.floor(remaining / 60) : 0;
    const seconds = Math.floor(remaining % 60);
    return `${pad(minutes, 2)}:${pad(seconds, 2)}`;
  }

  render() {
    const props = this.props;
    return (
      <Wrapper onMouseOver={this.onHover} onMouseLeave={this.onMouseLeave}>
        <video
          poster={props.poster && backUrl + props.poster}
          ref={v => (this.video = v)}
          controls
          preload={props.preload || 'auto'}
        >
          <source src={backUrl + props.source} type="video/mp4" />
        </video>
        {!this.state.started && (
          <Abs
            style={{
              justifyContent: 'center',
              // opacity: 0.9,
              // background: `linear-gradient(to bottom right, ${MAIN_COLOR}, ${SECONDARY_COLOR})`,
            }}
          >
            <div
              onClick={() => {
                this.togglePlay();
                this.setState({
                  started: true,
                });
              }}
            >
              {/* <LargePlayBtn huge={this.props.hugePlayButton} /> */}
              <PlayIcon
                style={{
                  color: SECONDARY_COLOR,
                  fontSize: 150,
                  cursor: 'pointer',
                }}
              />
            </div>
          </Abs>
        )}
        {this.state.started && (
          <Controls style={{ opacity: this.state.showControls ? 1 : 0 }}>
            <PlayPause onClick={this.togglePlay}>
              <IconButton>
                {this.state.isPlaying ? (
                  <PauseIcon style={btnStyle} />
                ) : (
                  <PlayIcon style={btnStyle} />
                )}
              </IconButton>
            </PlayPause>
            <Range
              vidLength={this.state.vidLength}
              currentTime={this.state.currentTime}
              seekVideo={this.seekVideo}
            />
            <Duration>{this.getDuration()}</Duration>
            <IconButton onClick={this.toggleSound}>
              {this.state.mute ? (
                <MuteIcon style={btnStyle} />
              ) : (
                <SoundIcon style={btnStyle} />
              )}
            </IconButton>
            <IconButton onClick={this.toggleFullscreen}>
              <FullScreenIcon style={btnStyle} />
            </IconButton>
          </Controls>
        )}
      </Wrapper>
    );
  }
}

export default VideoPlayer;
