import { Fab } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import React from 'react';
import { Text } from '../../../components/common';
import Loader from '../../../components/Loader';
import PostList from '../../../components/PostList';
import { Post } from '../../../data/post/type';

type PostsTabProps = {
  posts: Post[];
  loading: boolean;
  lastPage: boolean;
  refreshPosts: () => void;
  onSeeMore: () => void;
};
const PostsTab: React.FC<PostsTabProps> = props => {
  return (
    <Loader loading={props.loading}>
      {props.posts.length === 0 && (
        <div style={{ minHeight: 300, marginTop: 100, textAlign: 'center' }}>
          <Text fs="2em">Aucune publication</Text>
        </div>
      )}
      <PostList posts={props.posts} refreshPosts={props.refreshPosts} />
      {!props.lastPage && props.posts.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <Fab color="primary" onClick={props.onSeeMore}>
            <ArrowDownwardIcon />
          </Fab>
        </div>
      )}
    </Loader>
  );
};
export default PostsTab;
