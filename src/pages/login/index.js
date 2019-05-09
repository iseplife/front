// @flow

import React, { Component } from 'react';

import { NavLink, Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import styled from 'styled-components';

import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';

import * as authData from 'data/auth';

import LoginForm from 'components/LoginForm';
import SlideShow from 'components/SlideShow';

import { sendAlert } from '../../components/Alert';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 100px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1100px) {
    flex-direction: column;
    padding: 60px 0;
  }
`;

const TitleContainer = styled.div`
  flex: 1;
  text-align: center;
  padding: 50px;

  @media screen and (max-width: 500px) {
    padding: 0;
    margin-bottom: 20px;
  }
`;

const TitleHeader = styled.div`
  text-align: left;

  @media (max-width: 1100px) {
    text-align: center;
  }
`;

const Title = styled.h1`
  font-size: 4em;
  font-weight: 500;
  display: inline-block;
  color: ${SECONDARY_COLOR};
  margin: 0;
  margin-bottom: 20px;
  background: ${MAIN_COLOR};
  padding: 17px 19px;

  @media screen and (max-width: 500px) {
    font-size: 3em;
    padding: 8px 12px;
  }
`;

const Subtitle = styled.h2`
  display: inline-block;
  font-weight: 500;
  color: ${MAIN_COLOR};
  margin: 0;
  margin-bottom: 30px;
  background: ${SECONDARY_COLOR};
  padding: 17px 19px;

  @media screen and (max-width: 500px) {
    font-size: 15px;
    padding: 8px 12px;
    margin-bottom: 20px;
  }
`;

const LogoPartner = styled.div`
  margin-top: 40px;
`;

const Logo = styled.img`
  margin: 10px;
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  background: white;

  @media screen and (max-width: 500px) {
    height: 70px;
  }
`;

const AccessContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px;

  @media screen and (max-width: 500px) {
    margin-top: 50px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const BigButton = styled(Button) `
  margin-bottom: 20px !important;
  font-size: 1.5em !important;
  color: white !important;
  background: ${MAIN_COLOR} !important;
`;

export default class Login extends Component {
  state = {
    connexionOpen: false,
    error: false,
    loading: false,
    username: '',
    password: '',
  };

  handleRequestClose = () => {
    this.setState({ connexionOpen: false, loading: false });
  };

  handleLoginForm = (key, event) => {
    this.setState({ [key]: event.target.value });
  };

  handleConnect = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.setState({ loading: true });
    authData.connect(username, password).then(res => {
      this.handleRequestClose();
    }).catch(err => {
      if (err.response) {
        if (err.response.status === 401) {
          this.setState({ error: true, loading: false });
        }
        if (err.response.status === 503) {
          sendAlert("Serveur indisponible", 'error');
        }
      } else {
        this.setState({ loading: false });
        sendAlert("Serveur indisponible", 'error');
      }
    });
  };

  isLoginDisabled() {
    const { loading, username, password } = this.state;
    return loading || (username === '' || password === '');
  }

  render() {
    const images = [1, 2, 3, 4, 5].map(e => `img/login/${e}-medium.jpg`);
    return (
      <Container>
        {
          authData.isLoggedIn() &&
          <Redirect to="/accueil" />
        }
        <BackgroundContainer>
          <SlideShow
            auto
            loop
            coverMode="cover"
            items={images}
            duration={5}
          />
        </BackgroundContainer>
        <Content>
          <TitleContainer>
            <TitleHeader>
              <div>
                <Title>ISEPLive.fr</Title>
              </div>
              <Subtitle>Espace étudiant de l'Isep</Subtitle>
            </TitleHeader>
            <LogoPartner>
              <a href="https://www.juniorisep.com" target="_blank" rel="noopener noreferrer"><Logo src="/img/login/juniorisep.png" alt="Junior ISEP logo" /></a>
              <a href="https://www.bdedestiny.com/" target="_blank" rel="noopener noreferrer"><Logo src="/img/login/destiny.png" alt="BDE logo" /></a>
              <a href="https://www.isep.fr/" target="_blank" rel="noopener noreferrer"><Logo src="/img/login/isep.png" alt="ISEP logo" /></a>
            </LogoPartner>
          </TitleContainer>
          <AccessContainer>
            <ButtonContainer>
              <BigButton // style={CUSTOM_STYLES.btn}
                onClick={() => this.setState({ connexionOpen: true })}>Se connecter</BigButton>
            </ButtonContainer>
            <ButtonContainer>
              <BigButton component={NavLink} to="/accueil">Accès visiteur</BigButton>
            </ButtonContainer>
          </AccessContainer>
        </Content>
        <LoginForm
          loginDisabled={this.isLoginDisabled()}
          loading={this.state.loading}
          error={this.state.error}
          open={this.state.connexionOpen}
          handleRequestClose={this.handleRequestClose}
          onChange={this.handleLoginForm}
          onConnexion={this.handleConnect}
        />
      </Container>
    );
  }
}
