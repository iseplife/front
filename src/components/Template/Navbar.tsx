import React, {useMemo, useState} from "react";

import {Dropdown, Avatar, Menu, Button, Drawer, Icon} from "antd/es";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSelector} from 'react-redux'
import {AppState} from "../../redux/types";
import {Student} from "../../data/student/types";
import "./Navbar.css"

type IconButtonProps = {
    name: string
}
const IconButton: React.FC<IconButtonProps> = ({name}) => {
    return (
        <div className="flex p-2 cursor-pointer rounded-full mx-3 hover:bg-indigo-400 hover:text-white text-indigo-300">
            <Icon type={name}/>
        </div>
    );
};

const ProfileList: React.FC<{ firstName: string, lastName: string }> = ({firstName, lastName}) => {
    const payload = useSelector((state: AppState) => state.payload);
    const {t, i18n} = useTranslation();
    const isAdmin = useMemo(() => payload.roles.includes("ROLE_ADMIN"), [payload.roles]);
    return (
        <Menu>
            <Menu.Item key={0} className="font-bold profile-name">
                {firstName + " " + lastName}
            </Menu.Item>
            {isAdmin &&
            <Menu.Item key={1} className="flex justify-start items-center">
                <Icon type="book"/>
                <Link to="/feed/new">{t("create_feed")}</Link>
            </Menu.Item>
            }
            {isAdmin &&
            <Menu.Item key={2} className="flex justify-start items-center">
                <Icon type="usergroup-add"/>
                <Link to="/club/new">{t("create_club")}</Link>
            </Menu.Item>
            }
            {(isAdmin || payload.clubsPublisher.length > 0) &&
            <Menu.Item key={3} className="flex justify-start items-center">
                <Icon type="notification"/>
                <Link to="/event/new">{t("create_event")}</Link>
            </Menu.Item>
            }
            {/*TODO Determine how to handle language switch (modal, button, drawer, ...?)*/}
            <Menu.Item key={4} className="flex justify-start items-center">
                <Icon type="setting"/>
                <Link to="/parameters"><span>{t("parameter")}</span></Link>
            </Menu.Item>
            <Menu.Divider/>
            <Menu.Item key={5} className="profile-logout">
                <Link to="/logout">{t("logout")}</Link>
            </Menu.Item>
        </Menu>
    )
};
const Header: React.FC<{ user: Student }> = ({user}) => (
    <div className="flex justify-between px-5 bg-indigo-500 h-12 shadow-md">
        <img className="my-1" src="https://via.placeholder.com/50" alt="iseplife logo"/>

        <div className="hidden md:flex justify-end items-center">
            <div className="flex justify-around items-center mr-4">
                <Link to="/discovery">
                    <IconButton name="compass"/>
                </Link>
                <Link to="/calendar">
                    <IconButton name="calendar"/>
                </Link>
                <IconButton name="bell"/>
            </div>
            <Dropdown overlay={ProfileList({firstName: user.firstName, lastName: user.lastName})}
                      trigger={['click']} placement="bottomRight">
                <Avatar icon="user" src={user.photoUrlThumb} className="cursor-pointer"/>
            </Dropdown>
        </div>
    </div>
);


type DrawerItemProps = {
    icon: string,
    className?: string
}
const DrawerItem: React.FC<DrawerItemProps> = ({icon, className = "", children}) => (
    <div className={`flex flex-col cursor-pointer text-center mx-2 ${className}`}>
        <Icon type={icon}/>
        <span className="nav-footer-text">{children}</span>
    </div>
);
const MobileFooter: React.FC<{ user: Student }> = ({user}) => {
    const payload = useSelector((state: AppState) => state.payload);
    const {t} = useTranslation();
    const [visible, setVisible] = useState<boolean>(false);
    return (
        <>
            <div className="md:hidden flex justify-around items-center shadow-md fixed bottom-0 w-full h-10 bg-white">
                <Link to="/">
                    <Button shape="circle" icon="home" className="border-0"/>
                </Link>
                <Link to="/calendar">
                    <Button shape="circle" icon="calendar" className="border-0"/>
                </Link>
                <Button shape="circle" icon="bell" className="border-0"/>
                <div onClick={() => setVisible(true)}>
                    <Avatar icon="user" src={user.photoUrlThumb} className="cursor-pointer"/>
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
                    {payload.roles.includes("ROLE_ADMIN") &&
                    <>
                        <DrawerItem icon="book">{t('create_feed')}</DrawerItem>
                        <DrawerItem icon="usergroup-add">{t('create_club')}</DrawerItem>
                    </>
                    }
                    {(payload.roles.includes("ROLE_ADMIN") || payload.clubsPublisher.length > 0) &&
                    <DrawerItem icon="notification">{t('create_event')}</DrawerItem>
                    }
                    <DrawerItem icon="export" className="text-red-600">{t('logout')}</DrawerItem>
                </div>
            </Drawer>
        </>
    )
};


const Navbar: React.FC = ({children}) => {
    const user = useSelector((state: AppState) => state.user);
    return (
        <>
            <Header user={user}/>
            {children}
            <MobileFooter user={user}/>
        </>
    )
};

export default Navbar;