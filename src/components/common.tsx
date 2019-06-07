import Button from '@material-ui/core/Button';
import * as React from 'react';
import styled from 'styled-components';
import { backUrl } from '../config';

type SeparatorProps = { m?: string };
export const Separator = styled.div`
  width: 100%;
  height: 0;
  border-top: 4px dashed ${props => props.theme.accent};
  margin-bottom: ${(props: SeparatorProps) => props.m || '50px'};
`;

type FillerProps = { h: number };
export const Filler = styled.div`
  min-height: ${(props: FillerProps) => props.h}px;
`;

type FluidContentProps = { w?: number; p?: string; mh?: string };
export const FluidContent = styled.div`
  max-width: ${(props: FluidContentProps) => props.w || '1100'}px;
  margin: 0 auto;
  padding: ${(props: FluidContentProps) => props.p || '50px'};
  position: relative;
  min-height: ${({ mh }: FluidContentProps) => mh || 0};

  @media (max-width: 40em) {
    padding: 5%;
  }
`;

type HeaderProps = { url: string };
export const Header = styled.header`
  background: url(${(props: HeaderProps) => props.url});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  padding: 20px;
  text-align: center;
`;

export const SearchBar = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  font-size: 20px;
  border-radius: 20px;
  padding: 8px 25px;
  font-family: 'Roboto';
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

export const Banner = styled.div`
  background: rgba(27, 56, 142, 0.7);
  text-align: center;
  padding: 30px;
  margin: 0 -20px;
  margin-bottom: 50px;

  > h1 {
    font-size: 2em;
    font-weight: normal;
    margin: 0;
    margin-bottom: 10px;
    color: white;
  }

  > p {
    color: ${props => props.theme.accent};
    font-size: 1em;
    margin-bottom: 0;
  }
`;

// const ImageStyle = styled.img`
//   width: ${props => props.w};
//   margin-left: ${props => props.ml || 'auto'};
//   vertical-align: middle;
// `;

type ImageStyleProps = {
  src?: string | null;
  alt: string;
  style?: React.CSSProperties;
  w?: number | string;
  ml?: string;
  mh?: string;
  h?: number | string;
};
class ImageStyle extends React.Component<ImageStyleProps> {
  state = {
    loaded: false,
  };

  componentDidMount() {
    const hdLoaderImg = new (window as any).Image();

    hdLoaderImg.src = this.props.src;

    hdLoaderImg.onload = () => {
      this.setState({ loaded: true });
    };
  }

  render() {
    if (this.state.loaded) {
      return (
        <img
          alt=""
          {...this.props}
          style={{
            ...this.props.style,
            width: this.props.w,
            marginLeft: this.props.ml || 'auto',
            verticalAlign: 'middle',
          }}
          src={this.props.src || ''}
        />
      );
    }
    return (
      <div
        style={{
          background: '#EEE',
          height: this.props.h || 130,
          width: this.props.w,
          marginLeft: this.props.ml || 'auto',
          verticalAlign: 'middle',
        }}
      />
    );
  }
}

export const Image: React.FC<ImageStyleProps> = props => (
  <ImageStyle {...props} src={props.src && backUrl + props.src} />
);

export const BgImageProfileStyle: React.FC<ImageStyleProps> = props => (
  <div
    style={{
      backgroundImage: `url(${props.src})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: props.w,
      height: props.h || props.w,
      marginLeft: props.ml || 'auto',
      minHeight: props.mh || '100%',
    }}
  />
);

export const ProfileImage: React.FC<ImageStyleProps> = props => {
  const src = props.src ? backUrl + props.src : '/img/svg/user.svg';
  return <BgImageProfileStyle {...props} src={src} />;
};

type BgImageStyleProps = { src?: string | null; size?: string; mh?: string };
const BgImageStyle = styled.div`
  background: url(${(props: BgImageStyleProps) => props.src || ''});
  background-repeat: no-repeat;
  background-size: ${(props: BgImageStyleProps) => props.size || 'cover'};
  background-position: center;
  width: 100%;
  height: 100%;
  min-height: ${(props: BgImageStyleProps) => props.mh || '100%'};
`;

type BgImageProps = BgImageStyleProps & {
  defaultSrc?: string;
  local?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
};
export const BgImage: React.FC<BgImageProps> = props => {
  if (!props.src && props.defaultSrc) {
    return <BgImageStyle {...props} src={props.defaultSrc} />;
  }
  if (props.local) {
    return <BgImageStyle {...props} src={props.src} />;
  }
  return <BgImageStyle {...props} src={props.src && backUrl + props.src} />;
};

export const ImageLink: React.FC<{ src: string }> = props => {
  return <a href={backUrl + props.src}>{props.children}</a>;
};

type TextProps = { fs?: string; m?: string; mb?: number; color?: string };
export const Text = styled.p`
  font-size: ${(props: TextProps) => props.fs || '1em'};
  line-height: 1.2;
  margin: ${(props: TextProps) => props.m || 'auto'};
  margin-bottom: ${(props: TextProps) => props.mb || 0}em;
  color: ${(props: TextProps) => props.color || '#949494'};
`;

type TitleProps = {
  fontSize?: number;
  invert?: boolean;
  framed?: boolean;
  mb?: string;
};
export const Title = styled('h1')<TitleProps>`
  font-size: ${props => props.fontSize || 1}em;
  font-weight: 500;
  display: inline-block;
  color: ${props => (props.invert ? props.theme.main : props.theme.accent)};
  ${props =>
    props.framed &&
    `background: ${
      props.invert ? props.theme.accent : props.theme.main
    };`} margin: 0;
  margin-bottom: ${props => props.mb || '.5em'};
  padding: ${props => (props.framed ? '.3em .4em' : 0)};
`;

export const Subtitle = styled.h3`
  color: #9f9f9f;
  font-weight: normal;
  font-size: 15px;
  margin: 0;
`;

export class ScrollToTopOnMount extends React.PureComponent {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

const IframeWrap = styled.div`
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  padding-bottom: 56.25%;
  top: 50%;
  margin-top: -28.1%;

  > iframe {
    border: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

export const FacebookVideo: React.FC<{ url: string }> = props => {
  return (
    <IframeWrap>
      <iframe
        title="facebook-video"
        src={props.url}
        scrolling="no"
        allowTransparency
        allowFullScreen
      />
    </IframeWrap>
  );
};

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
`;

export const YoutubeVideo: React.FC<{ url: string }> = props => {
  return (
    <Iframe
      src={props.url}
      scrolling="no"
      allowTransparency
      allowFullScreen
      frameBorder="0"
    />
  );
};

const VideoStyle = styled.video`
  width: 100%;
  vertical-align: middle;
`;

export const Video: React.FC<{ url: string }> = props => {
  return <VideoStyle preload="preload" src={backUrl + props.url} controls />;
};

type PaperProps = { p?: string; mb?: number };
export const Paper = styled.div`
  box-shadow: 0 0px 15px rgba(0, 0, 0, 0.1);
  background: white;
  padding: ${({ p }: PaperProps) => p || 0};
  margin-bottom: ${({ mb }: PaperProps) => mb || 0};
`;

type FileUploadProps = {
  accept?: string[];
  multiple?: boolean;
  btnProps?: any;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onFile: (files: FileList | null) => any;
};

export const FileUpload: React.FC<FileUploadProps> = props => {
  const hash = new Date().getTime().toString(32);
  return (
    <div>
      <input
        id={hash}
        type="file"
        style={{ display: 'none' }}
        accept={
          props.accept ? props.accept.map(e => '.' + e).join(',') : undefined
        }
        multiple={props.multiple}
        onChange={e => props.onFile(e.target.files)}
      />
      <label htmlFor={hash}>
        <Button
          style={{
            marginTop: 10,
            ...props.style,
          }}
          component="span"
          color="secondary"
          {...props.btnProps}
        >
          {props.children}
        </Button>
      </label>
    </div>
  );
};

type ImageLoaderProps = {
  src: string;
  load?: boolean;
  coverMode: string;
  style?: React.CSSProperties;
  onError?: (error: Error) => void;
};
export class ImageLoader extends React.Component<ImageLoaderProps> {
  state = {
    url: '',
    loadImage: '',
    loaded: false,
  };

  getUrl() {
    return backUrl + this.props.src;
  }

  componentDidMount() {
    if (this.props.load) {
      this.setState({ loadImage: this.getUrl() });
    }
  }

  componentDidUpdate(prevProps: ImageLoaderProps) {
    if (this.props.load !== prevProps.load) {
      if (this.props.load) {
        this.setState({ loadImage: this.getUrl() });
      }
    }
  }

  handleImageLoaded = () => {
    this.setState({ url: this.getUrl(), loaded: true });
  };

  handleImageErrored = () => {
    if (this.props.onError) {
      this.props.onError(new Error('could not load image: ' + this.getUrl()));
    }
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          transition: 'opacity .5s ease',
          opacity: this.state.loaded ? 1 : 0,
        }}
      >
        <img
          src={this.state.loadImage}
          alt="loading"
          style={{ display: 'none' }}
          onLoad={this.handleImageLoaded}
          onError={this.handleImageErrored}
        />
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: this.props.coverMode,
            backgroundImage: `url(${this.state.url})`,
            backgroundRepeat: 'no-repeat',
            overflow: 'hidden',
            ...this.props.style,
          }}
        />
      </div>
    );
  }
}
