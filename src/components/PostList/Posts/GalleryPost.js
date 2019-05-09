// @flow

import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled';
import { Link } from 'react-router-dom';

import { Post } from 'components/PostList';

import {
  Image,
  Paper,
  Title,
} from 'components/common';

class GalleryPost extends Component {

  render() {
    const props = this.props;
    const size = props.preview ? [1] : [1, 1 / 2];
    const imageSize = props.preview ? [1 / 2, 1 / 4, 1 / 6] : [1 / 3];
    const gallery = props.post.media;
    const galleryOrder = props.preview ? 2 : 1;
    const images = props.preview ? gallery.previewImages : gallery.previewImages.slice(0, 6);
    return (
      <Post invert={props.invert}>
        <Box w={size} order={galleryOrder} >
          <Paper style={{ height: '100%', padding: '2em' }}>
            <div>
              <Title invert fontSize={1}>GALERIE</Title>
            </div>
            <Link to={`/gallery/${gallery.id}`}>
              <Title>{gallery.name}</Title>
            </Link>
            <Flex flexWrap="wrap">
              {
                images.map((img, index) => {
                  return (
                    <Box key={img.id} w={imageSize} p={1}>
                      <Flex align="center" style={{ height: '100%' }}>
                        <Link to={{
                          pathname: '/gallery/' + gallery.id,
                          state: { imageId: img.id }
                        }}>
                          <Image w="100%" src={img.thumbUrl} style={{ cursor: 'pointer' }} />
                        </Link>
                      </Flex>
                    </Box>
                  );
                })
              }
              {
                props.preview &&
                <Box w={imageSize} p={1}>
                  <Flex align="center" style={{ height: '100%' }}>
                    <Link to={`/gallery/${gallery.id}`} style={{ width: '100%' }}>
                      <div style={{
                        width: '100%',
                        height: 90,
                        fontSize: '3em',
                        display: 'flex',
                        background: '#EEE',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'normal',
                        color: '#888',
                      }}>+</div>
                    </Link>
                  </Flex>
                </Box>
              }
            </Flex>
          </Paper>
        </Box>
        {props.textView(size)}
      </Post>
    );
  }
}

export default GalleryPost;
