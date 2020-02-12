import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './i18n';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import {initializeAxios} from './data/requestFactory';
import Login from "./pages/security";
import {isLoggedIn} from "./data/security";
import Template from "./components/Templates";
import "antd/dist/antd.css";
import {EventEmitter} from "events";

initializeAxios();
export const mobileViewPortDetectionEvent = new EventEmitter();
const App: React.FC = () => {

    const handleWindowSizeChange = () => {
        mobileViewPortDetectionEvent.emit('isMobileViewPort', window.innerWidth <= 500)
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => window.removeEventListener('resize', handleWindowSizeChange);
    });

    return (
       <Router>
           <Switch>
               <Route path="/login" component={Login}/>
               <Route path="/" render={({location}) =>
                   (
                       isLoggedIn() ?
                           <Template/>
                           :
                           <Redirect
                               to={{
                                   pathname: "/login",
                                   state: {from: location}
                               }}
                           />
                   )
               }/>
           </Switch>
       </Router>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.register();
