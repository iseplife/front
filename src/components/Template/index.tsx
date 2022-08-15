import React, {useLayoutEffect, useState} from "react"
import {
    Redirect,
    Route,
    Switch, useLocation
} from "react-router-dom"

import DefaultTemplate from "./Default"
import AdminTemplate from "./Admin"
import useAdminRole from "../../hooks/useAdminRole"
import { arrayEquals } from "../../util"

//Map icon fix
import { Marker as LeafletMarker } from "react-leaflet"
import {icon} from "leaflet"
import marker_icon from "leaflet/dist/images/marker-icon.png"
import "leaflet/dist/leaflet.css"
import NotificationFaviconTitle from "../Notification/NotificationFaviconTitle"
(LeafletMarker as any as React.FC).defaultProps = { icon: icon({ iconUrl: marker_icon, className: "left-[-12px] top-[-41px] width-[25px] height-[41px]" }) }
//Map icon fix


const Template: React.FC = () => {
    const { pathname } = useLocation()
    const isAdmin = useAdminRole()

    const [,setPreviousUrl] = useState<string[]>([])

    useLayoutEffect(() => {
        setPreviousUrl(previousUrl => {
            const newSplitted = pathname.split("/")
            newSplitted.shift()

            if(!arrayEquals(newSplitted.slice(0, 2), previousUrl.slice(0, 2)))
                document.getElementById("main")?.scrollTo(0, 0)

            return newSplitted
        })
    }, [pathname])

    return <>
        <NotificationFaviconTitle />
        <Switch>
            <Route path="/admin" render={({location}) =>
                (
                    isAdmin ?
                        <AdminTemplate/> :
                        <Redirect
                            to={{
                                pathname: "/404",
                                state: {from: location}
                            }}
                        />
                )}
            />
            <Route path="/" component={DefaultTemplate}/>
        </Switch>
    </>
}

export default Template
