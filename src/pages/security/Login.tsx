import React, { useEffect, useRef, useState } from "react"
import { isWeb } from "../../data/app"
import SSOLogin from "./SSOLogin"
import UserPassLogin from "./UserPassLogin"
import { CapacitorUpdater } from "@capgo/capacitor-updater"

const Login: React.FC = () => {
    const [loading, setLoadingStatus] = useState<boolean>(!isWeb)
    const useSSO = useRef<boolean>(isWeb)

    useEffect(() => {
        if(!isWeb)
            CapacitorUpdater.current().then(cu => {
                try {
                    const version = cu.native.split(".")
                    useSSO.current = version.length == 1 ? +version[0] >= 2 : +version[1] >= 8
                }catch(e) {
                    throw new Error("Unsupported version for SSO "+cu.native)
                }
                setLoadingStatus(false)
            })
    }, [])

    return loading ? <></> : useSSO.current ? <SSOLogin /> : <UserPassLogin />
}

export default Login