import React, {CSSProperties} from "react";

type LoadingProps = {
    size?: "xs"| "sm"| "lg"| "2x"| "3x"| "4x"| "5x"| "6x"| "7x"| "8x"| "9x"| "10x"
    className?: string
    style?: CSSProperties
}
const Loading: React.FC<LoadingProps> = ({size = "sm", className = "", style}) => (
    <div className={`text-center ${className}`} style={style}>
        <i className={`text-indigo-200 fas fa-circle-notch fa-spin fa-${size}`}/>
    </div>
);

export default Loading;