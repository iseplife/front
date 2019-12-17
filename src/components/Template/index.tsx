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
            <div className="bg-indigo-500 h-12">

            </div>
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