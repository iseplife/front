import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Events from "../../pages/calendar";

const Template = () => {
    return (
        <div className="h-full">
            <div id="header" className="bg-teal-900 h-12">

            </div>
            <div id="main" className="h-full overflow-y-auto" style={{height: "calc(100% - 3rem)"}}>
                <Switch>
                    {/* Add your route here */}
                    <Route path="/calendar" component={Events} />
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        </div>
    )
};

export default Template;