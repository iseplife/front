import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box, Flex } from '@rebass/grid';
import { AxiosPromise } from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as authData from '../../data/auth';
import { Comment as CommentType } from '../../data/post/type';
import { Student } from '../../data/users/type';
import { ProfileImage, Text, Title } from '../common';
import LikeButton from './LikeButton';

interface CommentProps {
  comment: CommentType;
  onDelete: (comment: CommentType) => void;
  toggleLike: (likeId: number) => void;
  showLikes: (likeId: number) => AxiosPromise<Student[]>;
}

class Comment extends Component<CommentProps> {
  deleteComment = () => {
    this.props.onDelete(this.props.comment);
  };

  renderEdit() {
    const { comment } = this.props;
    if (authData.isLoggedIn()) {
      const user = authData.getUser();
      if (user && user.id === comment.student.id) {
        return (
          <div>
            <IconButton color="default" onClick={this.deleteComment}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      }
    }
    return null;
  }

  render() {
    const props = this.props.comment;
    return (
      <Flex mb={3}>
        <Box>
          <ProfileImage
            alt="Student profile picture"
            src={props.student.photoUrlThumb}
            w="60px"
            mh="auto"
          />
        </Box>
        <Box ml="20px" mt="5px" mr="5px">
          <Link to={`/annuaire/${props.student.id}`}>
            <Title fontSize={1} invert>
              {props.student.firstname} {props.student.lastname}
            </Title>
          </Link>
          <Text mb={0.5}>{props.message}</Text>
        </Box>
        <Box ml="auto">
          <Flex alignItems="auto">
            <Box>
              <LikeButton
                likes={props.likes.length}
                liked={props.liked}
                toggleLike={() => this.props.toggleLike(props.id)}
                showLikes={() => this.props.showLikes(props.id)}
              />
            </Box>
            <Box ml="5px">{this.renderEdit()}</Box>
          </Flex>
        </Box>
      </Flex>
    );
  }
}

export default Comment;
