// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { List, ListItem, ListItemText } from '@material-ui/core';

import * as studentData from '../../data/users/student';
import * as imageData from '../../data/media/image';
import * as authData from '../../data/auth';

import { backUrl } from 'config';

const STYLE = {
  marginTop: 20,
  display: 'flex',
  flexWrap: 'wrap',
};

const InputButton = styled.button`
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 30px;
  padding: 7px 9px;
  margin-bottom: 10px;
  height: auto;
  border: 0;
  font-family: inherit;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export default class PeopleMatcher extends Component {
  state = {
    dialogOpen: false,
    students: [],
    imageId: null,
    tags: [],
  };

  componentDidMount() {
    if (this.props.internalRefresh) {
      this.refresh();
    }

    this.setState({
      imageId: this.props.image.id,
      tags: this.props.image.matched,
    });
  }

  componentWillReceiveProps(props) {
    if (props.image.id !== this.state.imageId) {
      this.setState({ tags: props.image.matched });
    }

    this.setState({ imageId: props.image.id });
  }

  findStudents = event => {
    studentData.searchStudents(event.target.value).then(res => {
      this.setState({ students: res.data.content.slice(0, 5) });
    });
  };

  refresh() {
    imageData.getImageTags(this.props.image.id).then(res => {
      this.setState({ tags: res.data });
    });
  }

  closeDialog = () => {
    this.props.onOpenMatcher(false);
    this.setState({ dialogOpen: false });
  };

  tag = () => {
    this.props.onOpenMatcher(true);
    this.setState({ dialogOpen: true });
  };

  selectStudent = stud => e => {
    imageData.matchStudent(this.props.image.id, stud.id).then(res => {
      this.refresh();
      this.closeDialog();
    });
  };

  removeStudent = stud => e => {
    imageData.unmatchStudent(this.props.image.id, stud.id).then(res => {
      this.refresh();
      this.closeDialog();
    });
  };

  getStudentSelection() {
    const { students, tags } = this.state;
    return students.filter(s => {
      return tags.filter(t => t.match.id === s.id).length === 0;
    });
  }

  render() {
    const ownerId = authData.getUser().id;
    if (!this.props.image) return null;
    return (
      <div style={STYLE}>
        {this.state.tags.map(e => {
          const onDelete = this.removeStudent(e.match);
          let props = {};
          if (e.owner.id === ownerId) {
            props = { onDelete };
          }
          const avatarUrl = e.match.photoUrlThumb
            ? backUrl + e.match.photoUrlThumb
            : '/img/svg/user.svg';
          return (
            <Chip
              key={e.id}
              style={{ marginRight: 10, marginBottom: 10 }}
              avatar={<Avatar src={avatarUrl} />}
              label={`${e.match.firstname} ${e.match.lastname}`}
              {...props}
            />
          );
        })}
        <InputButton onClick={this.tag}>Tagger une personne</InputButton>
        <Dialog open={this.state.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Tagger une personne</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Prénom ou Nom"
              onChange={this.findStudents}
            />
            <List>
              {this.getStudentSelection().map(stud => {
                return (
                  <ListItem
                    key={stud.id}
                    button
                    onClick={this.selectStudent(stud)}
                  >
                    <Avatar
                      alt="student"
                      src={
                        stud.photoUrlThumb
                          ? backUrl + stud.photoUrlThumb
                          : '/img/svg/user.svg'
                      }
                    />
                    <ListItemText
                      primary={stud.firstname + ' ' + stud.lastname}
                    />
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
