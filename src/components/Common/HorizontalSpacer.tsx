import React from "react";

interface SpacerProps {
    spacing?: number
}

export const HorizontalSpacer = (props: SpacerProps) => {
    let size: string = "my-" + (props.spacing);
    return (
        <div className={size}/>
    );
};

HorizontalSpacer.defaultProps = {
    spacing: 2
};