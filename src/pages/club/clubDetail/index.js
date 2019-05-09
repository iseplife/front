// @flow

import React, { Component } from 'react';

import ClubDetailView from './view';
import MembersTab from './MembersTab';
import PostsTab from './PostsTab';
import AdminTab from './AdminTab';

import * as clubData from 'data/club';
import * as authData from 'data/auth';
import { ADMIN, CLUB_MANAGER } from '../../../constants';

class ClubDetail extends Component {
  state = {
    id: this.props.match.params.id,
    tabIndex: 0,
    logoUrl: '',
    name: '',
    description: '',
    website: '',
    members: [],
    posts: [],
    page: 0,
    lastPage: true,
    formData: {},
    postsLoading: false,
    membersLoading: false,
    formOpen: false,
    isAdmin: false,
    openDeletePopup: false,
  };

  componentDidMount() {

    const user = authData.getUser();

    if (user) {
      const isClubAdmin = user.clubsAdmin.includes(+this.state.id);
      this.setState({
        isAdmin: isClubAdmin || authData.hasRole([ADMIN, CLUB_MANAGER])
      });
    }

    this.requestClubDetail();
    this.loadMembers();
  }

  requestClubDetail() {
    clubData.getClub(this.state.id)
      .then(res => {
        const { logoUrl, description, name, website } = res.data;
        this.setState({
          logoUrl,
          description,
          name,
          website,
          formData: res.data,
        });
      });
  }

  handleChangeTab = (event: Event, index: number) => {
    this.setState({ tabIndex: index });
    switch (index) {
      case 0:
        return this.loadMembers();
      case 1:
        return this.loadPosts();
      default:
        break;
    }
  };

  loadMembers = () => {
    this.setState({ membersLoading: true });
    clubData.getMembers(this.state.id)
      .then(res => {
        this.setState({ members: res.data, membersLoading: false });
      });
  };

  loadPosts = () => {
    this.setState({ postsLoading: true });
    clubData.getPosts(this.state.id, 0)
      .then(res => {
        this.setState({
          posts: res.data.content,
          page: 1,
          lastPage: res.data.last,
          postsLoading: false
        });
      });
  };

  loadMorePosts = () => {
    if (this.state.page === 0) {
      this.setState({ postsLoading: true });
    }
    clubData.getPosts(this.state.id, this.state.page)
      .then(res => {
        this.setState({
          posts: this.state.posts.concat(res.data.content),
          page: this.state.page + 1,
          lastPage: res.data.last,
          postsLoading: false
        });
      });
  };

  renderTab = () => {
    switch (this.state.tabIndex) {
      case 0:
        return (
          <MembersTab
            members={this.state.members}
            loading={this.state.membersLoading} />
        );
      case 1:
        return (
          <PostsTab
            posts={this.state.posts}
            lastPage={this.state.lastPage}
            onSeeMore={this.loadMorePosts}
            loading={this.state.postsLoading}
            refreshPosts={this.loadPosts} />
        );
      case 2:
        return (
          <AdminTab
            clubid={this.state.id} />
        );
      default:
        break;
    }
    return null;
  };

  onDelete = () => {
    this.setState({ openDeletePopup: true });
  }

  deleteAccepted = (accept) => {
    if (accept) {
      clubData.deleteClub(this.state.id).then(res => {
        this.props.history.push('/associations');
      });
    }
    this.setState({ openDeletePopup: false });
  }

  closeForm = () => {
    this.setState({ formOpen: false });
  }

  updateClub = (form) => {
    return clubData
      .updateClub(this.state.id, form)
      .then(res => {
        this.closeForm();
        this.requestClubDetail();
      });
  }

  render() {
    return (
      <ClubDetailView
        {...this.state}
        changeTab={this.handleChangeTab}
        renderTab={this.renderTab}
        onDelete={this.onDelete}
        onEdit={() => this.setState({ formOpen: true })}
        updateClub={this.updateClub}
        closeForm={this.closeForm}
        deleteAccepted={this.deleteAccepted}
      />
    );
  }
}

export default ClubDetail;
