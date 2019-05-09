// @flow

import React, { Component } from 'react';
import { Box } from 'grid-styled';
import { Post } from 'components/PostList';

import { Video, Paper } from 'components/common';
import VideoPlayer from 'components/Video';

class VideoPost extends Component {
  render() {
    const props = this.props;
    const size = props.preview ? [1] : [1, 1 / 2];
    const preload = props.preview ? 'auto' : 'metadata';
    return (
      <Post invert={props.invert}>
        <Box w={size}>
          <Paper style={{ height: '100%' }}>
            {/* <Video url={props.post.media.url} /> */}
            <VideoPlayer
              source={props.post.media.url}
              poster={props.post.media.poster}
              preload={preload}
            />
          </Paper>
        </Box>
        {props.textView(size)}
      </Post>
    );
  }
}

export default VideoPost;
