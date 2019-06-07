import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Liked from '@material-ui/icons/Favorite';
import NotLiked from '@material-ui/icons/FavoriteBorder';
import { Flex } from '@rebass/grid';
import { AxiosPromise } from 'axios';
import React, { Component } from 'react';
import styled from 'styled-components';
import { backUrl } from '../../config';
import * as authData from '../../data/auth';
import { Student } from '../../data/users/type';
import Auth from '../Auth/AuthComponent';
import { Text } from '../common';

const CustomCheckbox = styled(Checkbox as React.FC<CheckboxProps>)`
  color: ${props => props.theme.accent} !important;
`;

const Label = styled.span`
  color: ${props => props.theme.accent};
  text-transform: uppercase;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
`;

interface LikesPanelProps {
  open?: boolean;
  students: Student[];
  onClose: () => void;
}

const LikesPanel: React.FC<LikesPanelProps> = props => {
  return (
    <Dialog open={props.open || false} onClose={props.onClose}>
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

interface LikeButtonProps {
  liked: boolean;
  likes: number;
  toggleLike: () => void;
  showLikes: () => AxiosPromise<Student[]>;
}

interface LikeButtonState {
  liked: boolean;
  likes: number;
  showLikes: boolean;
  studentLikes: Student[];
}

class LikeButton extends Component<LikeButtonProps, LikeButtonState> {
  state = {
    liked: this.props.liked,
    likes: this.props.likes,
    showLikes: false,
    studentLikes: [],
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
      this.setState({ showLikes: true, studentLikes: res.data });
    });
  };

  onHideLikes = () => {
    this.setState({ showLikes: false });
  };

  render() {
    const { showLikes, studentLikes } = this.state;
    return (
      <Flex alignItems="center">
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
          students={studentLikes}
        />
      </Flex>
    );
  }
}

export default LikeButton;
