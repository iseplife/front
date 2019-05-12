import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import React, { Component } from 'react';
import styled from 'styled-components';
import { backUrl } from '../../config';
import * as authData from '../../data/auth';
import * as imageData from '../../data/media/image';
import * as studentData from '../../data/users/student';
import { Student } from '../../data/users/type';
import { Image, Match } from '../../data/media/type';

const STYLE: React.CSSProperties = {
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

interface PeopleMatcherProps {
  internalRefresh?: boolean;
  image: Image;
  onOpenMatcher: (open: boolean) => void;
}

interface PeopleMatcherState {
  dialogOpen: boolean;
  students: Student[];
  imageId: number | null;
  tags: Match[];
}

export default class PeopleMatcher extends Component<
  PeopleMatcherProps,
  PeopleMatcherState
> {
  state: PeopleMatcherState = {
    dialogOpen: false,
    students: [],
    imageId: null,
    tags: [],
  };

  ownerId?: number;

  componentDidMount() {
    if (this.props.internalRefresh) {
      this.refresh();
    }

    const user = authData.getUser();
    if (user) {
      this.ownerId = user.id;
    }

    this.setState({
      imageId: this.props.image.id,
      tags: this.props.image.matched,
    });
  }

  componentDidUpdate(prevProps: PeopleMatcherProps) {
    if (this.props.image !== prevProps.image) {
      if (this.props.image.id !== this.state.imageId) {
        this.setState({ tags: this.props.image.matched });
      }

      this.setState({ imageId: this.props.image.id });
    }
  }

  findStudents = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  selectStudent = (student: Student) => () => {
    imageData.matchStudent(this.props.image.id, student.id).then(res => {
      this.refresh();
      this.closeDialog();
    });
  };

  removeStudent = (student: Student) => () => {
    imageData.unmatchStudent(this.props.image.id, student.id).then(res => {
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
    if (!this.props.image) return null;
    return (
      <div style={STYLE}>
        {this.state.tags.map(e => {
          const onDelete = this.removeStudent(e.match);
          let props = {};
          if (e.owner.id === this.ownerId) {
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
