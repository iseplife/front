// @flow

import React from 'react';
import styled from 'styled-components';

import Time from 'components/Time';
import { Link } from 'react-router-dom';
import { Title, Text, BgImage } from 'components/common';

import { backUrl } from '../../config';

const Cell = styled.div`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AlbumStyle = styled(Cell)`
  .caption {
    padding: 10px;
    color: ${props => props.theme.main};
  }
`;

export const Album = props => {
  return (
    <AlbumStyle onClick={props.onClick}>
      <Link to={`/gallery/${props.id}`}>
        <BgImage src={props.url} mh="200px" />
      </Link>
      <div className="caption">
        <Title invert fontSize={1.3}>
          {props.name}
        </Title>
        <Text fs=".8em">
          <Time date={props.creation} format="Do MMMM YYYY" />
        </Text>
      </div>
    </AlbumStyle>
  );
};

const VideoStyle = styled(Cell)`
  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    opacity: ${props => (props.poster ? 0.8 : 1)};
    background: linear-gradient(
      to bottom right,
      ${props => props.theme.main},
      ${props => props.theme.accent}
    );
    color: white;
    font-size: 2em;
  }
  .image img {
    width: 80px;
  }
  .caption {
    padding: 10px;
    color: ${props => props.theme.main};
  }
`;

const Poster = styled.div`
  position: relative;
  height: 200px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

export const Video = props => {
  return (
    <VideoStyle poster={props.poster}>
      <Poster
        style={{
          background: props.poster ? `url(${backUrl + props.poster})` : null,
        }}
      >
        <div className="image">
          <img src="/img/svg/play.svg" alt="play" />
        </div>
      </Poster>
      <div className="caption">
        <Title invert fontSize={1.3}>
          {props.name}
        </Title>
        <Text fs=".8em">
          <Time date={props.creation} format="Do MMMM YYYY" />
        </Text>
      </div>
    </VideoStyle>
  );
};

const GazetteStyle = styled(Cell)`
  .image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    background: linear-gradient(
      to bottom right,
      ${props => props.theme.main},
      ${props => props.theme.accent}
    );
    color: white;
    font-size: 2em;
  }
  .image img {
    width: 80px;
  }
  .caption {
    padding: 10px;
    color: ${props => props.theme.main};
  }
`;
export const Gazette = props => {
  return (
    <GazetteStyle>
      <div className="image">
        <img src="/img/svg/gazette-icon.svg" alt="file" />
      </div>
      <div className="caption">
        <Title invert fontSize={1.3}>
          {props.title}
        </Title>
        <Text fs=".8em">
          <Time date={props.creation} format="Do MMMM YYYY" />
        </Text>
      </div>
    </GazetteStyle>
  );
};
