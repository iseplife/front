import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { initializeAxios } from './data/requestFactory';

initializeAxios();

const App: React.FC = () => {
    return (
        <p>Hello world !</p>
    );
};
ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
