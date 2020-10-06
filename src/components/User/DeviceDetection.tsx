import {useMemo} from "react"


const useDeviceDetect = (): boolean => {
    return useMemo(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent
        return Boolean(
            userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))
    }, [])
}

export default useDeviceDetect