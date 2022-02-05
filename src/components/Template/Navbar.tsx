import React, {useContext, useMemo, useState} from "react"
import {Button, Divider, Drawer} from "antd"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {LoggedStudentPreview, Student, StudentPreview} from "../../data/student/types"
import "./Navbar.css"
import {Roles} from "../../data/security/types"
import SearchBar from "../SearchBar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import {faCogs, faHome, faSignOutAlt, faUserShield} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import {faBell, faCalendarAlt, faCompass} from "@fortawesome/free-regular-svg-icons"
import DropdownPanel from "../Common/DropdownPanel"
import NotificationsCenter from "../Notification/NotificationsCenter"

type IconButtonProps = {
    icon: IconDefinition
}
const IconButton: React.FC<IconButtonProps> = ({icon}) => {
    return (
        <div className="flex p-2 cursor-pointer rounded-full mx-3 hover:bg-indigo-400 hover:text-white text-indigo-300">
            <FontAwesomeIcon icon={icon}/>
        </div>
    )
}

const ProfilePanel: React.FC = () => {
    const {state: {payload}} = useContext(AppContext)
    const {t} = useTranslation()
    const isAdmin = useMemo(() => payload.roles.includes(Roles.ADMIN), [payload.roles])
    return (
        <div className="">
            {isAdmin && (
                <Link
                    to="/admin"
                    className="flex items-center text-gray-500 m-1 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 rounded transition-colors"
                >
                    {t("administration")}
                    <FontAwesomeIcon icon={faUserShield} className="ml-2"/>
                </Link>
            )}
            <Link
                to="/setting"
                className="flex items-center text-gray-500 m-1 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 rounded transition-colors"
            >
                {t("setting")}
                <FontAwesomeIcon icon={faCogs} className="ml-2"/>
            </Link>
            <Divider className="my-2"/>
            <Link
                to="/logout"
                className="flex justify-center text-red-500 mx-3 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 rounded transition-colors"
            >
                {t("logout")}
            </Link>
        </div>
    )
}

interface HeaderProps {
    user: LoggedStudentPreview
}

const Header: React.FC<HeaderProps> = ({user}) => {
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    return (
        <div className="flex justify-between px-5 bg-white h-14 shadow-sm z-30">
            <Link to="/" className="flex">
                <img className="my-1" src="https://via.placeholder.com/50" alt="iseplife logo"/>
            </Link>

            <SearchBar/>

            <div className="hidden md:flex justify-end items-center py-5">
                <div className="flex justify-around items-center mr-4">
                    <Link to="/discovery">
                        <IconButton icon={faCompass}/>
                    </Link>
                    <Link to="/calendar">
                        <IconButton icon={faCalendarAlt}/>
                    </Link>
                    <DropdownPanel
                        icon={<IconButton icon={faBell}/>}
                        title={`Notifications (${unwatchedNotifications})`}
                        className="w-80 -right-6"
                    >
                        <NotificationsCenter className="md:block "/>
                    </DropdownPanel>
                </div>
                <DropdownPanel
                    icon={
                        <div className="flex rounded-full ml-1 p-1 hover:bg-indigo-400 hover:text-white text-indigo-300">
                            <StudentAvatar
                                id={user.id}
                                name={user.firstName + " " + user.lastName}
                                picture={user.picture}
                                pictureSize={AvatarSizes.THUMBNAIL}
                                size="small"
                            />
                            <span className="mx-2 ">{user.firstName}</span>
                        </div>
                    }
                    title={user.firstName + " " + user.lastName}
                    panelClassName="w-60 right-6"
                >
                    <ProfilePanel/>
                </DropdownPanel>
            </div>
        </div>
    )
}


type DrawerItemProps = {
    icon: IconDefinition
    className?: string
    link: string
}
const DrawerItem: React.FC<DrawerItemProps> = ({icon, className = "", children, link}) => (
    <Link to={link}>
        <div className={`flex flex-col cursor-pointer text-center mx-2 ${className}`}>
            <FontAwesomeIcon icon={icon}/>
            <span className="nav-footer-text">{children}</span>
        </div>
    </Link>
)
const MobileFooter: React.FC<{ user: StudentPreview }> = ({user}) => {
    const {state: {payload}} = useContext(AppContext)
    const {t} = useTranslation()
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <>
            <div
                className="md:hidden flex justify-around items-center shadow-md w-full h-14 bg-white border-t border-gray-300 border-opacity-80">
                <Link to="/">
                    <Button
                        shape="circle"
                        icon={<FontAwesomeIcon icon={faHome} className="text-xl"/>}
                        className="border-0"
                    />
                </Link>
                <Link to="/calendar">
                    <Button
                        shape="circle"
                        icon={<FontAwesomeIcon icon={faCalendarAlt} className="text-xl"/>}
                        className="border-0"
                    />
                </Link>
                <Link to="/notifications">
                    <Button
                        shape="circle"
                        icon={<FontAwesomeIcon icon={faBell} className="text-xl"/>}
                        className="border-0"
                    />
                </Link>
                <div className="cursor-pointer" onClick={() => setVisible(true)}>
                    <StudentAvatar
                        id={user.id}
                        name={user.firstName + " " + user.lastName}
                        picture={user.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                    />
                </div>
            </div>
            <Drawer
                className="nav-drawer"
                placement="bottom"
                height="auto"
                closable={false}
                onClose={() => setVisible(false)}
                visible={visible}
            >
                <div className="flex justify-around">
                    {payload.roles.includes(Roles.ADMIN) && (
                        <DrawerItem icon={faUserShield} link="/admin">
                            {t("administration")}
                        </DrawerItem>
                    )}
                    <DrawerItem icon={faCogs} link="/setting" className="text-red-600">
                        {t("parameter")}
                    </DrawerItem>
                    <DrawerItem icon={faSignOutAlt} link="/logout" className="text-red-600">
                        {t("logout")}
                    </DrawerItem>
                </div>
            </Drawer>
        </>
    )
}

interface NavbarProps {
    children: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({children}) => {
    const {state: {user}} = useContext(AppContext)
    return (
        <>
            <Header user={user}/>
            {children}
            <MobileFooter user={user}/>
        </>
    )
}

export default Navbar
