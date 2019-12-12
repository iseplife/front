import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import { initializeAxios } from './data/requestFactory';
import Login from "./pages/auth";

initializeAxios();

const App: React.FC = () => {
    return (
       <Router>
           <Switch>
               <Route path="/login" component={Login} />
           </Switch>
       </Router>
    );
};
ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
