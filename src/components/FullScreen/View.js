// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FileDownload from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';

import Auth from '../Auth/AuthComponent';

import { BgImage } from '../common';

import { backUrl } from 'config';

import PeopleMatcher from './PeopleMatcher';

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  top: 0;
  left: 0;
  z-index: 1100;
  overflow: auto;
`;

const ViewStyle = styled.div`
  position: relative;
  margin: 5vh;
`;

class View extends Component {
  state = {
    matcherOpen: false,
  };

  componentWillUnmount() {
    this.removeEscListener();
  }

  removeEscListener() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  openMatcher = open => {
    this.setState({ matcherOpen: open });
  };

  componentWillReceiveProps(props) {
    if (!props.visible) {
      this.removeEscListener();
    } else {
      document.addEventListener('keydown', this.keyHandler);
    }

    document.body.style.overflow = props.visible ? 'hidden' : 'auto';
  }

  keyHandler = ({ key }) => {
    if (key === 'Escape' && !this.state.matcherOpen) {
      this.props.onEscKey();
    }
  };

  render() {
    const lightButton = {
      color: 'white',
      background: 'rgba(255,255,255,0.1)',
    };
    const {
      visible,
      data,
      image,
      imageOriginal,
      internalRefresh,
      matcher,
    } = this.props;
    if (!visible) return null;
    return (
      <Wrapper visible={visible}>
        <IconButton
          style={{
            float: 'right',
            top: 20,
            right: 20,
            zIndex: 3,
          }}
          onClick={() => this.props.onEscKey()}
        >
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
        <ViewStyle>
          <BgImage src={image} size="contain" mh="80vh" />
        </ViewStyle>
        <div style={{ margin: 30 }}>
          <Button
            style={lightButton}
            download
            size="small"
            href={backUrl + (imageOriginal || image)}
          >
            <FileDownload style={{ marginRight: 5 }} /> Télecharger
          </Button>
          {matcher && (
            <Auth logged>
              <PeopleMatcher
                internalRefresh={internalRefresh}
                onOpenMatcher={this.openMatcher}
                image={data}
              />
            </Auth>
          )}
        </div>
      </Wrapper>
    );
  }
}

export default View;
