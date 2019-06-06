import DateFnsUtils from '@date-io/date-fns';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import frLocale from 'date-fns/locale/fr';
// TODO: avoid using both date-fns and moment, migrate to date-fns later
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
import AlertCenter from './components/Alert';
import Layout from './components/Layout';
import { backUrl } from './config';
import Login from './pages/login';
import registerServiceWorker from './registerServiceWorker';

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
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
        <>
          <Router>
            <Switch>
              <Redirect path="/" exact to="/connexion" />
              <Route path="/connexion" component={Login} />
              <Route path="/" component={Layout} />
            </Switch>
          </Router>
          <AlertCenter />
        </>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
