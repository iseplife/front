import { Box, Flex } from '@rebass/grid';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PostViewProps } from '.';
import { Gallery } from '../../../data/media/type';
import { Post } from '..';
import { Paper, Title, Image } from '../../common';
import styled from 'styled-components';

const ViewMore = styled.div`
  width: 100%;
  height: 90px;
  font-size: 3em;
  display: flex;
  background: #eee;
  align-items: center;
  justify-content: center;
  font-weight: normal;
  color: #888;
`;

class GalleryPost extends React.Component<PostViewProps> {
  render() {
    const { preview, post, invert, textView } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    const imageSize = preview ? [1 / 2, 1 / 4, 1 / 6] : [1 / 3];
    const gallery = post.media as Gallery;
    const galleryOrder = preview ? 2 : 1;
    const images = preview
      ? gallery.previewImages
      : gallery.previewImages.slice(0, 6);
    return (
      <Post invert={invert}>
        <Box width={size} order={galleryOrder}>
          <Paper style={{ height: '100%', padding: '2em' }}>
            <div>
              <Title invert fontSize={1}>
                GALERIE
              </Title>
            </div>
            <Link to={`/gallery/${gallery.id}`}>
              <Title>{gallery.name}</Title>
            </Link>
            <Flex flexWrap="wrap">
              {images.map(img => {
                return (
                  <Box key={img.id} width={imageSize} p={1}>
                    <Flex alignItems="center" style={{ height: '100%' }}>
                      <Link
                        to={{
                          pathname: '/gallery/' + gallery.id,
                          state: { imageId: img.id },
                        }}
                      >
                        <Image
                          w="100%"
                          alt=""
                          src={img.thumbUrl}
                          style={{ cursor: 'pointer' }}
                        />
                      </Link>
                    </Flex>
                  </Box>
                );
              })}
              {preview && (
                <Box width={imageSize} p={1}>
                  <Flex alignItems="center" style={{ height: '100%' }}>
                    <Link
                      to={`/gallery/${gallery.id}`}
                      style={{ width: '100%' }}
                    >
                      <ViewMore>+</ViewMore>
                    </Link>
                  </Flex>
                </Box>
              )}
            </Flex>
          </Paper>
        </Box>
        {textView(size)}
      </Post>
    );
  }
}

export default GalleryPost;
