import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Interceptor from "./Interceptor";

const Template: React.FC = () => {
    return (
        <div>
            <Interceptor />
            <h1>default template</h1>
            <div>
                <Switch>
                    {/* Add your route here */}
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        </div>
    )
};

export default Template;