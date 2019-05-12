import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
// import AuthenticatedRoute from './components/Auth/AuthenticatedRoute';
import { MAIN_COLOR, SECONDARY_COLOR } from './colors';
import { backUrl } from './config';
import Login from './pages/login';
import registerServiceWorker from './registerServiceWorker';
import Layout from './components/Layout';
import AlertCenter from './components/Alert';

moment.locale('fr');
axios.defaults.baseURL = backUrl;

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: MAIN_COLOR, //indigo[500],
    },
    secondary: {
      main: SECONDARY_COLOR, //amber[500],
      contrastText: MAIN_COLOR, //indigo[500],
    },
    error: red,

    contrastThreshold: 3,
  },

  overrides: {
    MuiButton: {
      root: {
        color: 'white',
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: 'white',
        color: MAIN_COLOR,
        fontSize: 18,
      },
    },
  },
});

const styledTheme = {
  main: MAIN_COLOR,
  accent: SECONDARY_COLOR,
};

const App = () => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={styledTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="fr">
        <div>
          <Router>
            <Switch>
              <Redirect path="/" exact to="/connexion" />
              <Route path="/connexion" component={Login} />
              <Route path="/" component={Layout} />
            </Switch>
          </Router>
          <AlertCenter />
        </div>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
