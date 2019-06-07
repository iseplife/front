import Snackbar from '@material-ui/core/Snackbar';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import { MAIN_COLOR } from '../../colors';

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

interface AlertCenterProps extends WithStyles<typeof style> {}

interface AlertCenterState {
  open: boolean;
  type: 'error' | 'message';
  message: string;
}

class AlertCenter extends Component<AlertCenterProps, AlertCenterState> {
  state: AlertCenterState = {
    open: false,
    type: 'error',
    message: '',
  };

  timeout?: number;

  componentDidMount() {
    document.addEventListener('notification', this
      .onReceiveNotification as EventListener);
  }

  componentWillUnmount() {
    document.removeEventListener('notification', this
      .onReceiveNotification as EventListener);
  }

  onReceiveNotification = (e: CustomEvent<AlertCenterState>) => {
    this.setState({
      message: e.detail.message,
      type: e.detail.type || 'message',
      open: true,
    });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this.setState({ open: false });
    }, 3000);
  };

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
