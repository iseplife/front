import React, { useEffect } from "react"
import "./HeightFix.css"

const HeightFix: React.FC = () => {
    useEffect(() => {
        const resize = () => 
            document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`)
        
        resize()
        
        window.addEventListener("resize", resize)
        return () => window.removeEventListener("resize", resize)
    
    }, [])
    return <></>
}

export default HeightFix