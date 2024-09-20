import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { tryMultipleTimes } from "../../../../data/http"
import { isActivated } from "../../../../data/wei/rooms/map"

const WeiMapOverlay = () => {
    const [show, setShow] = useState(localStorage.getItem("showWeiMap2024") == "true")
    useEffect(() => {
        let id = 0
        const fnc = () => {
            if(id == -1)return
            tryMultipleTimes(2, isActivated).then(res => {
                localStorage.setItem("showWeiMap2024", res.data.enabled.toString())
                localStorage.setItem("showSnapMap2024", res.data.snapmap.toString())
                setShow(res.data.enabled)
            }).finally(() => id != -1 && setTimeout(fnc, 30_000))
        }
        fnc()
        return () => {
            clearTimeout(id)
            id = -1
        }
    }, [])
    const {pathname} = useLocation()
    return show && pathname != "/wei/map" ? <Link to="/wei/map">
        <div className="fixed top-[15%] z-[99999] right-0 rounded-l-md bg-white shadow-lg border border-neutral-200 p-3 active:bg-neutral-200 transition-colors duration-75">
            <img src="/img/wei/map/map.svg" alt="Map" className="w-8 h-8" />
        </div>
    </Link> : <></>
}

export default WeiMapOverlay