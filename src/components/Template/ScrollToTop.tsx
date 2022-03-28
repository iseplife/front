import { useEffect, useLayoutEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()

    useLayoutEffect(() =>
        document.getElementById("main")?.scrollTo(0, 0)
    , [pathname])

    return null
}

export default ScrollToTop