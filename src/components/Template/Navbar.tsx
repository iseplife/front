import React, {useContext, useMemo, useState} from "react"
import {Divider, Drawer} from "antd"
import {Link, useLocation} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {LoggedStudentPreview, StudentPreview} from "../../data/student/types"
import "./Navbar.css"
import {Roles} from "../../data/security/types"
import SearchBar from "../SearchBar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import {faCogs, faSignOutAlt, faUserShield} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import DropdownPanel from "../Common/DropdownPanel"
import NotificationsCenter from "../Notification/NotificationsCenter"
import { cFaBellFull, cFaBellOutline, cFaCalendarFull, cFaCalendarOutline, cFaCompassFull, cFaHomeFull, cFaHomeOutline } from "../../constants/CustomFontAwesome"

type IconButtonProps = {
    icon: IconDefinition
}
const IconButton: React.FC<IconButtonProps> = ({icon}) => {
    return (
        <div className="grid place-items-center p-2 cursor-pointer rounded-full mx-3 group-hover:bg-indigo-400/20 transition-colors text-indigo-400">
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
    const [t] = useTranslation("notifications")

    return (
        <div className="flex justify-between px-5 bg-white h-14 shadow-sm z-30 items-center">
            <Link to="/" className="flex">
                <img className="my-1" src="https://via.placeholder.com/50" alt="iseplife logo"/>
            </Link>

            <SearchBar/>

            <div className="hidden md:flex justify-end items-center py-5">
                <div className="flex justify-around items-center mr-4 text-xl text-indigo-400">
                    <Link to="/discovery" className="group">
                        <IconButton icon={cFaCompassFull}/>
                    </Link>
                    <Link to="/calendar" className="group">
                        <IconButton icon={cFaCalendarFull}/>
                    </Link>
                    <DropdownPanel
                        icon={<IconButton icon={cFaBellFull}/>}
                        panelClassName="w-80 -right-6"
                        buttonClassName="group"
                    >
                        <div className="flex font-bold text-2xl px-4 py-2.5 text-black">
                            {unwatchedNotifications ? `Notifications (${unwatchedNotifications})` : "Notifications"}
                            <Link to={"/notifications"}  className="hover:bg-black/5 transition-colors ml-auto px-2 -mr-1 rounded text-indigo-500 font-normal text-sm grid place-items-center cursor-pointer mt-1">
                                {t("see_more")}
                            </Link>
                        </div>
                        <NotificationsCenter className="md:block "/>
                    </DropdownPanel>
                </div>
                <DropdownPanel
                    icon={
                        <div className="flex rounded-full ml-1 p-1 hover:bg-indigo-400/20 transition-colors font-medium text-indigo-400">
                            <StudentAvatar
                                id={user.id}
                                name={user.firstName + " " + user.lastName}
                                picture={user.picture}
                                pictureSize={AvatarSizes.THUMBNAIL}
                                size="small"
                            />
                            <span className="mx-2 grid place-items-center">{user.firstName}</span>
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
            <FontAwesomeIcon icon={icon} className="text-2xl mx-auto" />
            <span className="nav-footer-text text-xs mt-1">{children}</span>
        </div>
    </Link>
)
const MobileFooterButton: React.FC<{ route: string, selectedIcon: any, notSelectedIcon: any }> = ({ route, selectedIcon, notSelectedIcon }) => {
    const { pathname } = useLocation()
    return <Link to={route}>
        <button className="border-0 grid place-items-center h-full w-full text-2xl">
            <div className="w-12 h-12 grid place-items-center active:bg-indigo-400/20 duration-500 rounded-full">
                <FontAwesomeIcon icon={pathname == route ? selectedIcon : notSelectedIcon} />
            </div>
        </button>
    </Link>
}
const MobileFooter: React.FC<{ user: StudentPreview }> = ({user}) => {
    const {state: {payload}} = useContext(AppContext)
    const {t} = useTranslation()
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <>
            <div className="md:hidden grid grid-cols-4 shadow-md w-full h-14 bg-white border-t border-gray-300 border-opacity-80">
                <MobileFooterButton route="/" selectedIcon={cFaHomeFull} notSelectedIcon={cFaHomeOutline} />
                <MobileFooterButton route="/calendar" selectedIcon={cFaCalendarFull} notSelectedIcon={cFaCalendarOutline} />
                <MobileFooterButton route="/notifications" selectedIcon={cFaBellFull} notSelectedIcon={cFaBellOutline} />
                <div className="cursor-pointer grid place-items-center h-full w-full" onClick={() => setVisible(true)}>
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
                <div className="justify-around grid grid-cols-3" onClick={() => setVisible(false)}>
                    {payload.roles.includes(Roles.ADMIN) && (
                        <DrawerItem icon={faUserShield} link="/admin">
                            {t("administration")}
                        </DrawerItem>
                    )}
                    <DrawerItem icon={faCogs} link="/setting" className="text-red-600">
                        {t("setting")}
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
