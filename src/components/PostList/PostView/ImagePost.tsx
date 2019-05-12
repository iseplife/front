import { Box } from '@rebass/grid';
import React from 'react';
import { PostViewProps } from '.';
import { Post } from '..';
import { Image } from '../../../data/media/type';
import { BgImage, Paper } from '../../common';

class ImagePost extends React.Component<PostViewProps> {
  render() {
    const { preview, post, invert, textView, openFullScreen } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    const media = post.media as Image;
    return (
      <Post invert={invert}>
        <Box width={size}>
          <Paper style={{ height: '100%' }}>
            <BgImage
              onClick={() => {
                if (!preview && openFullScreen) {
                  openFullScreen(true, post.media);
                }
              }}
              style={{ cursor: !preview ? 'pointer' : 'normal' }}
              src={preview ? media.fullSizeUrl : media.thumbUrl}
              mh={preview ? '400px' : '250px'}
            />
          </Paper>
        </Box>
        {textView(size)}
      </Post>
    );
  }
}

export default ImagePost;
