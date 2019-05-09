// @flow

import React, { Component } from 'react';

import styled from 'styled-components';

const Img = styled.img`
  width: 40px;
  height: 40px;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: ${props => props.mh};
`;

const Box = styled.div`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: white;
  border-radius: 80px;
  padding: 20px;
  margin-bottom: 20px;
`;

const RotatingLoader = props => (
  <Wrap mh={props.mh || '400px'}>
    <Box>
      <Img src="/img/svg/loader/tail-spin.svg" />
    </Box>
  </Wrap>
);

type LoaderV2State = {
  displayLoader: boolean,
};

type LoaderV2Props = {
  loading: boolean,
  delayMs?: number,
  placeholder?: any,
  children: () => any,
};

class LoaderV2 extends Component<LoaderV2Props, LoaderV2State> {
  state = {
    displayLoader: false,
  };

  timerRef: TimeoutID;

  componentDidMount() {
    const timeout = this.props.delayMs || 100;
    this.timerRef = setTimeout(() => {
      if (this.props.loading) {
        this.setState({ displayLoader: true });
      }
    }, timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timerRef);
  }

  render() {
    if (this.props.loading) {
      if (this.state.displayLoader) {
        return this.props.placeholder || <RotatingLoader mh={this.props.mh} />;
      } else {
        return null;
      }
    }
    return this.props.children();
  }
}

const Loader = props => {
  if (props.v2) {
    return <LoaderV2 {...props} />;
  }

  if (props.loading) {
    return <RotatingLoader mh={props.mh} />;
  }
  return props.children;
};

export default Loader;
