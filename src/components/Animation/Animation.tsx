
import { useLottie } from "lottie-react"
import { useEffect, useMemo, useState } from "react"
import { Animation as AnimationData } from "react-useanimations/utils"

interface AnimationProps {
    animation: AnimationData
    enabled: boolean
    size?: number,
    className?: string,
}

const style = document.createElement("style")
style.innerHTML = ".animated-svg path { fill: currentColor; stroke: currentColor }"
document.head.appendChild(style)

const Animation: React.FC<AnimationProps> = ({ animation, enabled, size, className }) => {
    const lottie = useLottie({
        animationData: animation.animationData,
        loop: false,
        className: `animated-svg ${className}`,
    }, {
        width: `${size}px`,
        height: `${size}px`,
    })

    useEffect(() => {
        lottie.setDirection(enabled ? 1 : -1)
        lottie.play()
    }, [enabled])

    return lottie.View
}

export default Animation