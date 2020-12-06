import React, {ImgHTMLAttributes} from "react";
import {IconFA} from "./IconFA";
import {Divider} from "antd";


type BlurryImageProps = ImgHTMLAttributes<HTMLImageElement> & {nsfw?: boolean}

const BlurryImage: React.FC<BlurryImageProps> = (props: BlurryImageProps) => {

    const blurredImageStyle: React.CSSProperties = {WebkitFilter: "blur(12px)", filter: "blur(12px)", msFilter: "blur(12px)"}
    const userNSFW = !localStorage.getItem("nsfw") || Boolean(localStorage.getItem("nsfw"))

    return(
        <div className={`image-display relative bg-gray-400`}>
            <img {...props} style={!(userNSFW && props.nsfw) ? {...props.style, ...blurredImageStyle} : {...props.style}}/>
            <div style={{left: "50%", top: "50%", position: "absolute"}} >
                <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <IconFA name="fa-eye-slash" size="lg" type="regular" />
                    <Divider>NSFW</Divider>
                </div>
            </div>
        </div>
    )

}

export default BlurryImage;
