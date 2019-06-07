import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { Component } from 'react';

interface PopupProps {
  open: boolean;
  title: string;
  description: string | React.ReactNode;
  onRespond: (response: boolean) => void;
}

interface PopupState {
  open: boolean;
}

class Popup extends Component<PopupProps, PopupState> {
  state: PopupState = {
    open: false,
  };

  componentDidUpdate() {
    if (this.props.open !== this.state.open) {
      this.setState({ open: this.props.open });
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
