import {useEffect, useState} from "react"


const useDeviceDetect = (): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobile = Boolean(
            userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
        )
        setIsMobile(mobile)
    }, [])

    return isMobile
}

export default useDeviceDetect