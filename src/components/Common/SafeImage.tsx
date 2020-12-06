import React, {ImgHTMLAttributes, useState} from "react";
import {IconFA} from "./IconFA";
import {Typography} from "antd";


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {nsfw?: boolean}

const SafeImage: React.FC<SafeImageProps> = (props) => {

    const userNSFW = !localStorage.getItem("nsfw") || Boolean(localStorage.getItem("nsfw"))
    const [NSFW, setNSFW] = useState<boolean>(!(userNSFW && props.nsfw));
    const blurredImageStyle: React.CSSProperties = {WebkitFilter: "blur(12px)", filter: "blur(12px)", msFilter: "blur(12px)"}

    console.log(props)
    return(
        <div className={`image-display relative bg-gray-400`} style={{height: "100%", width: "100%"}}>
            <img {...props} style={NSFW ? {...props.style, ...blurredImageStyle} : {...props.style}}/>
            {NSFW && <div style={{left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%)"}} >
                <span style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}} onClick={() => setNSFW(false)}>
                    <IconFA name="fa-eye-slash" size="lg" type="regular" />
                    <Typography>NSFW</Typography>
                </span>
            </div>}
        </div>
    )

}

export default SafeImage;
