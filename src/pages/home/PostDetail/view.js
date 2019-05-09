// @flow

import React from 'react';

import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import {
  FluidContent,
  Title,
  Paper,
  ProfileImage,
  ScrollToTopOnMount,
  Text,
} from 'components/common';

import { PostView, PostTextView } from '../../../components/PostList';
import Auth from '../../../components/Auth/AuthComponent';

import Loader from '../../../components/Loader';

import Comment from 'components/PostList/Comment';
import CommentBox from 'components/PostList/CommentBox';
import Popup from '../../../components/Popup';
import ModifyPostModal from '../../../components/PostList/ModifyPostModal';

const Background = styled.div`
  background: url(/img/background.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  position: relative;
`;

export default function PostDetailView(props) {
  return (
    <div>
      <ScrollToTopOnMount />
      <Background>
        <FluidContent>
          {
            !props.post &&
            <Paper>
              <Loader loading={true} />
            </Paper>
          }
          {
            props.post &&
            <PostView
              preview
              post={props.post}
              textView={(size) =>
                <PostTextView
                  preview
                  post={props.post}
                  w={size}
                  canPin={props.canPin}
                  refresh={props.refresh}
                  modify={props.modifyPost}
                  deletePost={props.reqDeletePost}
                />
              }
            />
          }
        </FluidContent>
      </Background>
      <FluidContent>
        <Title>Commentaires</Title>
        {
          props.comments.length === 0 &&
          <Text>Pas de commentaire(s) pour le moment !</Text>
        }
        {
          props.comments.map(c => {
            return <Comment
              key={c.id}
              comment={c}
              toggleLike={props.toggleLikeCom}
              showLikes={props.showLikes}
              onDelete={props.reqDeleteComment} />;
          })
        }
        <Auth logged>
          <Flex mt="30px">
            <Box>
              <ProfileImage
                src={props.commenter && props.commenter.photoUrlThumb}
                sz="60px"
                mh="auto" />
            </Box>
            <Box flex="1 1 auto" ml="20px">
              <CommentBox onComment={props.onComment} />
            </Box>
          </Flex>
        </Auth>
      </FluidContent>
      <ModifyPostModal
        post={props.post}
        open={props.modifyEnable}
        refresh={props.refresh}
        modifyPost={props.modifyPost}
        requestClose={props.requestClose} />
      <Popup
        title="Suppression commentaire"
        description="Voulez vous supprimer ce commentaire ?"
        open={props.openDeleteComm}
        onRespond={props.deleteComment} />
      <Popup
        title="Suppression post"
        description="Voulez vous supprimer cette publication ?"
        open={props.openDeletePost}
        onRespond={props.deletePost} />
    </div>
  );
}
