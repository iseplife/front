import { Box } from '@rebass/grid';
import React, { Component } from 'react';
import { PostViewProps } from '.';
import { Post } from '..';
import { Paper } from '../../common';
import { Video } from '../../../data/media/type';
import VideoPlayer from '../../VideoPlayer';

class VideoPost extends Component<PostViewProps> {
  render() {
    const { post, invert, preview, textView } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    const preload = preview ? 'auto' : 'metadata';
    const media = post.media as Video;
    return (
      <Post invert={invert}>
        <Box width={size}>
          <Paper style={{ height: '100%' }}>
            <VideoPlayer
              source={media.url}
              poster={media.poster}
              preload={preload}
            />
          </Paper>
        </Box>
        {textView(size)}
      </Post>
    );
  }
}

export default VideoPost;
