import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './i18n';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import { initializeAxios } from './data/requestFactory';
import Login from "./pages/security";

initializeAxios();

const App: React.FC = () => {
    return (
       <Router>
           <Switch>
               <Redirect path="/" exact to="/login" />
               <Route path="/login" component={Login} />
               <Route path="/" component={Login} />
           </Switch>
       </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
