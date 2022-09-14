import React, { useEffect } from "react"
import { isWeb } from "../../data/app"

const HeightFix: React.FC = () => {
    useEffect(() => {
        if(isWeb && !document.getElementById("hstyle")) {
            const style = document.createElement("style")
            style.id = "hstyle"
            style.innerText = `.h-screen {
                height: 100vh !important;
                height: calc(var(--vh, 1vh) * 100) !important;
            }`
            document.head.appendChild(style)
        }

        const resize = () =>
            document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`)

        resize()
        
        window.addEventListener("resize", resize)
        return () => window.removeEventListener("resize", resize)
    }, [])
    return <></>
}

export default HeightFix
