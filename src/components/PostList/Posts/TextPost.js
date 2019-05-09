// @flow

import React, { Component } from 'react';

import { Post } from 'components/PostList';

class TextPost extends Component {
  render() {
    const props = this.props;
    return (
      <Post invert={props.invert}>
        {props.textView(1)}
      </Post>
    );
  }
}

export default TextPost;
