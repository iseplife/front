import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Box } from '@rebass/grid';
import React from 'react';
import { Text } from '../../components/common';
import PostListView from '../../components/PostList';
import { Post } from '../../data/post/type';

type PostTabProps = {
  posts: Post[];
  lastPage: boolean;
  refreshPosts: () => void;
  onSeeMore: () => void;
};
export const PostTab: React.FC<PostTabProps> = props => {
  const { posts, lastPage } = props;
  return (
    <Box p={2} width={1}>
      {posts.length === 0 && (
        <div style={{ textAlign: 'center', minHeight: 200, marginTop: 100 }}>
          <Text fs="2em">Aucune publication</Text>
        </div>
      )}
      <PostListView posts={posts} refreshPosts={props.refreshPosts} />
      {!lastPage && posts.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <Button variant="fab" color="primary" onClick={props.onSeeMore}>
            <ArrowDownwardIcon />
          </Button>
        </div>
      )}
    </Box>
  );
};
