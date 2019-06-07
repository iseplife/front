import Tooltip from '@material-ui/core/Tooltip';
import { Box } from '@rebass/grid';
import React, { Component } from 'react';
import styled from 'styled-components';
import { backUrl } from '../../../config';
import { PostViewProps } from '.';
import { Gazette } from '../../../data/media/type';
import { Paper } from '../../common';
import { Post } from '..';

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

class GazettePost extends Component<PostViewProps> {
  render() {
    const { preview, invert, post, textView } = this.props;
    const size = preview ? [1] : [1, 1 / 2];
    const media = post.media as Gazette;
    return (
      <Post invert={invert}>
        <Box width={size}>
          <Paper style={{ height: '100%' }}>
            <Background>
              <a href={backUrl + media.url}>
                <Tooltip title="Télécharger la gazette" placement="top">
                  <FileLogo src="/img/svg/gazette-icon.svg" />
                </Tooltip>
              </a>
              <FileName>{media.title}</FileName>
            </Background>
          </Paper>
        </Box>
        {textView(size)}
      </Post>
    );
  }
}

export default GazettePost;
