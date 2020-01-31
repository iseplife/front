import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound'
import Interceptor from "./Interceptor";
import Events from "../../pages/calendar";
import Event from "../../pages/event";
import Header from "./Header";
import Logout from "../../pages/security/Logout";

const Template: React.FC = () => {
    return (
        <div className="h-full">
            <Interceptor />
            <Header />
            <div id="main" className="h-full overflow-y-auto bg-gray-200" style={{height: "calc(100% - 3rem)"}}>
                <Switch>
                    {/* Add your route here */}
                    <Route path="/calendar" component={Events} />
                    <Route path="/event/:id" component={Event} />
                    <Route path="/logout" children={<Logout />}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            </div>
        </div>
    )
};

export default Template;