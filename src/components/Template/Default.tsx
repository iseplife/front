import React from 'react';
import {
    Route,
    Switch,
} from 'react-router-dom';
import NotFound from '../../pages/erros/NotFound';
import Events from "../../pages/default/calendar";
import Event from "../../pages/default/event";
import Logout from "../../pages/security/Logout";
import Navbar from "./Navbar";


const DefaultTemplate: React.FC = () => {
    return (
            <div className="h-full overflow-hidden">
                <Navbar>
                    <div id="main" className="h-full overflow-y-auto bg-gray-100"
                         style={{height: "calc(100% - 3rem)"}}>
                        <Switch>
                            {/* Add your route here */}
                            <Route path="/calendar" component={Events}/>
                            <Route path="/event/:id" component={Event}/>
                            <Route path="/logout" children={<Logout/>}/>
                            <Route path="*" component={NotFound}/>
                       </Switch>
                    </div>
                </Navbar>
            </div>
    )
};

export default DefaultTemplate;