import React, {useContext, useState} from "react"
import {Button} from "antd"
import {Link} from "react-router-dom"
import {AvatarSizes} from "../../constants/MediaSizes"
import {AppContext} from "../../context/app/context"
import StudentAvatar from "../Student/StudentAvatar"
import {faBars, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const AdminHeader: React.FC = () => {
    const {state: {user}} = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)

    return (
        <header className="bg-white shadow relative">
            <div className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center py-1 mr-4">
                    <Link to="/admin">
                        <h1 className="text-4xl font-bold leading-tight text-[#e87a05] my-auto">
                            Administration
                        </h1>
                    </Link>
                </div>
                <div className="flex flex-1 items-center hidden md:block pt-4 mr-4">
                    <Link to="/admin/user" className="mx-3 my-auto font-bold text-gray-600 hover:text-gray-400 hover:text-xl">
                        Utilisateurs
                    </Link>
                    <Link to="/admin/club" className="mx-3 my-auto font-bold text-gray-600 hover:text-gray-400 hover:text-xl">
                        Associations
                    </Link>
                    <Link to="/admin/report" className="mx-3 my-auto font-bold text-gray-600 hover:text-gray-400 hover:text-xl">
                        Reports
                    </Link>
                    <Link
                        to="/admin/group"
                        className="mx-3 my-auto font-bold text-gray-600 hover:text-gray-400 hover:text-xl"
                    >
                        Groupes
                    </Link>
                    <Link
                        to="/admin/survey"
                        className="mx-3 my-auto font-bold text-gray-600 hover:text-gray-400 hover:text-xl"
                    >
                        Votes
                    </Link>
                </div>
                <div className="hidden md:flex flex-row justify-end items-center ">
                    <StudentAvatar
                        id={user.id}
                        name={user.firstName + " " + user.lastName}
                        picture={user.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        size="small"
                    />
                    <Link to="/">
                        <FontAwesomeIcon icon={faSignOutAlt} className="hover:text-gray-300 text-gray-500 ml-2" size="lg"/>
                    </Link>
                </div>
                <div className="block md:hidden">
                    <Button
                        shape="circle"
                        icon={open ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars}/>}
                        className="border-none" onClick={() => setOpen(!open)}
                    />
                </div>
            </div>

            <div className={open ? "block" : "hidden"}>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                            <StudentAvatar
                                id={user.id}
                                name={user.firstName + " " + user.lastName}
                                picture={user.picture}
                                pictureSize={AvatarSizes.THUMBNAIL}
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium leading-none text-[#e87a05]">{user.firstName + " " + user.lastName}</div>
                            <div className="mt-1 text-sm font-medium leading-none text-gray-400">{user.id + " - " + user.promo}</div>
                        </div>
                    </div>
                    <div className="mt-3 px-2" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        <Link
                            to="/admin"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-200 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/user"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-200 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Utilisateurs
                        </Link>
                        <Link
                            to="/admin/club"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-200 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Associations
                        </Link>
                        <Link
                            to="/admin/report"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-200 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Reports
                        </Link>
                        <Link
                            to="/admin/group"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-200 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Groupes
                        </Link>
                        <Link
                            to="/admin/survey"
                            className="block px-3 py-2 rounded text-base font-medium text-[#e87a05] hover:text-[#fca835] hover:bg-gray-2000 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Votes
                        </Link>
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded text-right text-base font-medium text-gray-700 hover:text-gray-500 hover:bg-gray-2000 focus:bg-gray-200"
                            role="menuitem"
                        >
                            Retour site <FontAwesomeIcon icon={faSignOutAlt} className="ml-2"/>
                        </Link>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default AdminHeader
