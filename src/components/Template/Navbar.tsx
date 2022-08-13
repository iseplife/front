import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
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
import {faCogs, faSearch, faSignOutAlt, faUserShield} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {IconDefinition} from "@fortawesome/fontawesome-svg-core"
import DropdownPanel from "../Common/DropdownPanel"
import NotificationsCenter from "../Notification/NotificationsCenter"
import { cFaBellFull, cFaBellOutline, cFaCalendarFull, cFaCalendarOutline, cFaCompassFull, cFaHomeFull, cFaHomeOutline, cFaSearch, cFaSearchFill } from "../../constants/CustomFontAwesome"
import { useLiveQuery } from "dexie-react-hooks"
import { notificationManager } from "../../datamanager/NotificationManager"
import useAdminRole from "../../hooks/useAdminRole"
import StudentLargeCard from "../Student/StudentLargeCard"
import { setStyles } from "../../util"

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
    const {t} = useTranslation()
    const isAdmin = useAdminRole()

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
                className="flex justify-center text-red-500 mx-3 mb-2 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 rounded transition-colors"
            >
                {t("logout")}
            </Link>
        </div>
    )
}

interface HeaderProps {
    user: LoggedStudentPreview
}

const NotificationHeaderButton: React.FC = () => {
    const [t] = useTranslation("notifications")
    const unwatchedNotifications = useLiveQuery(async () => await notificationManager?.getUnwatched() as number, [])

    const showPushAsk = useLiveQuery(async () => await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed())

    return <DropdownPanel
        icon={<div>
            <IconButton icon={cFaBellFull}/>
            <div className={"absolute text-xs bg-red-400 rounded-full w-[1.125rem] h-[1.125rem] text-white grid place-items-center top-0 right-1.5 shadow-sm transition-transform "+(unwatchedNotifications || showPushAsk ? "scale-100" : "scale-0")}>
                {Math.min((unwatchedNotifications ?? 0) + +(showPushAsk ?? false), 9)}
            </div>
        </div>}
        panelClassName="w-80 -right-6"
        buttonClassName="group"
    >
        <div className="flex font-bold text-2xl px-4 py-2.5 text-black">
            {unwatchedNotifications ? `Notifications (${unwatchedNotifications > 9 ? "9+" : unwatchedNotifications})` : "Notifications"}
            <Link to={"/notifications"}  className="hover:bg-black/5 transition-colors ml-auto px-2 -mr-1 rounded text-indigo-500 font-normal text-sm grid place-items-center cursor-pointer mt-1">
                {t("see_more")}
            </Link>
        </div>
        <NotificationsCenter className="md:block "/>
    </DropdownPanel>
}



export const Header: React.FC<HeaderProps> = ({user}) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const element = document.getElementById("main")!

        let lastScrollY = element.scrollTop
        let previousDirection = "up"
        let directionChangeHeight = 0
        const fnc = () => {
            const header = ref.current!
            const scroll = element.scrollTop

            const dir = scroll > lastScrollY ? "down" : "up"
            const justChanged = previousDirection != dir
            if(justChanged)
                directionChangeHeight = scroll

            const bRect = header.getBoundingClientRect()

            if(dir == "up"){
                const height = bRect.height
                if(justChanged){
                    const top = Math.max(0, Math.max(scroll + bRect.top, scroll - height))
                    directionChangeHeight = top
                    setStyles(header, {
                        position: "absolute",
                        top: `${top}px`,
                    }, false)
                }else if(directionChangeHeight - scroll > -2){
                    setStyles(header, {
                        position: "fixed",
                        top: "0px"
                    }, false)
                }
            }else if(dir == "down" && justChanged)
                setStyles(header, {
                    position: "absolute",
                    top: `${bRect.bottom > 0 ? scroll + bRect.top : scroll}px`,
                }, false)

            lastScrollY = scroll
            previousDirection = dir
        }

        element.addEventListener("scroll", fnc)
        return () => element.removeEventListener("scroll", fnc)
    }, [])

    return <>
        <div className="h-14 flex" />
        <div className="flex justify-between px-5 bg-white h-14 shadow-sm z-30 items-center w-full md:fixed md:top-0" style={{position: "absolute", top: "0px"}} ref={ref}>
            <Link to="/" className="hidden md:flex">
                <img className="my-1" src="https://via.placeholder.com/50" alt="iseplife logo"/>
            </Link>
            <Link to="/discovery" className="flex md:hidden mr-2">
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
                    <NotificationHeaderButton />
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
                    <div className="text-center mb-1 -mt-3 mx-auto text-gray-400">
                        {process.env.REACT_APP_VERSION} - {process.env.REACT_APP_COMMIT}
                    </div>
                </DropdownPanel>
            </div>
        </div>
    </>
}


type DrawerItemProps = {
    icon: IconDefinition
    className?: string
    link: string
    children: React.ReactNode
}
const DrawerItem: React.FC<DrawerItemProps> = ({icon, className = "", children, link}) => (
    <Link to={link}>
        <div className={`flex flex-col cursor-pointer text-center mx-2 ${className}`}>
            <FontAwesomeIcon icon={icon} className="text-2xl mx-auto" />
            <span className="nav-footer-text text-xs mt-1">{children}</span>
        </div>
    </Link>
)

interface MobileFooterButtonProps {
    route: string
    selectedIcon: any
    notSelectedIcon: any
    className?: string
    alerts?: number
    doubleClickAction?: () => void
}

const MobileFooterButton: React.FC<MobileFooterButtonProps> = ({ route, selectedIcon, notSelectedIcon, alerts, className = "text-indigo-400", doubleClickAction }) => {
    const { pathname } = useLocation()
    const selected = useMemo(() => pathname == route, [route, pathname])

    const onClick = useCallback(() => {
        if(selected){
            doubleClickAction?.()
            document.getElementById("main")?.scrollTo({ left: 0, top: 0, behavior: "smooth" })
        }
    }, [doubleClickAction, selected])
    
    return <Link to={route} className="w-full h-full grid place-items-center">
        <button className={`border-0 grid place-items-center text-2xl ${className}`} onClick={onClick}>
            <div className="relative">
                <div className={"w-12 h-12 grid place-items-center active:bg-indigo-400/20 duration-200 rounded-full scale-[95%] "+(selected && "scale-105")}>
                    <FontAwesomeIcon icon={selected ? selectedIcon : notSelectedIcon} />
                </div>
                
                <div className={"absolute text-xs bg-red-400 rounded-full w-[1.125rem] h-[1.125rem] text-white grid place-items-center top-1 right-0 shadow-sm transition-transform "+(alerts ? "scale-100" : "scale-0")}>
                    {Math.min(alerts ?? 0, 9)}
                </div>
            </div>
        </button>
    </Link>
}
const MobileFooter: React.FC<{ user: StudentPreview }> = ({user}) => {
    const unwatchedNotifications = useLiveQuery(() => notificationManager?.getUnwatched(), [])
    
    const {state: {payload}} = useContext(AppContext)
    const {t} = useTranslation()
    const [visible, setVisible] = useState<boolean>(false)
    const showPushAsk = useLiveQuery(async () => await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed())
    const close = useCallback(() => setVisible(false), [])
    const focusSearch = useCallback(() => (document.querySelector("input[type=\"search\"]") as HTMLInputElement).focus(), [])
    
    return (
        <>
            <div className="md:hidden grid grid-cols-5 w-full h-16 shadow-[0px_-4px_20px_rgb(0_0_0_/_5%)] border-t border-neutral-200/50">
                <MobileFooterButton route="/" selectedIcon={cFaHomeFull} notSelectedIcon={cFaHomeOutline} />
                <MobileFooterButton route="/calendar" selectedIcon={cFaCalendarFull} notSelectedIcon={cFaCalendarOutline} />
                <div className="mx-auto flex">
                    <MobileFooterButton
                        route="/discovery"
                        className="-mt-6 bg-indigo-400 text-white rounded-full h-[3.2rem] w-[3.2rem] scale-110 text-[1.3rem] shadow-[0px_-4px_15px_1px_rgba(0,0,0,0.1)]"
                        selectedIcon={cFaSearch}
                        notSelectedIcon={cFaSearch}
                        doubleClickAction={focusSearch}
                    />
                </div>
                <MobileFooterButton route="/notifications" selectedIcon={cFaBellFull} notSelectedIcon={cFaBellOutline} alerts={+(showPushAsk ?? false) + unwatchedNotifications} />
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
                onClose={close}
                visible={visible}
            >
                <div>
                    <StudentLargeCard student={user} className="bg-neutral-100 active:bg-neutral-200 transition-colors" onClick={close} />
                    <div className="justify-around grid grid-cols-3" onClick={close}>
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
                        <span className="absolute bottom-1 right-2">
                            {process.env.REACT_APP_VERSION} - {process.env.REACT_APP_COMMIT}
                        </span>
                    </div>
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
            {children}
            <MobileFooter user={user}/>
        </>
    )
}

export default Navbar
