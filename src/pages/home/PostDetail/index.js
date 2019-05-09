// @flow

import React, { Component } from 'react';

import PostDetailView from './view';
import * as authData from '../../../data/auth';
import * as postData from '../../../data/post';
import * as studentData from '../../../data/users/student';

class PostDetail extends Component {
  state = {
    post: null,
    comments: [],
    commenter: null,

    modifyEnable: false,
    openDeleteComm: false,
    openDeletePost: false,
    toDeleteComm: null,
  }

  componentDidMount() {
    this.postId = this.props.match.params.id;
    this.refreshPost();
    this.refreshCom();
    if (authData.isLoggedIn()) {
      this.getCommenter();
    }
    this.autoRefresh = setInterval(() => {
      this.refreshCom();
    }, 30000);
  }

  componentWillUnmount() {
    clearInterval(this.autoRefresh);
  }

  getCommenter() {
    studentData.getLoggedUser().then(res => {
      this.setState({ commenter: res.data });
    });
  }

  refreshPost = (reason) => {
    postData.getPost(this.postId)
      .then(res => {
        this.setState({ post: res.data });
      });
  };

  refreshCom = () => {
    postData.getComments(this.postId)
      .then(res => this.setState({ comments: res.data }));
  };

  toggleLikeCom = (comId: number) => {
    postData.toggleLikeComment(this.postId, comId);
  };

  showLikes = (comId: number) => e => {
    return postData.getLikes('comment', comId);
  }

  comment = (message: string) => {
    postData.comment(this.postId, message)
      .then(this.refreshCom);
  };

  modifyPost = (postModified) =>
    this.setState({ post: postModified, modifyEnable: true });

  requestClose = () =>
    this.setState({ modifyEnable: false });

  reqDeleteComment = (comment) =>
    this.setState({ toDeleteComm: comment, openDeleteComm: true });

  deleteComment = (ok) => {
    if (ok) {
      postData.deleteComment(this.postId, this.state.toDeleteComm.id)
        .then(res => {
          this.refreshCom();
        });
    }
    this.setState({ openDeleteComm: false });
  }

  reqDeletePost = () =>
    this.setState({ openDeletePost: true })

  deletePost = (ok) => {
    if (ok) {
      postData.deletePost(this.state.post.id).then(res => {
        this.props.history.push('/');
      });
    }
    this.setState({ openDeletePost: false });
  }

  render() {
    return (
      <PostDetailView
        post={this.state.post}
        comments={this.state.comments}
        commenter={this.state.commenter}
        modifyEnable={this.state.modifyEnable}
        openDeleteComm={this.state.openDeleteComm}
        openDeletePost={this.state.openDeletePost}

        refresh={this.refreshPost}
        toggleLikeCom={this.toggleLikeCom}
        showLikes={this.showLikes}
        onComment={this.comment}
        modifyPost={this.modifyPost}
        requestClose={this.requestClose}
        reqDeleteComment={this.reqDeleteComment}
        deleteComment={this.deleteComment}
        reqDeletePost={this.reqDeletePost}
        deletePost={this.deletePost}
      />
    );
  }
}

export default PostDetail;
