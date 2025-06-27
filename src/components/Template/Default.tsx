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
import AddEventPage from "../../pages/default/event/add"
import EventEditPage from "../../pages/default/event/edit"
import WeiPage from "../../pages/default/wei"
import WeiRoomsPage from "../../pages/default/wei/rooms"
import WeiRoomPage from "../../pages/default/wei/rooms/room"
import WeiMapPage from "../../pages/default/wei/map"
import CustomComing from "../../pages/default/custom"
import IsepDor from "../../pages/default/custom/isepdor"
import IOROverlay from "../../pages/default/custom/isepdor/IOROverlay"
import SetupPasswordPopup from "../SetupPasswordPopup"
// import WeiMapBackground from "../../pages/default/wei/WeiMapBackground"
// import WeiMapOverlay from "../../pages/default/wei/map/WeiMapOverlay"

const DefaultTemplate: React.FC = () => {
    const { state: { user } } = useContext(AppContext)
    
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar>
                <div id="main" className="flex-grow overflow-y-overlay overflow-y-auto bg-gray-100 relative" style={{ height: "calc(100vh - 3rem)" }}>
                    <Header user={user}/>
                    <Switch>
                        {/* Add your route here */}
                        <Route path="/notifications" strict component={NotificationsPage} />
                        <Route path="/discovery" component={Discovery} />
                        <Route path="/student/:id" component={Student} />
                        <Route path="/calendar" component={Events} />
                        <Route path="/event/create" component={AddEventPage} />
                        <Route path="/event/:id/edit" component={EventEditPage} />
                        <Route path="/event/:id" component={Event} />
                        <Route path="/club/:id" component={Club} />
                        <Route path="/group/:id" component={Group} />
                        <Route path="/gallery/:id" component={Gallery} />
                        <Route path="/wei/rooms/:id" component={WeiRoomPage} />
                        <Route path="/wei/rooms" component={WeiRoomsPage} />
                        <Route path="/wei/map" component={WeiMapPage} />
                        <Route path="/wei" component={WeiPage} />
                        <Route path="/isepdor" component={IsepDor} />
                        <Route path="/c/isepdor" component={IsepDor} />
                        <Route path="/c/map" render={_ => <Redirect to={{
                            pathname: "/wei/map",
                        }}/>} />
                        
                        <Route path="/c" component={CustomComing} />
                        <Route path="/setting" component={Setting} />
                        <Route path="/logout" component={Logout} />
                        <Route path="/" exact component={Home} />

                        <Route path="*" render={NotFound} />
                    </Switch>
                </div>
            </Navbar>
            <NotificationsOverlay />
            {/* 
            <WeiMapBackground />
            <WeiMapOverlay />
            */}
            <IOROverlay />
            { !user.passwordSetup && user.promo <= new Date().getFullYear() && <SetupPasswordPopup /> }
            { !user.didFirstFollow && <FirstFollow /> }
        </div>
    )
}


export default DefaultTemplate
