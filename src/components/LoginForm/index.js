// @flow

import React from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Loader from '../Loader';

export default function LoginForm(props) {
  return (
    <Dialog
      open={props.open}
      transition={Slide}
      onClose={props.handleRequestClose}
    >
      <DialogTitle
        style={{
          textAlign: 'center',
        }}
      >
        <img
          alt="Isep Live"
          src="/img/iseplive.jpg"
          style={{
            height: '200px',
          }}
        />
      </DialogTitle>
      <form onSubmit={props.onConnexion}>
        <DialogContent>
          <Loader loading={props.loading} mh="80px">
            <TextField
              error={props.error}
              autoFocus
              label="Nom d'utilisateur"
              margin="normal"
              fullWidth
              type="text"
              onChange={e => props.onChange('username', e)}
            />
            <TextField
              type="password"
              error={props.error}
              helperText={props.error && 'Mauvais mot de passe ou utilisateur'}
              margin="normal"
              label="Mot de passe"
              fullWidth
              onChange={e => props.onChange('password', e)}
            />
          </Loader>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={props.handleRequestClose} color="primary">
            Mot de passe oublié
        </Button> */}
          <Button
            type="submit"
            color="secondary"
            disabled={props.loginDisabled}
          >
            Connexion
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
