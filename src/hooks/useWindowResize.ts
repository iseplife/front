import { useState, useLayoutEffect } from "react"

const useWindowResize = () => {
    const [size, setSize] = useState([0, 0])

    useLayoutEffect(() => {
        const updateSize = () => setSize([window.innerWidth, window.innerHeight])

        updateSize()
        window.addEventListener("resize", updateSize)

        return () => window.removeEventListener("resize", updateSize)
    }, [])

    return size
}

export default useWindowResize