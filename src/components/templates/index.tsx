import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Interceptor from "./Interceptor";
import Events from "../../pages/calendar";
import Event from "../../pages/event";

const Template: React.FC = () => {
    return (
        <div className="h-full">
            <Interceptor />
            <div id="header" className="bg-indigo-500 h-12 shadow-md">

            </div>
            <div id="main" className="h-full overflow-y-auto bg-gray-200" style={{height: "calc(100% - 3rem)"}}>
                <Switch>
                    {/* Add your route here */}
                    <Route path="/calendar" children={<Events />} />
                    <Route path="/event/:id" children={<Event />} />
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        </div>
    )
};

export default Template;