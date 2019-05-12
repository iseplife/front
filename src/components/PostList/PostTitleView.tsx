import { Box, Flex } from '@rebass/grid';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as authData from '../../data/auth';
import { Post } from '../../data/post/type';
import { Student } from '../../data/users/type';
import Author from '../Author';
import { ProfileImage, Subtitle, Title } from '../common';
import Time from '../Time';

const DynamicTitle = styled(Title)`
  padding-right: 10px;
  @media (max-width: 400px) {
    font-size: 1.1em;
  }
`;

type PostTitleViewProps = {
  post: Post;
};
const PostTitleView: React.FC<PostTitleViewProps> = ({ post }) => {
  const dateFormat = 'Do MMMM YYYY [à] H[h]mm';
  if (post.author.authorType === 'student') {
    const student = post.author as Student;
    return (
      <Flex alignItems="center" mb="10px">
        <Box mr="10px">
          <ProfileImage src={student.photoUrl} alt="" w="40px" />
        </Box>
        <Box>
          {authData.isLoggedIn() ? (
            <Link to={`/annuaire/${student.id}`}>
              <Title fontSize={1} invert>
                {student.firstname} {student.lastname}
              </Title>
            </Link>
          ) : (
            <Title fontSize={1} invert>
              {student.firstname} {student.lastname}
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
};

export default PostTitleView;
