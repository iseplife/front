import React, { Component } from 'react';
import * as authData from '../../data/auth';
import * as postData from '../../data/post';
import { Post } from '../../data/post/type';
import { HomeView } from './view';

type HomeProps = {};
type HomeState = {
  posts: Post[];
  pinnedPosts: Post[];
  waitingPosts: Post[];
  page: number;
  lastPage: boolean;
  isLoading: boolean;
};

class Home extends Component<HomeProps, HomeState> {
  state: HomeState = {
    posts: [],
    pinnedPosts: [],
    waitingPosts: [],
    page: 0,
    lastPage: false,
    isLoading: true,
  };

  componentDidMount() {
    this.getPosts();
    this.getPinnedPosts();
    if (authData.isLoggedIn()) {
      this.getWaitingPosts();
    }
    document.addEventListener('new-post', this.refreshPosts.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('new-post', this.refreshPosts.bind(this));
  }

  getPosts() {
    this.setState({ isLoading: true });
    postData.getPosts(this.state.page).then(res => {
      this.setState({
        isLoading: false,
        posts: this.state.posts.concat(res.data.content),
        page: this.state.page + 1,
        lastPage: res.data.last,
      });
    });
  }

  async getWaitingPosts() {
    const postsRes = await postData.getWaitingPost();
    this.setState({ waitingPosts: postsRes.data });
  }

  getPinnedPosts = async () => {
    let res = await postData.getPinnedPosts();
    this.setState({ pinnedPosts: res.data });
  };

  seeMore = () => {
    this.getPosts();
  };

  refreshPosts = () => {
    postData.getPosts(0).then(res => {
      this.setState({
        posts: res.data.content,
        page: 1,
        lastPage: res.data.last,
      });
    });
    this.getPinnedPosts();
    this.getWaitingPosts();
  };

  render() {
    return (
      <HomeView
        posts={this.state.posts}
        page={this.state.page}
        pinnedPosts={this.state.pinnedPosts}
        waitingPosts={this.state.waitingPosts}
        lastPage={this.state.lastPage}
        onSeeMore={this.seeMore}
        refreshPosts={this.refreshPosts}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default Home;
