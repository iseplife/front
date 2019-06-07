import { Box } from '@rebass/grid';
import React, { Component } from 'react';
import { PostViewProps } from '.';
import { Post } from '..';
import Poll from '../../Poll';

class PollPost extends Component<PostViewProps> {
  render() {
    const { preview, invert, post, textView } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    return (
      <Post invert={invert}>
        <Box width={size}>
          <Poll data={post.media} />
        </Box>
        {textView(size)}
      </Post>
    );
  }
}

export default PollPost;
