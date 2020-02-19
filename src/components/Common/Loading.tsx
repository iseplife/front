import React, {CSSProperties} from "react";
import {IconFA, IconFAProps} from "./IconFA";

type LoadingProps = {
    size?: IconFAProps["size"]
    className?: string
    style?: CSSProperties
}
const Loading: React.FC<LoadingProps> = (p) => (
    <div className={`text-center ${p.className}`} style={p.style}>
        <IconFA name="fa-circle-notch" spin size={p.size} className="text-indigo-200"/>
    </div>
);

export default Loading;