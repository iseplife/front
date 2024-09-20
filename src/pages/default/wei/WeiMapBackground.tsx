import { useEffect, useMemo, useState } from "react"
import {Geolocation} from "@capacitor/geolocation"
import { sendLocation } from "../../../data/wei/rooms/map"

export let setWeiBackgroundGeoPerm: (bool: boolean) => void
export let setWeiBackgroundSendPerm: (bool: boolean) => void

export let weiLastLoc: [number, number, number] = [0, 0, 0]

const WeiMapBackground = () => {

    const debouncedUpdateServerPos = useMemo(() => {
        let lastTime = 0
        let timingWaiting = 0
        return (pos: [number, number, number]) => {
            clearTimeout(timingWaiting)
            const now = Date.now()
            if(now - lastTime > 30000 ){
                lastTime = now
                console.debug("send pos")
                weiLastLoc = pos
                sendLocation(pos[0], pos[1])
            } else {
                timingWaiting = window.setTimeout(() => {
                    lastTime = Date.now()
                    console.debug("send pos")
                    sendLocation(pos[0], pos[1])
                }, lastTime + 30_000 - now)
            }
        }
    }, [])

    const [geoPos, setGeoPos] = useState<[number, number, number]>([0, 0, 0])

    const [geoPerm, setGeoPerm] = useState(false)
    const [sendPermission, setSendPermission] = useState(localStorage.getItem("showSnapMap2024") == "true")
    setWeiBackgroundGeoPerm = setGeoPerm
    setWeiBackgroundSendPerm = setSendPermission

    useEffect(() => {
        Geolocation.checkPermissions().then(perm => {
            if(perm.location == "granted")
                setGeoPerm(true)
        })
    }, [])
    useEffect(() => {
        if(!geoPerm)
            return
        
        const id = Geolocation.watchPosition({ enableHighAccuracy: true }, pos => {
            if(pos)
                setGeoPos([pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy])
        })

        return () => {id.then(id => Geolocation.clearWatch({id}))}
    }, [geoPerm])

    useEffect(() => {
        if(geoPos[0] && /*geoPos[2] < 140 &&*/ sendPermission){
            console.debug("init send")
            debouncedUpdateServerPos(geoPos)
        }
    }, [geoPos, sendPermission])

    return <></>
}

export default WeiMapBackground