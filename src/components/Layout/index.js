// @flow

import React from 'react';

import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Menu, MenuItem } from '@material-ui/core';

import IconButton from '@material-ui/core/IconButton';
import LockOpen from '@material-ui/icons/LockOpen';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
import { ListItem, ListItemText } from '@material-ui/core';

import Auth from 'components/Auth/AuthComponent';
import AuthenticatedRoute from 'components/Auth/AuthenticatedRoute';

import Forum from '@material-ui/icons/Forum';
import Play from '@material-ui/icons/PlayCircleFilled';
import People from '@material-ui/icons/People';
import Casino from '@material-ui/icons/Casino';
import Event from '@material-ui/icons/Event';
import HelpIcon from '@material-ui/icons/Help';

import Home from 'pages/home';
import PostDetail from 'pages/home/PostDetail';
import Media from 'pages/media';
import AddressBook from 'pages/addressbook';
import AddressBookDetail from 'pages/addressbook/addressbookDetail';
import Club from 'pages/club';
import ClubDetail from 'pages/club/clubDetail';
import Events from 'pages/events';
import EventDetail from 'pages/events/eventDetail';
import CalendarEvents from 'pages/events/calendar';
import NotFound from 'pages/404';
import Resume from 'pages/resume';
import Whoarewe from 'pages/whoAreWe';

import IsepDorPoll from '../../pages/isepdor/Poll';

// import Contact from 'pages/contact';
import Help from 'pages/help';
import LegalNotice from 'pages/legalNotice';
// import UserAgreement from 'pages/userAgreement';
import Admin from 'pages/administration';
import Gallery from 'pages/gallery';

import { MAIN_COLOR, SECONDARY_COLOR } from '../../colors';
import { backUrl, wsUrl } from '../../config';

import Footer from './Footer';

import * as authData from 'data/auth';
import * as userData from 'data/users/student';

import * as roles from '../../constants';

import { sendAlert } from '../../components/Alert';

import Profile from './Profile';
import LoginForm from '../LoginForm';

import Interceptor from './Intercept';

const WIDTH_THRESHOLD = 1080;

const Logo = styled.img`
  height: 50px;
  margin-right: 20px;
`;

const NavMenu = styled.div`
  flex: 1 1 auto;

  > div {
    display: flex;
  }

  > div > div a {
    margin: 0 5px;
  }

  > div > div {
    flex: 1 1 auto;
    text-align: center;
    border-right: 2px solid white;
  }

  > div > div:first-child {
    border-left: 2px solid white;
  }

  @media (max-width: ${props => WIDTH_THRESHOLD}px) {
    display: none;
  }
`;

const Root = styled.div`
  width: 100%;
`;

const Responsive = styled.div`
  display: none;
  @media (max-width: ${p => p.maxWidth}px) {
    display: block;
  }
`;

function Nav(props) {
  return (
    <div>
      <Button
        component={NavLink}
        to={props.to}
        activeStyle={{
          color: SECONDARY_COLOR,
        }}
      >
        {props.children}
      </Button>
    </div>
  );
}

function SideNav(props) {
  return (
    <NavLink to={props.to}>
      <ListItem button>
        <ListItemText primary={props.children} />
      </ListItem>
    </NavLink>
  );
}

const NavItem = props => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {props.children}
  </div>
);

const NavIcon = props => (
  <props.icon style={{ color: MAIN_COLOR, marginRight: 10 }} />
);

const navListMenu = Component => (
  <div>
    <Component to="/accueil">
      <NavItem>
        <NavIcon icon={Forum} />
        <div style={{ color: MAIN_COLOR }}>Accueil</div>
      </NavItem>
    </Component>
    <Component to="/media">
      <NavItem>
        <NavIcon icon={Play} />
        <div style={{ color: MAIN_COLOR }}>Media</div>
      </NavItem>
    </Component>
    <Auth>
      <Component to="/annuaire">
        <NavItem>
          <NavIcon icon={People} />
          <div style={{ color: MAIN_COLOR }}>Annuaire</div>
        </NavItem>
      </Component>
    </Auth>
    <Component to="/associations">
      <NavItem>
        <NavIcon icon={Casino} />
        <div style={{ color: MAIN_COLOR }}>Associations</div>
      </NavItem>
    </Component>
    <Component to="/evenements">
      <NavItem>
        <NavIcon icon={Event} />
        <div style={{ color: MAIN_COLOR }}>Evenements</div>
      </NavItem>
    </Component>
    <Component to="/whoarewe">
      <NavItem>
        <NavIcon icon={HelpIcon} />
        <div style={{ color: MAIN_COLOR }}>Qui sommes-nous ?</div>
      </NavItem>
    </Component>
  </div>
);

const navListBar = Component => (
  <div>
    <Component to="/accueil">Accueil</Component>
    <Component to="/media">Media</Component>
    <Auth>
      <Component to="/annuaire">Annuaire</Component>
    </Auth>
    <Component to="/associations">Associations</Component>
    <Component to="/evenements">Evenements</Component>
    <Component to="/whoarewe">Qui sommes-nous ?</Component>
  </div>
);

class Layout extends React.Component {
  state = {
    sidebarOpen: false,
    anchorEl: undefined,
    open: false,
    error: false,
    loading: false,
    connexionOpen: false,
    username: '',
    password: '',
  };

  Profile = undefined;

  componentDidMount() {
    this.restartWS = true;
    this.setupNotifications();
  }

  componentWillUnmount() {
    if (this.conn) {
      this.restartWS = false;
      this.conn.close();
      clearTimeout(this.restartTimeout);
    }
  }

  initWebsocket() {
    this.conn = new WebSocket(wsUrl + '/ws/post');
    this.conn.onopen = () => {
      this.conn.send(localStorage.getItem('token'));
    };

    this.conn.onmessage = msg => {
      try {
        const message = JSON.parse(msg.data);
        const authorData = message.author;
        const body =
          authorData.authorType === 'club' ? message.title : message.content;
        const image =
          authorData.authorType === 'club'
            ? authorData.logoThumbUrl
            : authorData.photoUrlThumb;

        Notification.requestPermission().then(status => {
          if (status !== 'denied') {
            new Notification('Nouveau Post !', { body, icon: backUrl + image }); // this also shows the notification
            const postEvent = new CustomEvent('new-post');
            document.dispatchEvent(postEvent);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    this.conn.onclose = e => {
      if (this.restartWS) {
        this.restartTimeout = setTimeout(() => {
          this.initWebsocket();
        }, 5000);
      }
    };
  }

  setupNotifications = async () => {
    Notification.requestPermission();
    if (authData.isLoggedIn()) {
      const res = await userData.getLoggedUser();
      if (res.data.allowNotifications) {
        if (window.WebSocket) {
          this.initWebsocket();
        }
      }
    }
  };

  handleSideBarClose = () => {
    this.setState({ sidebarOpen: false });
  };

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
    this.setState({ connexionOpen: false });
  };

  handleDisconnect = () => {
    authData.logout();
    this.setState({ open: false });
  };

  handleLoginForm = (name, event) => {
    this.setState({ [name]: event.target.value });
  };

  handleConnect = e => {
    e.preventDefault();
    const { username, password } = this.state;
    authData
      .connect(
        username,
        password
      )
      .then(res => {
        this.handleRequestClose();
        this.props.history.push('/');
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            this.setState({ error: true, loading: false });
          }
          if (err.response.status === 503) {
            sendAlert('Serveur indisponible', 'error');
          }
        } else {
          this.setState({ loading: false });
          sendAlert('Serveur indisponible', 'error');
        }
      });
  };

  isLoginDisabled() {
    const { loading, username, password } = this.state;
    return loading || (username === '' || password === '');
  }

  render() {
    return (
      <Root>
        <Interceptor />
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <Responsive maxWidth={WIDTH_THRESHOLD}>
              <IconButton
                color="secondary"
                onClick={() => this.setState({ sidebarOpen: true })}
              >
                <MenuIcon />
              </IconButton>
            </Responsive>
            <Link to="/">
              <Logo src="/img/layout/iseplive.png" alt="isep-live-logo" />
            </Link>
            <NavMenu>{navListBar(Nav)}</NavMenu>
            <span style={{ marginLeft: 'auto' }}>
              <Auth>
                <Profile onClick={this.handleClick} />
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={this.state.open}
                  onClose={this.handleRequestClose}
                >
                  {authData.hasRole([roles.ADMIN, roles.USER_MANAGER]) && (
                    <MenuItem
                      onClick={this.handleRequestClose}
                      component={NavLink}
                      to="/administration"
                    >
                      Administration
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={this.handleRequestClose}
                    component={NavLink}
                    to="/profile"
                  >
                    Profil
                  </MenuItem>
                  <MenuItem
                    onClick={this.handleDisconnect}
                    component={NavLink}
                    to="/connexion"
                  >
                    Déconnexion
                  </MenuItem>
                </Menu>
              </Auth>
            </span>
            <Auth not>
              <IconButton
                style={{ marginLeft: 10 }}
                onClick={() => this.setState({ connexionOpen: true })}
              >
                <LockOpen style={{ color: 'white' }} />
              </IconButton>
              <LoginForm
                loginDisabled={this.isLoginDisabled()}
                loading={this.state.loading}
                error={this.state.error}
                open={this.state.connexionOpen}
                handleRequestClose={this.handleRequestClose}
                onChange={this.handleLoginForm}
                onConnexion={this.handleConnect}
              />
            </Auth>
          </Toolbar>
        </AppBar>
        <Responsive maxWidth={WIDTH_THRESHOLD}>
          <Drawer
            anchor="left"
            open={this.state.sidebarOpen}
            onClose={this.handleSideBarClose}
            onClick={this.handleSideBarClose}
          >
            {navListMenu(SideNav)}
          </Drawer>
        </Responsive>
        <Switch>
          <Redirect path="/" exact to="/accueil" />
          <Route path="/accueil" component={Home} />
          <Route path="/post/:id" component={PostDetail} />
          <Route path="/media" component={Media} />
          <Route path="/gallery/:id" component={Gallery} />
          <Route exact path="/annuaire" component={AddressBook} />
          <Route path="/annuaire/:id" component={AddressBookDetail} />
          <Route exact path="/associations" component={Club} />
          <Route path="/associations/:id" component={ClubDetail} />
          <Route exact path="/evenements" component={Events} />
          <Route path="/evenements/calendrier" component={CalendarEvents} />
          <Route path="/evenements/:id" component={EventDetail} />
          <Route path="/profile" component={Resume} />
          <Route path="/whoarewe" component={Whoarewe} />
          <Route path="/contact" component={NotFound} />
          <Route path="/isepdor/poll" component={IsepDorPoll} />
          <Route path="/aide" component={NotFound} />
          <Route path="/convention-utilisation" component={NotFound} />
          <Route path="/mentions-legales" component={LegalNotice} />
          <AuthenticatedRoute
            roles={[roles.ADMIN, roles.USER_MANAGER]}
            path="/administration"
            component={Admin}
          />
          <Route path="*" component={NotFound} />
        </Switch>
        <Footer />
      </Root>
    );
  }
}

export default Layout;
