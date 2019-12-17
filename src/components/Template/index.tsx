import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Calendar from "../../pages/calendar";

const Template = () => {
    return (
        <div>
            <h1>default template</h1>
            <div className="h-full">
                <Switch>
                    {/* Add your route here */}
                    <Route path="/calendar" component={Calendar} />
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        </div>
    )
};

export default Template;