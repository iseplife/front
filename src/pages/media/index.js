// @flow

import React, { Component } from 'react';

import MediaView from './view';

import * as mediaData from 'data/media';
import type { Media as MediaType } from '../../data/media/type';

type State = {
  isLoading: boolean,
  medias: MediaType[],
  page: number,
  lastPage: boolean,
};

class Media extends Component<{}, State> {
  state = {
    isLoading: false,
    medias: [],
    page: 0,
    lastPage: false,
  };

  componentDidMount() {
    this.requestMedia();
  }

  requestMedia() {
    if (this.state.page === 0) {
      this.setState({ isLoading: true });
    }
    mediaData.getAllMedia(this.state.page)
      .then(res => {
        this.setState({
          medias: this.state.medias.concat(res.data.content),
          isLoading: false,
          page: this.state.page + 1,
          lastPage: res.data.last,
        });
      });
  }

  onSeeMore = () => {
    this.requestMedia();
  };

  render() {
    return (
      <MediaView
        medias={mediaData.groupMedia(this.state.medias)}
        isLoading={this.state.isLoading}
        lastPage={this.state.lastPage}
        seeMore={this.onSeeMore} />
    );
  }
}

export default Media;
