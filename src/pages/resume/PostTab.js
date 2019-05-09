// @flow

import React from 'react';

import { Box } from 'grid-styled';

import Button from '@material-ui/core/Button';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import PostListView from 'components/PostList';

import { Text, Title } from 'components/common';

export default function PostTab(props) {
  const { posts, lastPage } = props;
  return (
    <Box p={2} w={1}>
      {posts.length === 0 && (
        <div style={{ textAlign: 'center', minHeight: 200, marginTop: 100 }}>
          <Text fs="2em">Aucune publication</Text>
        </div>
      )}
      <PostListView posts={posts} refreshPosts={props.refreshPosts} />
      {!lastPage &&
        posts.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <Button variant="fab" color="primary" onClick={props.onSeeMore}>
              <ArrowDownwardIcon />
            </Button>
          </div>
        )}
    </Box>
  );
}
