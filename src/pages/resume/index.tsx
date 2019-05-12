import React, { Component } from 'react';
import * as authData from '../../data/auth';
import { TokenPayload } from '../../data/auth/type';
import { ClubMember } from '../../data/club/type';
import { Post } from '../../data/post/type';
import * as userData from '../../data/users/student';
import { AccountTab } from './AccountTab';
import { PhotoTab } from './PhotoTab';
import { ResumeView } from './view';
import { PostTab } from './PostTab';
import { Student, StudentUpdate } from '../../data/users/type';

type ResumeProps = {};
type ResumeState = {
  open: boolean;
  isLoading: boolean;
  data: any | null;
  page: number;
  lastPage: boolean;
  posts: Post[];
  clubMembers: ClubMember[];
  fullscreenOpen: boolean;
  tabIndex: number;
};

class Resume extends Component<ResumeProps, ResumeState> {
  state: ResumeState = {
    open: false,
    isLoading: false,
    data: null,
    page: 0,
    lastPage: false,
    posts: [],
    clubMembers: [],
    fullscreenOpen: false,
    tabIndex: 0,
  };

  user?: TokenPayload | null;

  componentDidMount() {
    this.user = authData.getUser();
    this.getUserData();
    this.refreshPosts();
    this.getClubMembers();
  }

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleUpdate = (form: StudentUpdate) => {
    if (this.state.data) {
      userData.updateStudent(form).then(() => {
        this.setState({ open: false });
        this.getUserData();
      });
    }
  };

  getUserData = async () => {
    this.setState({ isLoading: true });
    const { data } = await userData.getLoggedUser();
    this.setState({ data, isLoading: false });
  };

  refreshPosts = async () => {
    if (this.user) {
      const { data } = await userData.getPosts(this.user.id, 0);
      this.setState({
        posts: data.content,
        page: 1,
        lastPage: data.last,
      });
    }
  };

  getNextPosts = async () => {
    if (this.user) {
      const { data } = await userData.getPosts(this.user.id, this.state.page);
      this.setState({
        posts: this.state.posts.concat(data.content),
        page: this.state.page + 1,
        lastPage: data.last,
      });
    }
  };

  toggleNotif = async () => {
    await userData.toggleNotifications();
    this.setState({
      data: {
        ...this.state.data,
        allowNotifications: !this.state.data.allowNotifications,
      },
    });
  };

  onModify = () => {
    this.setState({ open: true });
  };

  getClubMembers = () => {
    if (this.user) {
      userData.getClubMembers(this.user.id).then(res => {
        this.setState({ clubMembers: res.data });
      });
    }
  };

  setFullScreen = (open: boolean) => () => {
    this.setState({ fullscreenOpen: open });
  };

  changeTab = (event: React.ChangeEvent<{}>, index: any) => {
    this.setState({ tabIndex: index as number });
  };

  renderTab = () => {
    const { data, posts, clubMembers, lastPage } = this.state;
    if (!this.user) return null;
    switch (this.state.tabIndex) {
      case 0:
        return (
          <AccountTab
            parameters
            data={data}
            toggleNotif={this.toggleNotif}
            clubMembers={clubMembers}
          />
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
        return <PhotoTab userId={this.user.id} />;
      default:
        break;
    }
    return null;
  };

  render() {
    return (
      <ResumeView
        isLoading={this.state.isLoading}
        user={this.state.data}
        fullscreenOpen={this.state.fullscreenOpen}
        open={this.state.open}
        tabIndex={this.state.tabIndex}
        renderTab={this.renderTab}
        changeTab={this.changeTab}
        onModify={this.onModify}
        handleRequestClose={this.handleRequestClose}
        handleUpdate={this.handleUpdate}
        setFullScreen={this.setFullScreen}
      />
    );
  }
}

export default Resume;
