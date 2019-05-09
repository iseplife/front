// @flow

import React, { Component } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MoreIcon from '@material-ui/icons/MoreHoriz';
import ModeEditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';

import * as postData from 'data/post';
import * as authData from 'data/auth';

import type { Post as PostType } from '../../data/post/type';

type Props = {
  post: PostType,
  modify: (post: PostType) => mixed,
  delete: (post: PostType) => mixed,
  refresh: () => mixed,
};

type State = {
  openMenu: boolean,
  pin: boolean,
  canPin: boolean,
  anchorEl: ?any,
};

class EditButton extends Component<Props, State> {
  state = {
    openMenu: false,
    pin: this.props.post.pinned,
    canPin: false,
    anchorEl: null,
  };

  openMenu = (e: any) => this.setState({ openMenu: true, anchorEl: e.target });

  closeMenu = () => this.setState({ openMenu: false });

  componentDidMount() {
    const post = this.props.post;
    if (post.author.authorType === 'club') {
      this.setState({ canPin: true });
    }
    if (authData.hasRole(['ROLE_ADMIN', 'ROLE_POST_MANAGER'])) {
      this.setState({ canPin: true });
    }
  }

  handleEdit = () => {
    this.props.modify(this.props.post);
    this.closeMenu();
  };

  handleDelete = () => {
    this.props.delete(this.props.post);
    this.closeMenu();
  };

  pinPost = () => {
    postData.pinPost(this.props.post.id, !this.props.post.pinned).then(res => {
      this.props.refresh();
    });
    this.closeMenu();
  };

  render() {
    const { canPin } = this.state;
    return (
      <div>
        <IconButton color="secondary" onClick={this.openMenu}>
          <MoreIcon />
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          open={this.state.openMenu}
          onClose={this.closeMenu}
        >
          <MenuItem onClick={this.handleEdit}>
            <ListItemIcon>
              <ModeEditIcon />
            </ListItemIcon>
            <ListItemText primary="Modifier" />
          </MenuItem>
          <MenuItem onClick={this.handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Supprimer" />
          </MenuItem>
          {this.props.canPin &&
            canPin && (
              <MenuItem onClick={this.pinPost}>
                <ListItemIcon>
                  {this.state.pin ? <TurnedInNotIcon /> : <TurnedInIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={this.state.pin ? 'Retirer' : "A l'affiche"}
                />
              </MenuItem>
            )}
        </Menu>
      </div>
    );
  }
}

export default EditButton;
