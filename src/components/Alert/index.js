// @flow

import React, { Component } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import { MAIN_COLOR } from '../../colors';
import { withStyles } from '@material-ui/core/styles';

const style = {
  error: {
    fontSize: 18,
    background: 'white',
    color: 'red',
  },
  message: {
    fontSize: 18,
    background: 'white',
    color: MAIN_COLOR,
  },
};

class AlertCenter extends Component {
  state = {
    open: false,
    type: '',
    message: '',
  };

  timeout: number;

  componentDidMount() {
    document.addEventListener(
      'notification',
      this.onReceiveNotification.bind(this)
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'notification',
      this.onReceiveNotification.bind(this)
    );
  }

  onReceiveNotification(e: any) {
    this.setState({
      message: e.detail.message,
      type: e.detail.type || 'message',
      open: true,
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ open: false });
    }, 3000);
  }

  render() {
    const { open, type, message } = this.state;
    return (
      <Snackbar
        style={{ pointerEvents: 'none' }}
        className={this.props.classes[type]}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        message={message}
      />
    );
  }
}

export function sendAlert(message: string, type?: string) {
  const event = new CustomEvent('notification', { detail: { message, type } });
  document.dispatchEvent(event);
}

export default withStyles(style)(AlertCenter);
