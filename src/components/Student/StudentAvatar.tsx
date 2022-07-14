import React, {memo, ReactNode, useMemo} from "react"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Link} from "react-router-dom"
import {AvatarSize} from "antd/lib/avatar/SizeContext"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import { WebPAvatarPolyfill } from "../Common/WebPPolyfill"


const BasicWrapper: React.FC = (props) => <span {...props}/>


type StudentAvatarProps = {
    id: number
    name: string
    picture?: string
    pictureSize?: AvatarSizes
    size?: AvatarSize
    showPreview?: boolean
    className?: string
    style?: CSSStyleSheet
    children?: ReactNode
}
const StudentAvatar: React.FC<StudentAvatarProps> = ({id, name, picture, pictureSize = AvatarSizes.DEFAULT, size, children, className, showPreview = false}) => {
    const Wrapper = useMemo(() => showPreview ? Link : BasicWrapper, [showPreview])
    const wrapperProps = useMemo(() => showPreview ?
        {
            className: `text-center no-underline cursor-pointer my-auto flex items-center ${className}`,
            to: () => `/student/${id}`
        } :
        {
            className: `text-center no-underline my-auto flex md:text-gray-500 hover:text-gray-600 flex ${className}`
        }, [showPreview])


    return (
        <Wrapper {...wrapperProps as any}>
            <WebPAvatarPolyfill
                src={mediaPath(picture, pictureSize)}
                icon={<FontAwesomeIcon icon={faUser} />}
                alt={name}
                size={size}
                className="hover:shadow-outline"
            />
            {children}
        </Wrapper>
    )
}
StudentAvatar.defaultProps = {
    className: ""
}


export default memo(StudentAvatar)
