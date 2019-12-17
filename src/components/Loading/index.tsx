import React from "react";

interface LoadingProps {
    size?: "xs"| "sm"| "lg"| "2x"| "3x"| "4x"| "5x"| "6x"| "7x"| "8x"| "9x"| "10x"
}

const Loading: React.FC<LoadingProps> = ({size = "sm"}) => (
    <div className="text-center">
        <i className={`text-indigo-200 fas fa-circle-notch fa-spin fa-${size}`}/>
    </div>
);

export default Loading;