import React from "react";

export type IconFAProps = {
    name: string,
    spin?: boolean,
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    size?: "xs" | "sm" | "lg" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x",
    type?: "solid" | "regular" | "light" | "duotone" | "brands",
    className?: string
}

export const IconFA: React.FC<IconFAProps> = ({name, spin, size, style, className}) => {
    return (
        <i className={`${className} ${"fa" + style?.charAt(0)} ${spin ? "fa-spin" : ""} ${name} fa-${size}`}/>
    );
};
IconFA.defaultProps = {
    spin: false,
    size: "sm",
    style: "regular",
    className: ""
};
