// @flow

import React from 'react';

import { Box, Flex } from 'grid-styled';

import { Link } from 'react-router-dom';

import { ProfileImage, Subtitle, Title } from '../common';
import * as authData from '../../data/auth';

import Time from '../Time';
import Author from '../Author';
import styled from 'styled-components';

const DynamicTitle = styled(Title)`
  padding-right: 10px;
  @media (max-width: 400px) {
    font-size: 1.1em;
  }
`;

export default function PostTitleView({ post }) {
  const dateFormat = 'Do MMMM YYYY [à] H[h]mm';
  if (post.author.authorType === 'student') {
    return (
      <Flex align="center" mb="10px">
        <Box mr="10px">
          <ProfileImage src={post.author.photoUrl} sz="40px" />
        </Box>
        <Box>
          {authData.isLoggedIn() ? (
            <Link to={`/annuaire/${post.author.id}`}>
              <Title fontSize={1} invert>
                {post.author.firstname} {post.author.lastname}
              </Title>
            </Link>
          ) : (
            <Title fontSize={1} invert>
              {post.author.firstname} {post.author.lastname}
            </Title>
          )}
          <Subtitle>
            Publié le <Time date={post.creationDate} format={dateFormat} />
          </Subtitle>
        </Box>
      </Flex>
    );
  }
  return (
    <Flex mb="10px">
      <Link to={`/post/${post.id}`}>
        <Box>
          {post.title && (
            <DynamicTitle fontSize={2} invert>
              {post.title}
            </DynamicTitle>
          )}
          <Subtitle>
            Publié le <Time date={post.creationDate} format={dateFormat} />
          </Subtitle>
        </Box>
      </Link>
      <Box ml="auto">
        <Author data={post.author} />
      </Box>
    </Flex>
  );
}
