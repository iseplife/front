import React from "react";

export type IconProps = {
    name: string;
    spin?: boolean
    size?: "xs" | "sm" | "lg" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x"
    style?: "solid" | "regular" | "light" | "duotone" | "brands"
}


export const Icon: React.FC<IconProps> = ({name, spin, size, style}) => {
    return (
        <i className={`text-indigo-200 far ${"fa" + style?.charAt(0)} ${spin ? "fa-spin" : ""} ${name} fa-${size}`}/>
    );
};
Icon.defaultProps = {
    spin: false,
    size: "sm",
    style: "regular"
};


type IconButtonProps = {
    className?: string
}
export const IconButton: React.FC<IconButtonProps & IconProps> = (props) => {
    return (
        <div className={`cursor-pointer rounded-full hover:bg-indigo-400 ${props.className}`}>
            <Icon {...props} />
        </div>
    );
};
IconButton.defaultProps = {
    className: "",
    spin: false,
    size: "sm",
    style: "regular"
};

export const IconButtonFooter: React.FC<IconButtonProps & IconProps & { active?: boolean }> = (props) => {
    return (
        <div
            className={`cursor-pointer p-2 rounded-full ${props.className}`}>
            <Icon {...props} />
        </div>
    );
};
IconButtonFooter.defaultProps = {
    active: false,
    className: "",
    spin: false,
    size: "sm",
    style: "regular"
};
