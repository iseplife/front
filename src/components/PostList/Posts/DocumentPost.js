// @flow

import React, { Component } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import { Box } from 'grid-styled';
import styled from 'styled-components';
import { backUrl } from '../../../config';

import { Post } from 'components/PostList';

import { Paper } from 'components/common';

const Background = styled.div`
  background: linear-gradient(
    to bottom right,
    ${({ theme }) => theme.main},
    ${({ theme }) => theme.accent}
  );
  height: 100%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FileLogo = styled.img`
  width: 90px;
  margin-bottom: 10px;
`;

const FileName = styled.h2`
  font-size: 1.3em;
  font-weight: 500;
  color: white;
  margin: 0;
`;

class DocumentPost extends Component {
  render() {
    const props = this.props;
    const size = props.preview ? [1] : [1, 1 / 2];
    return (
      <Post invert={props.invert}>
        <Box w={size}>
          <Paper style={{ height: '100%' }}>
            <Background>
              <a href={backUrl + props.post.media.path}>
                <Tooltip title={props.post.media.originalName} placement="top">
                  <FileLogo src="/img/svg/file-upload.svg" />
                </Tooltip>
              </a>
              <FileName>{props.post.media.name}</FileName>
            </Background>
          </Paper>
        </Box>
        {props.textView(size)}
      </Post>
    );
  }
}

export default DocumentPost;
