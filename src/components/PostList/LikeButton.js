// @flow

import React, { Component } from 'react';

import styled from 'styled-components';
import { Flex } from 'grid-styled';

import Checkbox from '@material-ui/core/Checkbox';
import Auth from '../Auth/AuthComponent';

import NotLiked from '@material-ui/icons/FavoriteBorder';
import Liked from '@material-ui/icons/Favorite';
import { Dialog, DialogTitle } from '@material-ui/core';
import { List, ListItem, ListItemText } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import * as authData from 'data/auth';

import { Text } from '../common';

import { backUrl } from '../../config';

import type { Student } from '../../data/users/type';
import type { AxiosPromise } from 'axios';

const CustomCheckbox = styled(Checkbox)`
  color: ${props => props.theme.accent} !important;
`;

const Label = styled.span`
  color: ${props => props.theme.accent};
  text-transform: uppercase;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
`;

const LikesPanel = props => {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{props.students.length} J'aime</DialogTitle>
      {props.students.length === 0 && (
        <Text style={{ width: 200, padding: 20 }}>Aucun like</Text>
      )}
      <List>
        {props.students.map(stud => {
          return (
            <ListItem key={stud.id}>
              <Avatar
                alt="stud"
                src={
                  stud.photoUrlThumb
                    ? backUrl + stud.photoUrlThumb
                    : '/img/svg/user.svg'
                }
              />
              <ListItemText primary={stud.firstname + ' ' + stud.lastname} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

type LikeButtonProps = {
  liked: boolean,
  likes: number,
  toggleLike: () => mixed,
  showLikes: () => AxiosPromise<Student[]>,
};

type LikeButtonState = {
  liked: boolean,
  likes: number,
  showLikes: boolean,
  studentLikes: Student[],
};

class LikeButton extends Component<LikeButtonProps, LikeButtonState> {
  state = {
    liked: this.props.liked,
    likes: this.props.likes,
    showLikes: false,
    studentsLike: [],
  };

  handleLike = () => {
    if (authData.isLoggedIn()) {
      this.setState({
        liked: !this.state.liked,
        likes: this.state.likes + (this.state.liked ? -1 : 1),
      });
      this.props.toggleLike();
    }
  };

  showLikes = () => {
    this.props.showLikes().then(res => {
      this.setState({ showLikes: true, studentsLike: res.data });
    });
  };

  onHideLikes = () => {
    this.setState({ showLikes: false });
  };

  render() {
    const { showLikes, studentsLike } = this.state;
    return (
      <Flex align="center">
        <Label
          onClick={this.showLikes}
          style={{
            width: 70,
            textAlign: 'right',
          }}
        >
          {this.state.likes} j'aime
        </Label>
        <Auth logged>
          <CustomCheckbox
            icon={<NotLiked />}
            checkedIcon={<Liked />}
            checked={this.state.liked}
            onChange={this.handleLike}
          />
        </Auth>
        <LikesPanel
          open={showLikes}
          onClose={this.onHideLikes}
          students={studentsLike}
        />
      </Flex>
    );
  }
}

export default LikeButton;
