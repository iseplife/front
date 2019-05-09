// @flow

import React, { Component } from 'react';

import * as studentData from 'data/users/student';

import AdressbookDetailView from './view';

import AccountTab from '../../resume/AccountTab';
import PhotoTab from '../../resume/PhotoTab';
import PostTab from '../../resume/PostTab';
import type {} from 'react-router-dom';

type State = {
  data: any,
  posts: any[],
  page: number,
  lastPage: boolean,
  clubMembers: any[],
  fullscreenOpen: boolean,
  tabIndex: number,
  isLoading: boolean,
};

type Props = {};

class AdressbookDetail extends Component<Props, State> {
  state = {
    data: null,
    posts: [],
    page: 0,
    lastPage: false,
    clubMembers: [],
    fullscreenOpen: false,
    tabIndex: 0,
    isLoading: false,
  };

  componentDidMount() {
    const id = this.getUserId();
    this.getUserData(id);
    this.refreshPosts();
    this.getClubMembers(id);
  }

  componentWillReceiveProps(props: Props) {
    this.setState({ tabIndex: 0 });
    const id = props.match.params.id;
    this.getUserData(id);
    this.refreshPosts(id);
    this.getClubMembers(id);
  }

  getUserData = async (id: number) => {
    this.setState({ isLoading: true });
    const { data } = await studentData.getStudent(id);
    this.setState({ data, isLoading: false });
  };

  refreshPosts = async () => {
    const userid = this.getUserId();
    const { data } = await studentData.getPosts(userid, 0);
    this.setState({
      posts: data.content,
      page: 1,
      lastPage: data.last,
    });
  };

  getNextPosts = async () => {
    const userid = this.getUserId();
    const { data } = await studentData.getPosts(userid, this.state.page);
    this.setState({
      posts: this.state.posts.concat(data.content),
      page: this.state.page + 1,
      lastPage: data.last,
    });
  };

  getClubMembers = async (id: number) => {
    const { data } = await studentData.getClubMembers(id);
    this.setState({ clubMembers: data });
  };

  setFullScreen = open => e => {
    this.setState({ fullscreenOpen: open });
  };

  changeTab = (event: Event, index: number) => {
    this.setState({ tabIndex: index });
  };

  getUserId() {
    return this.props.match.params.id;
  }

  renderTab = () => {
    const userid = this.getUserId();
    const { data, posts, clubMembers, lastPage } = this.state;
    switch (this.state.tabIndex) {
      case 0:
        return (
          <AccountTab data={data} posts={posts} clubMembers={clubMembers} />
        );
      case 1:
        return (
          <PostTab
            posts={posts}
            lastPage={lastPage}
            refreshPosts={this.refreshPosts}
            onSeeMore={this.getNextPosts}
          />
        );
      case 2:
        return <PhotoTab userId={userid} />;
      default:
        break;
    }
    return null;
  };

  render() {
    return (
      <AdressbookDetailView
        user={this.state.data}
        isLoading={this.state.isLoading}
        tabIndex={this.state.tabIndex}
        fullscreenOpen={this.state.fullscreenOpen}
        setFullScreen={this.setFullScreen}
        changeTab={this.changeTab}
        renderTab={this.renderTab}
      />
    );
  }
}

export default AdressbookDetail;
