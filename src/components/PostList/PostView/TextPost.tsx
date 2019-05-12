import React, { Component } from 'react';
import { Post } from '..';
import { PostViewProps } from '.';

class TextPost extends Component<PostViewProps> {
  render() {
    const { invert, textView } = this.props;
    return <Post invert={invert}>{textView([1])}</Post>;
  }
}

export default TextPost;
