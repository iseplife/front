import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { tryMultipleTimes } from "../../../../data/http"
import { getCurrentSession } from "../../../../data/custom/isepdor"

const IOROverlay = () => {
    const [show, setShow] = useState(localStorage.getItem("showIOR2023") == "true")
    useEffect(() => {
        let id = 0
        const fnc = () => {
            if(id == -1)return
            tryMultipleTimes(2, getCurrentSession).then(res => {
                localStorage.setItem("showIOR2023", (!!res.data).toString())
                setShow(!!res.data)
            }).finally(() => id != -1 && setTimeout(fnc, 120_000))
        }
        fnc()
        return () => {
            clearTimeout(id)
            id = -1
        }
    }, [])
    const {pathname} = useLocation()
    return show && pathname != "/isepdor" ? <Link to="/isepdor">
        <div className="fixed top-[15%] z-[99999] right-0 rounded-l-md bg-white shadow-lg border border-neutral-200 p-3 active:bg-neutral-200 transition-colors duration-75">
            <img src="/img/ior/award.svg" alt="ISEP d'OR" className="w-8 h-8" />
        </div>
    </Link> : <></>
}

export default IOROverlay