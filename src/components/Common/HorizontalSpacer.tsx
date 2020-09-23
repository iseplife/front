import React from "react"

interface SpacerProps {
    spacing?: number
}

export const HorizontalSpacer: React.FC<SpacerProps> = ({spacing}) => {
    const size: string = "my-" + (spacing)
    return (
        <div className={size}/>
    )
}

HorizontalSpacer.defaultProps = {
    spacing: 2
}
