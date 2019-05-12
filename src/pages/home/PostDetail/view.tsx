import { Box, Flex } from '@rebass/grid';
import { AxiosPromise } from 'axios';
import React from 'react';
import styled from 'styled-components';
import Auth from '../../../components/Auth/AuthComponent';
import {
  FluidContent,
  Paper,
  ProfileImage,
  ScrollToTopOnMount,
  Text,
  Title,
} from '../../../components/common';
import Loader from '../../../components/Loader';
import Popup from '../../../components/Popup';
import { PostTextView } from '../../../components/PostList';
import Comment from '../../../components/PostList/Comment';
import CommentBox from '../../../components/PostList/CommentBox';
import ModifyPostModal from '../../../components/PostList/ModifyPostModal';
import { PostView } from '../../../components/PostList/PostView';
import { Comment as CommentType, Post } from '../../../data/post/type';
import { Student } from '../../../data/users/type';

const Background = styled.div`
  background: url(/img/background.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  position: relative;
`;

interface PostDetailViewProps {
  post: Post | null;
  comments: CommentType[];
  commenter: Student | null;
  canPin?: boolean;
  modifyEnable?: boolean;
  openDeleteComm?: boolean;
  openDeletePost?: boolean;
  showLikes: (likeId: number) => AxiosPromise<Student[]>;
  refresh: () => void;
  modifyPost: (postModified: Post) => void;
  reqDeletePost: () => void;
  toggleLikeCom: (comId: number) => void;
  reqDeleteComment: (comment: CommentType) => void;
  onComment: (message: string) => void;
  requestClose: () => void;
  deleteComment: (ok: boolean) => void;
  deletePost: (ok: boolean) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = props => {
  return (
    <div>
      <ScrollToTopOnMount />
      <Background>
        <FluidContent>
          {!props.post && (
            <Paper>
              <Loader loading={true} />
            </Paper>
          )}
          {props.post && (
            <PostView
              preview
              post={props.post}
              textView={size =>
                props.post && (
                  <PostTextView
                    preview
                    post={props.post}
                    w={size}
                    canPin={props.canPin || false}
                    refresh={props.refresh}
                    modify={props.modifyPost}
                    deletePost={props.reqDeletePost}
                  />
                )
              }
            />
          )}
        </FluidContent>
      </Background>
      <FluidContent>
        <Title>Commentaires</Title>
        {props.comments.length === 0 && (
          <Text>Pas de commentaire(s) pour le moment !</Text>
        )}
        {props.comments.map(c => {
          return (
            <Comment
              key={c.id}
              comment={c}
              toggleLike={props.toggleLikeCom}
              showLikes={props.showLikes}
              onDelete={props.reqDeleteComment}
            />
          );
        })}
        <Auth logged>
          <Flex mt="30px">
            <Box>
              {props.commenter && (
                <ProfileImage
                  src={props.commenter.photoUrlThumb}
                  alt="Logged user profile picture"
                  w="60px"
                  mh="auto"
                />
              )}
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
        requestClose={props.requestClose}
      />
      <Popup
        title="Suppression commentaire"
        description="Voulez vous supprimer ce commentaire ?"
        open={props.openDeleteComm || false}
        onRespond={props.deleteComment}
      />
      <Popup
        title="Suppression post"
        description="Voulez vous supprimer cette publication ?"
        open={props.openDeletePost || false}
        onRespond={props.deletePost}
      />
    </div>
  );
};
