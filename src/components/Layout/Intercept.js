// @flow

import React from 'react';

import styled from 'styled-components';

import Button from '@material-ui/core/Button';

import { withRouter } from 'react-router-dom';
import { sendAlert } from '../../components/Alert';
import axios from 'axios';
import * as authData from 'data/auth';

import { MAIN_COLOR } from '../../colors';

const errServPhrases = [
  "Whoops nos serveurs ne répondent plus, nos techniciens s'en occupe 👊 !",
  'Désolé, nous ne sommes pas disponible pour le moment ! 🙀',
  "Revenez d'ici 5 min, il est possible que nous soyons en train de faire de la maintenance ! 🔧",
];

function refreshPage() {
  window.location.reload();
}

const noConnectStyle = {
  fontSize: '2em',
  fontWeight: 'bold',
  color: MAIN_COLOR,
  marginBottom: 30,
  textAlign: 'center',
};

const ErrorWindow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 2em;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ErrorView = props => (
  <div>
    <div style={noConnectStyle}>{props.title}</div>
    <div
      style={{
        ...noConnectStyle,
        fontSize: '1em',
        fontWeight: 'normal',
        lineHeight: 1.5,
      }}
    >
      {props.message} <br />
      Essayez de recharger la page.
    </div>
    <div style={{ textAlign: 'center' }}>
      <Button variant="raised" color="primary" onClick={refreshPage}>
        Recharger
      </Button>
    </div>
  </div>
);

type State = {
  error: string,
};

class Intercept extends React.Component<{}, State> {
  state = {
    error: '',
  };

  intercept: any;

  componentDidMount() {
    this.intercept = axios.interceptors.response.use(
      this.axiosResponseInterceptor,
      this.axiosErrorInterceptor
    );

    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);
  }

  componentWillUnmount() {
    axios.interceptors.response.eject(this.intercept);
    window.removeEventListener('offline', this.handleOffline);
    window.removeEventListener('online', this.handleOnline);
  }

  handleOffline = () => {
    sendAlert('Connexion interrompu', 'error');
  };

  handleOnline = () => {
    sendAlert('De nouveau connecté');
  };

  axiosResponseInterceptor = response => {
    // Do something with response data
    if (response.headers) {
      const token = response.headers['authorization'];
      const refreshToken = response.headers['x-refresh-token'];
      if (token && refreshToken) {
        authData.setToken({ token, refreshToken });
      }
    }
    return response;
  };

  axiosErrorInterceptor = error => {
    const props = this.props;

    if (error.response) {
      switch (error.response.status) {
        case 404:
          props.history.push('/404');
          break;

        case 401:
        case 403:
          authData.logout();
          sendAlert('Vous avez été déconnecté', 'error');
          props.history.push('/');
          break;

        case 500:
        case 400:
          sendAlert('Oops.. petit problème 😁', 'error');
          break;
        case 503:
          sendAlert('Serveur indisponible', 'error');
          document.body.style.overflow = 'hidden';
          this.setState({ error: 'server' });
          break;

        default:
          break;
      }
    }

    // Do something with response error
    return Promise.reject(error);
  };

  selectRandom(phrases) {
    const rnd = Math.round(Math.random() * (phrases.length - 1));
    return phrases[rnd];
  }

  render() {
    if (this.state.error !== '') {
      return (
        <ErrorWindow>
          <ErrorView
            title="Serveur indisponible"
            message={this.selectRandom(errServPhrases)}
          />
        </ErrorWindow>
      );
    }
    return null;
  }
}

export default withRouter(Intercept);
