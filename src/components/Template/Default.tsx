import React, { useContext } from "react"
import {Redirect, Route, Switch} from "react-router-dom"
import Events from "../../pages/default/calendar"
import Event from "../../pages/default/event"
import Logout from "../../pages/security/Logout"
import Discovery from "../../pages/default/discovery"
import Navbar, { Header } from "./Navbar"
import Club from "../../pages/default/club"
import Gallery from "../../pages/default/gallery"
import Home from "../../pages/default/home"
import Group from "../../pages/default/group"
import NotFound from "../../pages/errors/NotFound"
import Setting from "../../pages/default/setting"
import NotificationsPage from "../../pages/default/notifications"
import NotificationsOverlay from "../Notification/NotificationOverlay"
import Student from "../../pages/default/student"
import FirstFollow from "../FirstFollow"
import { AppContext } from "../../context/app/context"

const DefaultTemplate: React.FC = () => {
    const { state: { user: { didFirstFollow } } } = useContext(AppContext)
    const {state: {user}} = useContext(AppContext)
    
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar>
                <div id="main" className="flex-grow overflow-y-overlay overflow-y-auto bg-gray-100 relative" style={{ height: "calc(100vh - 3rem)" }}>
                    <Header user={user}/>
                    <Switch>
                        {/* Add your route here */}
                        <Route path="/notifications" strict component={NotificationsPage} />
                        <Route path="/discovery" component={Discovery} />
                        <Route path="/calendar" component={Events} />
                        <Route path="/student/:id" component={Student} />
                        <Route path="/event/:id" component={Event} />
                        <Route path="/club/:id" component={Club} />
                        <Route path="/group/:id" component={Group} />
                        <Route path="/gallery/:id" component={Gallery} />
                        <Route path="/setting" component={Setting} />
                        <Route path="/logout" component={Logout} />
                        <Route path="/" exact component={Home} />

                        <Route path="/404" exact component={NotFound} />
                        <Route path="*" render={() => <Redirect to="/404" />} />
                    </Switch>
                </div>
            </Navbar>
            <NotificationsOverlay />
            { !didFirstFollow && <FirstFollow /> }
        </div>
    )
}


export default DefaultTemplate
