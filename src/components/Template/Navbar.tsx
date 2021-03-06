import React, {useMemo, useState} from "react"
import {Avatar, Button, Drawer, Dropdown, Menu} from "antd"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {useSelector} from "react-redux"
import {AppState} from "../../context/action"
import {Student, StudentPreview} from "../../data/student/types"
import "./Navbar.css"
import {Roles} from "../../data/security/types"
import SearchBar from "../SearchBar"
import {
    CalendarOutlined,
    KeyOutlined,
    SettingOutlined,
    UserOutlined,
    BellOutlined,
    HomeOutlined,
    ExportOutlined,
    CompassOutlined
} from "@ant-design/icons"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

type IconButtonProps = {
    icon: React.ReactNode
}
const IconButton: React.FC<IconButtonProps> = ({icon}) => {
    return (
        <div
            className="flex p-2 cursor-pointer rounded-full mx-3 hover:bg-indigo-400 hover:text-white text-indigo-300">
            {icon}
        </div>
    )
}

const ProfileList: React.FC<{ firstName: string, lastName: string }> = ({firstName, lastName}) => {
    const payload = useSelector((state: AppState) => state.payload)
    const {t} = useTranslation()
    const isAdmin = useMemo(() => payload.roles.includes(Roles.ADMIN), [payload.roles])
    return (
        <Menu>
            <Menu.Item key={0} className="font-bold profile-name">
                {firstName + " " + lastName}
            </Menu.Item>
            {isAdmin &&
            <Menu.Item key={2} className="flex justify-start items-center">
                <KeyOutlined/>
                <Link to="/admin">{t("administration")}</Link>
            </Menu.Item>
            }
            {/*TODO Determine how to handle language switch (modal, button, drawer, ...?)*/}
            <Menu.Item key={4} className="flex justify-start items-center">
                <SettingOutlined/>
                <Link to="/setting"><span>{t("setting")}</span></Link>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key={5} className="profile-logout">
                <Link to="/logout">{t("logout")}</Link>
            </Menu.Item>
        </Menu>
    )
}
const Header: React.FC<{ user: StudentPreview }> = ({user}) => (
    <div className="flex justify-between px-5 bg-indigo-500 h-12 shadow z-50">
        <Link to="/" className="flex">
            <img className="my-1" src="https://via.placeholder.com/50" alt="iseplife logo"/>
        </Link>

        <SearchBar/>

        <div className="hidden md:flex justify-end items-center py-5">
            <div className="flex justify-around items-center mr-4">
                <Link to="/discovery">
                    <IconButton icon={<CompassOutlined/>}/>
                </Link>
                <Link to="/calendar">
                    <IconButton icon={<CalendarOutlined/>}/>
                </Link>
                <IconButton icon={<BellOutlined/>}/>
            </div>
            <Dropdown
                overlay={<ProfileList firstName={user.firstName} lastName={user.lastName}/>}
                trigger={["click"]}
                placement="bottomRight"
            >
                <div className="cursor-pointer flex rounded-full ml-1 p-1 hover:bg-indigo-400 hover:text-white text-indigo-300">
                    <Avatar
                        icon={<UserOutlined/>}
                        src={mediaPath(user.picture, AvatarSizes.THUMBNAIL)}
                        size="small"
                        className="cursor-pointer"
                    />
                    <span className="mx-2 ">{user.firstName}</span>
                </div>
            </Dropdown>
        </div>
    </div>
)


type DrawerItemProps = {
    icon: React.ReactNode
    className?: string
    link: string
}
const DrawerItem: React.FC<DrawerItemProps> = ({icon, className = "", children, link}) => (
    <Link to={link}>
        <div className={`flex flex-col cursor-pointer text-center mx-2 ${className}`}>
            {icon}
            <span className="nav-footer-text">{children}</span>
        </div>
    </Link>
)
const MobileFooter: React.FC<{ user: StudentPreview }> = ({user}) => {
    const payload = useSelector((state: AppState) => state.payload)
    const {t} = useTranslation()
    const [visible, setVisible] = useState<boolean>(false)
    return (
        <>
            <div className="md:hidden flex justify-around items-center shadow-md w-full h-10 bg-white">
                <Link to="/">
                    <Button shape="circle" icon={<HomeOutlined/>} className="border-0"/>
                </Link>
                <Link to="/calendar">
                    <Button shape="circle" icon={<CalendarOutlined/>} className="border-0"/>
                </Link>
                <Button shape="circle" icon={<BellOutlined/>} className="border-0"/>
                <div onClick={() => setVisible(true)}>
                    <Avatar icon={<UserOutlined/>} src={mediaPath(user.picture, AvatarSizes.THUMBNAIL)} className="cursor-pointer"/>
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
                    {payload.roles.includes(Roles.ADMIN) &&
                    <DrawerItem icon={<KeyOutlined/>} link="/admin">
                        {t("administration")}
                    </DrawerItem>
                    }
                    <DrawerItem icon={<SettingOutlined/>} link="/setting" className="text-red-600">
                        {t("parameter")}
                    </DrawerItem>
                    <DrawerItem icon={<ExportOutlined/>} link="/logout" className="text-red-600">
                        {t("logout")}
                    </DrawerItem>
                </div>
            </Drawer>
        </>
    )
}


const Navbar: React.FC = ({children}) => {
    const user = useSelector((state: AppState) => state.user)
    return (
        <>
            <Header user={user}/>
            {children}
            <MobileFooter user={user}/>
        </>
    )
}

export default Navbar