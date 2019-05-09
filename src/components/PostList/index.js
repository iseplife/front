// @flow

import React, { Component } from 'react';

import styled from 'styled-components';
import { Box } from 'grid-styled';

import LazyLoad from 'react-lazyload';

import {Link, NavLink} from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

import Button from '@material-ui/core/Button';
import ForumIcon from '@material-ui/icons/Forum';

import LikeButton from './LikeButton';
import EditButton from './EditButton';
import PostTitleView from './PostTitleView';

import * as postData from 'data/post';
import * as utils from '../../data/util';
import type { Post as PostType } from '../../data/post/type';
import type { Media as MediaType } from '../../data/media/type';

import ModifyPostModal from './ModifyPostModal';
import FullScreenView from '../FullScreen/View';

import PollPost from './Posts/PollPost';
import ImagePost from './Posts/ImagePost';
import TextPost from './Posts/TextPost';
import VideoPost from './Posts/VideoPost';
import GalleryPost from './Posts/GalleryPost';
import DocumentPost from './Posts/DocumentPost';
import GazettePost from './Posts/GazettePost';
import EventPost from './Posts/EventPost';

import { Text } from '../common';
import Popup from '../Popup';

const PostList = styled.ul`
  padding: 0;
`;

export const Post = styled.li`
  box-shadow: 0 0px 15px rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  flex-direction: ${props => (props.invert ? 'row-reverse' : 'row')};

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
  /* position: absolute;
  bottom: 0;
  left: 0; */
  /* padding: 10px; */
  /* width: 100%; */
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: -10px;
  margin-top: auto;
`;

type PostTextViewProps = {
  refresh: () => mixed,
  modify: (post: PostType) => mixed,
  deletePost: (post: PostType) => mixed,
  post: PostType,
  preview: boolean,
  canPin: boolean,
  w: number[],
};

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
      <PostText w={this.props.w}>
        <PostTitleView post={post} />
        <Link to={`/post/${post.id}`}>
        <PostTextContent content={post.content} preview={!preview} />
        </Link>
        <PostActions>
          {!preview && (
            <Button
              size="small"
              color="secondary"
              component={NavLink}
              to={`/post/${post.id}`}
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
  preview: boolean,
  content: string,
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

type PostViewProps = {
  post: PostType,
};

export function PostView(props: PostViewProps) {
  if (props.post.media) {
    switch (props.post.media.mediaType) {
      case 'poll':
        return <PollPost {...props} />;
      case 'image':
        return <ImagePost {...props} />;
      case 'video':
        return <VideoPost {...props} />;
      case 'gallery':
        return <GalleryPost {...props} />;
      case 'event':
        return <EventPost {...props} />;
      case 'document':
        return <DocumentPost {...props} />;
      case 'gazette':
        return <GazettePost {...props} />;
      default:
        break;
    }
  } else {
    return <TextPost {...props} />;
  }
}

type PostListViewProps = {
  refreshPosts: (action?: string) => mixed,
  posts: PostType[],
  canPin: ?boolean,
};

type PostListViewState = {
  postSelected: ?PostType,
  media: ?MediaType,
  modifyEnable: boolean,
  fullscreenOpen: boolean,
  deleteEnabled: boolean,
};

export default class PostListView extends React.Component<
  PostListViewProps,
  PostListViewState
> {
  state = {
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

  setFullScreen = (fullscreenOpen: boolean, media: ?MediaType) => {
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
    if (ok) {
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

        {this.state.media &&
          this.state.media.mediaType === 'image' && (
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
}

// const PostContent = styled.div`
//   height: ${props => props.fb ? 'auto' : '250px'};
//   position: relative;
//   ${props => props.fb && 'background: black;'}

//   @media (max-width: 40em) {
//     height: ${props => props.fb ? 'auto' : '300px'};
//   }
// `;

//     case 'videoEmbed':
//       return (
//         <Post key={p.id} invert={invert}>
//           <Box w={[1, 1 / 2]}>
//             <PostContent fb={p.media.type === 'FACEBOOK'}>
//               {
//                 p.media.type === 'FACEBOOK' ?
//                   // <FacebookVideo url={p.media.url} />
//                     <FacebookPlayer
//                       appId={FACEBOOK_APP_ID}
//                       videoId={p.media.url}
//                     />
//                 :
//                 <YoutubeVideo url={p.media.url} />
//               }
//             </PostContent>
//           </Box>
//           <PostTextView refresh={props.refresh} post={p} w={[1, 1 / 2]} />
//         </Post>
//       );
