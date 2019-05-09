// @flow

import React, { Component } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { Box } from 'grid-styled';
import styled from 'styled-components';

import { Post } from 'components/PostList';

import CountDown from '../../Time/CountDown';
import Time from '../../Time';

import { Link } from 'react-router-dom';

import { BgImage, Paper } from 'components/common';

const Background = styled.div`
  background: rgba(63, 80, 181, 0.9);
  padding: 50px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const FileLogo = styled.img`
  width: 90px;
  margin-bottom: 10px;
`;

const EventTitle = styled.h2`
  font-size: 1.3em;
  color: white;
  margin: 0 5px;
`;

const Location = styled.h3`
  font-size: .7em;
  color: white;
  margin: 0 5px;
`;


export default class EventPost extends Component {
  render() {
    const props = this.props;
    const size = props.preview ? [1] : [1, 1 / 2];
    return (
      <Post invert={props.invert}>
        <Box w={size}>
          <Paper style={{ height: '100%' }}>
            <BgImage src={props.post.media.imageUrl}>
              <Background>
                <Link to={`/evenements/${props.post.media.id}`}>
                  <Tooltip title="Afficher l'évenement" placement="top">
                    <FileLogo src="/img/svg/event.svg" />
                  </Tooltip>
                </Link>
                <EventTitle>{props.post.media.title}</EventTitle>
                <CountDown date={props.post.media.date} fs="1.2em" endDisplay={
                  <Time date={props.post.media.date} format="Do MMMM YYYY [à] HH:mm" />
                } />
                <Location>{props.post.media.location}</Location>
              </Background>
            </BgImage>
          </Paper>
        </Box>
        {props.textView(size)}
      </Post>
    );
  }
}
