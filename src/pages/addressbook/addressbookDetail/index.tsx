import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { ClubMember } from '../../../data/club/type';
import { Post } from '../../../data/post/type';
import * as studentData from '../../../data/users/student';
import { PhotoTab } from '../../resume/PhotoTab';
import { PostTab } from '../../resume/PostTab';
import AdressbookDetailView from './view';
import { AccountTab } from '../../resume/AccountTab';

type AdressbookDetailProps = RouteComponentProps<{ id: string }> & {};
type AdressbookDetailState = {
  data: any;
  posts: Post[];
  page: number;
  lastPage: boolean;
  clubMembers: ClubMember[];
  fullscreenOpen: boolean;
  tabIndex: number;
  isLoading: boolean;
};
class AdressbookDetail extends Component<
  AdressbookDetailProps,
  AdressbookDetailState
> {
  state: AdressbookDetailState = {
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
    this.refreshPosts(id);
    this.getClubMembers(id);
  }

  componentDidUpdate(prevProps: AdressbookDetailProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ tabIndex: 0 });
      const id = this.getUserId();
      this.getUserData(id);
      this.refreshPosts(id);
      this.getClubMembers(id);
    }
  }

  getUserData = async (id: number) => {
    this.setState({ isLoading: true });
    const { data } = await studentData.getStudent(id);
    this.setState({ data, isLoading: false });
  };

  refreshPosts = async (id?: number) => {
    const userid = id || this.getUserId();
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

  setFullScreen = (open: boolean) => () => {
    this.setState({ fullscreenOpen: open });
  };

  changeTab = (event: React.ChangeEvent<{}>, index: any) => {
    this.setState({ tabIndex: index as number });
  };

  getUserId() {
    return parseInt(this.props.match.params.id, 10);
  }

  renderTab = () => {
    const userid = this.getUserId();
    const { data, posts, clubMembers, lastPage } = this.state;
    switch (this.state.tabIndex) {
      case 0:
        return <AccountTab data={data} clubMembers={clubMembers} />;
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
