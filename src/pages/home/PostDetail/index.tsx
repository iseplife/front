import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import * as authData from '../../../data/auth';
import * as postData from '../../../data/post';
import { Comment, Post } from '../../../data/post/type';
import * as studentData from '../../../data/users/student';
import { Student } from '../../../data/users/type';
import { PostDetailView } from './view';

interface PostDetailProps extends RouteComponentProps<{ id: string }> {
  post?: Post;
}

interface PostDetailState {
  post: Post | null;
  comments: Comment[];
  commenter: Student | null;
  modifyEnable: boolean;
  openDeleteComm: boolean;
  openDeletePost: boolean;
  toDeleteComm: Comment | null;
}

class PostDetail extends Component<PostDetailProps, PostDetailState> {
  state: PostDetailState = {
    post: null,
    comments: [],
    commenter: null,

    modifyEnable: false,
    openDeleteComm: false,
    openDeletePost: false,
    toDeleteComm: null,
  };

  postId?: number;
  autoRefresh?: number;

  componentDidMount() {
    this.postId = parseInt(this.props.match.params.id, 10);
    this.refreshPost();
    this.refreshCom();
    if (authData.isLoggedIn()) {
      this.getCommenter();
    }
    this.autoRefresh = window.setInterval(() => {
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

  refreshPost = () => {
    if (this.postId) {
      postData.getPost(this.postId).then(res => {
        this.setState({ post: res.data });
      });
    }
  };

  refreshCom = () => {
    if (this.postId) {
      postData
        .getComments(this.postId)
        .then(res => this.setState({ comments: res.data }));
    }
  };

  toggleLikeCom = (comId: number) => {
    if (this.postId) {
      postData.toggleLikeComment(this.postId, comId);
    }
  };

  showLikes = (comId: number) => {
    return postData.getLikes('comment', comId);
  };

  comment = (message: string) => {
    if (this.postId) {
      postData.comment(this.postId, message).then(this.refreshCom);
    }
  };

  modifyPost = (postModified: Post) =>
    this.setState({ post: postModified, modifyEnable: true });

  requestClose = () => this.setState({ modifyEnable: false });

  reqDeleteComment = (comment: Comment) =>
    this.setState({ toDeleteComm: comment, openDeleteComm: true });

  deleteComment = (ok: boolean) => {
    if (ok && this.postId && this.state.toDeleteComm) {
      postData
        .deleteComment(this.postId, this.state.toDeleteComm.id)
        .then(() => {
          this.refreshCom();
        });
    }
    this.setState({ openDeleteComm: false });
  };

  reqDeletePost = () => this.setState({ openDeletePost: true });

  deletePost = (ok: boolean) => {
    if (ok && this.state.post) {
      postData.deletePost(this.state.post.id).then(() => {
        this.props.history.push('/');
      });
    }
    this.setState({ openDeletePost: false });
  };

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
