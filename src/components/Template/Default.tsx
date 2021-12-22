import React, { useCallback, useEffect, useState } from "react"
import {Route, Switch,} from "react-router-dom"
import Events from "../../pages/default/calendar"
import Event from "../../pages/default/event"
import Logout from "../../pages/security/Logout"
import Discovery from "../../pages/default/discovery"
import Navbar from "./Navbar"
import Club from "../../pages/default/club"
import Gallery from "../../pages/default/gallery"
import Home from "../../pages/default/home"
import Group from "../../pages/default/group"
import NotFound from "../../pages/errors/NotFound"
import StudentDrawer from "../Student/StudentDrawer"
import Setting from "../../pages/default/setting"
import NotificationsCenter from "../Notification/NotificationsCenter"
import NotificationsPage from "../../pages/default/notifications"


const DefaultTemplate: React.FC = () => {
    const [notifsCenterOpen, setNotifsCenterOpen] = useState(false)
    const openNotifsCenter = useCallback(() => setNotifsCenterOpen(true), [])

    useEffect(() => {
        const func = ({ target }: { target: EventTarget | null }) => {
            if (notifsCenterOpen) {
                while (target && target != document.documentElement && (target = (target as HTMLElement).parentElement))
                    if((target as HTMLElement).classList.contains("notif_center"))
                        return
                setNotifsCenterOpen(false)
            }
        }

        window.addEventListener("click", func)

        return () => window.removeEventListener("click", func)
    })

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar openNotifsCenter={openNotifsCenter}>
                <div id="main" className="flex-grow overflow-y-auto bg-gray-100"
                    style={{height: "calc(100vh - 3rem)"}}>
                    <Switch>
                        {/* Add your route here */}
                        <Route path="/notifications" strict component={NotificationsPage}/>
                        <Route path="/discovery" component={Discovery}/>
                        <Route path="/calendar" component={Events}/>
                        <Route path="/event/:id" component={Event}/>
                        <Route path="/club/:id" component={Club}/>
                        <Route path="/group/:id" component={Group}/>
                        <Route path="/gallery/:id" component={Gallery}/>
                        <Route path="/setting" component={Setting}/>
                        <Route path="/logout" component={Logout}/>
                        <Route path="/" strict component={Home}/>
                        <Route path="*" component={NotFound}/>
                    </Switch>
                </div>
            </Navbar>
            {notifsCenterOpen && <NotificationsCenter className="hidden md:block" />}
            <StudentDrawer/>
        </div>
    )
}

export default DefaultTemplate