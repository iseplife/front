// @flow

import React from 'react';
import Button from '@material-ui/core/Button';

import { Text } from 'components/common';

import PostList from 'components/PostList';
import Loader from 'components/Loader';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function PostsTab(props) {
  return (
    <Loader loading={props.loading}>
      {props.posts.length === 0 && (
        <div style={{ minHeight: 300, marginTop: 100, textAlign: 'center' }}>
          <Text fs="2em">Aucune publication</Text>
        </div>
      )}
      <PostList posts={props.posts} refreshPosts={props.refreshPosts} />
      {!props.lastPage &&
        props.posts.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <Button variant="fab" color="primary" onClick={props.onSeeMore}>
              <ArrowDownwardIcon />
            </Button>
          </div>
        )}
    </Loader>
  );
}
