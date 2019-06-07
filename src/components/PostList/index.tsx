import Button from '@material-ui/core/Button';
import ForumIcon from '@material-ui/icons/Forum';
import { Box } from '@rebass/grid';
import { NavLinkAdapter } from 'components/utils';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Media } from '../../data/media/type';
import * as postData from '../../data/post';
import { Post as PostType } from '../../data/post/type';
import * as utils from '../../data/util';
import { Text } from '../common';
import FullScreenView from '../FullScreen/View';
import Popup from '../Popup';
import EditButton from './EditButton';
import LikeButton from './LikeButton';
import ModifyPostModal from './ModifyPostModal';
import PostTitleView from './PostTitleView';
import { PostView } from './PostView';

const PostList = styled.ul`
  padding: 0;
`;

interface PostProps {
  invert?: boolean;
}

export const Post = styled.li`
  box-shadow: 0 0px 15px rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  flex-direction: ${(props: PostProps) =>
    props.invert ? 'row-reverse' : 'row'};

  @media (max-width: 40em) {
    flex-direction: column;
  }
`;

export const PostText = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* padding-bottom: 70px; */
  /* position: relative; */

  @media (max-width: 40em) {
    height: auto;
  }
`;

export const PostActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: -10px;
  margin-top: auto;
`;

interface PostTextViewProps {
  refresh: () => void;
  modify: (post: PostType) => void;
  deletePost: (post: PostType) => void;
  post: PostType;
  preview: boolean;
  canPin: boolean;
  w: number[];
}

export class PostTextView extends Component<PostTextViewProps> {
  toggleLike = () => {
    postData.toggleLikePost(this.props.post.id);
  };

  showLikes = () => {
    return postData.getLikes('post', this.props.post.id);
  };

  render() {
    const { post, refresh, preview, modify, canPin, deletePost } = this.props;
    return (
      <PostText width={this.props.w}>
        <PostTitleView post={post} />
        <Link to={`/post/${post.id}`}>
          <PostTextContent content={post.content} preview={!preview} />
        </Link>
        <PostActions>
          {!preview && (
            <Button
              size="small"
              color="secondary"
              to={`/post/${post.id}`}
              component={NavLinkAdapter}
            >
              {post.nbComments} <ForumIcon style={{ marginLeft: 5 }} />
            </Button>
          )}

          {post.hasWriteAccess && (
            <Box ml="5px">
              <EditButton
                post={post}
                refresh={refresh}
                canPin={canPin}
                modify={modify}
                delete={deletePost}
              />
            </Box>
          )}
          <Box ml="auto">
            <LikeButton
              liked={post.liked}
              likes={post.nbLikes}
              toggleLike={this.toggleLike}
              showLikes={this.showLikes}
            />
          </Box>
        </PostActions>
      </PostText>
    );
  }
}

type TextContentProps = {
  preview: boolean;
  content: string;
};

export function PostTextContent(props: TextContentProps) {
  const text = props.preview
    ? props.content
        .slice(0, 200)
        .split('\n')
        .slice(0, 3)
    : props.content.split('\n');
  if (
    props.preview &&
    (props.content.length > 200 ||
      props.content.slice(0, 200).split('\n').length > 3)
  ) {
    text[text.length - 1] += '...';
  }
  return (
    <div>
      {text.map((par, i) => (
        <Text key={i} mb={1} color="#555">
          {utils.parseText(par)}
        </Text>
      ))}
    </div>
  );
}

type PostListRefreshAction = 'delete';

type PostListViewProps = {
  refreshPosts: (action?: PostListRefreshAction) => void;
  posts: PostType[];
  canPin: boolean;
};

type PostListViewState = {
  postSelected: PostType | null;
  media: Media | null;
  modifyEnable: boolean;
  fullscreenOpen: boolean;
  deleteEnabled: boolean;
};

export default class PostListView extends React.Component<
  PostListViewProps,
  PostListViewState
> {
  state: PostListViewState = {
    postSelected: null,
    media: null,
    modifyEnable: false,
    fullscreenOpen: false,
    deleteEnabled: false,
  };

  modifyPost = (postSelected: PostType) => {
    this.setState({ postSelected, modifyEnable: true });
  };

  requestClose = () => {
    this.setState({ modifyEnable: false });
  };

  setFullScreen = (fullscreenOpen: boolean, media?: Media) => {
    if (media) {
      this.setState({ media });
    }
    this.setState({ fullscreenOpen });
  };

  deletePost = (post: PostType) => {
    this.setState({
      deleteEnabled: true,
      postSelected: post,
    });
  };

  deleteResponse = (ok: boolean) => {
    if (ok && this.state.postSelected) {
      postData.deletePost(this.state.postSelected.id).then(res => {
        this.props.refreshPosts('delete');
      });
    }
    this.setState({
      deleteEnabled: false,
      postSelected: null,
    });
  };

  render() {
    const props = this.props;
    return (
      <PostList>
        {props.posts.map((p, i) => {
          return (
            <PostView
              key={p.id}
              preview={false}
              post={p}
              list={true}
              invert={i % 2 === 1}
              openFullScreen={this.setFullScreen}
              textView={size => (
                <PostTextView
                  post={p}
                  refresh={props.refreshPosts}
                  w={size}
                  canPin={props.canPin}
                  preview={false}
                  modify={this.modifyPost}
                  deletePost={this.deletePost}
                />
              )}
            />
          );
        })}
        <ModifyPostModal
          post={this.state.postSelected}
          open={this.state.modifyEnable}
          refresh={props.refreshPosts}
          requestClose={this.requestClose}
        />

        {this.state.media && this.state.media.mediaType === 'image' && (
          <FullScreenView
            matcher
            internalRefresh
            visible={this.state.fullscreenOpen}
            image={this.state.media.fullSizeUrl}
            imageOriginal={this.state.media.originalUrl}
            data={this.state.media}
            onEscKey={() => this.setFullScreen(false)}
          />
        )}
        <Popup
          title="Suppression"
          description="Voulez vous supprimer cette publication ?"
          open={this.state.deleteEnabled}
          onRespond={this.deleteResponse}
        />
      </PostList>
    );
  }

  static defaultProps: PostListViewProps = {
    canPin: false,
    posts: [],
    refreshPosts: () => {},
  };
}
