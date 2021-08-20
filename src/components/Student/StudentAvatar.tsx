import React, {memo, ReactNode, useMemo} from "react"
import {Avatar} from "antd"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Link} from "react-router-dom"
import {AvatarSize} from "antd/lib/avatar/SizeContext"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUser} from "@fortawesome/free-regular-svg-icons"


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
            className: `text-center no-underline cursor-pointer ${className}`,
            to: (location: Location) => `${location.pathname}/student/${id}`
        } :
        {
            className: `text-center no-underline ${className}`
        }, [showPreview])


    return (
        <Wrapper {...wrapperProps as any} className="my-auto">
            <Avatar
                src={mediaPath(picture, pictureSize)}
                icon={<FontAwesomeIcon icon={faUser} />}
                alt={name}
                size={size}
                className="hover:shadow-outline "
            />
            {children}
        </Wrapper>
    )
}
StudentAvatar.defaultProps = {
    className: ""
}


export default memo(StudentAvatar)
