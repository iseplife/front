import React from "react"
import {
    Route,
    Switch,
} from "react-router-dom"
import NotFound from "../../pages/erros/NotFound"
import Events from "../../pages/default/calendar"
import Event from "../../pages/default/event"
import Logout from "../../pages/security/Logout"
import Discovery from "../../pages/discovery"
import Navbar from "./Navbar"
import Club from "../../pages/club"
import Gallery from "../../pages/gallery"


const DefaultTemplate: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar>
                <div id="main" className="flex-grow overflow-y-auto bg-gray-100"
                    style={{height: "calc(100vh - 3rem)"}}>
                    <Switch>
                        {/* Add your route here */}
                        <Route path="/discovery" component={Discovery}/>
                        <Route path="/calendar" component={Events}/>
                        <Route path="/event/:id" component={Event}/>
                        <Route path="/club/:id" component={Club}/>
                        <Route path="/gallery/:id" component={Gallery}/>
                        <Route path="/logout" component={Logout}/>
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </div>
            </Navbar>
        </div>
    )
}

export default DefaultTemplate