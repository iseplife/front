// @flow

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

class Popup extends Component {
  state = {
    open: false,
  };

  componentWillReceiveProps(props) {
    if (props.open !== this.state.open) {
      this.setState({ open: props.open });
    }
  }

  discard = () => {
    this.props.onRespond(false);
    this.setState({ open: false });
  };

  agree = () => {
    this.props.onRespond(true);
    this.setState({ open: false });
  };

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.discard}>
        <DialogTitle>{this.props.title || 'Titre'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{this.props.description || ''}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.discard} color="primary">
            Annuler
          </Button>
          <Button onClick={this.agree} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Popup;
