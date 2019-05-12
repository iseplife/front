import Tooltip from '@material-ui/core/Tooltip';
import { Box } from '@rebass/grid';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Post } from '..';
import { BgImage, Paper } from '../../common';
import Time from '../../Time';
import CountDown from '../../Time/CountDown';
import { PostViewProps } from '.';
import { Event } from '../../../data/media/type';

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
  font-size: 0.7em;
  color: white;
  margin: 0 5px;
`;

export default class EventPost extends Component<PostViewProps> {
  render() {
    const { preview, post, invert, textView } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    const media = post.media as Event;
    return (
      <Post invert={invert}>
        <Box width={size}>
          <Paper style={{ height: '100%' }}>
            <BgImage src={media.imageUrl}>
              <Background>
                <Link to={`/evenements/${media.id}`}>
                  <Tooltip title="Afficher l'évenement" placement="top">
                    <FileLogo src="/img/svg/event.svg" />
                  </Tooltip>
                </Link>
                <EventTitle>{media.title}</EventTitle>
                <CountDown
                  date={media.date}
                  fs="1.2em"
                  endDisplay={
                    <Time date={media.date} format="Do MMMM YYYY [à] HH:mm" />
                  }
                />
                <Location>{media.location}</Location>
              </Background>
            </BgImage>
          </Paper>
        </Box>
        {textView(size)}
      </Post>
    );
  }
}
