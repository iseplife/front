import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useHistory, Link} from "react-router-dom"
import {getClubsForStudent, getStudent} from "../../data/student"
import {Avatar, Divider, Drawer, Tooltip} from "antd"
import {useTranslation} from "react-i18next"
import {Student, StudentOverview} from "../../data/student/types"
import {IconFA} from "../Common/IconFA"
import {HorizontalSpacer} from "../Common/HorizontalSpacer"
import {ClubMemberPreview} from "../../data/club/types"
import {mediaPath} from "../../util"
import useDeviceDetect from "../User/DeviceDetection"
import {AvatarSizes} from "../../constants/MediaSizes"
import SocialUserIcon from "../Common/SocialUserIcon"
import StudentAvatar from "./StudentAvatar"
import Loading from "../Common/Loading"

const StudentDrawer: React.FC = () => {
    const history = useHistory()
    const {t} = useTranslation()
    const isMobile = useDeviceDetect()
    const [userId, setUserId] = useState<number>()
    const [student, setStudent] = useState<StudentOverview>({} as Student)
    const [clubs, setClubs] = useState<ClubMemberPreview[]>([])
    const [visibility, setVisibility] = useState<boolean>(false)
    const [isStudentLoading, setIsStudentLoading] = useState<boolean>(true)
    const [isClubLoading, setIsClubLoading] = useState<boolean>(true)
    const previousRoute = useMemo(() => (
        history.location.pathname.slice(0, history.location.pathname.indexOf(`/student/${userId}`))
    ), [history.location.pathname, userId])


    useEffect(() => {
        if (userId === undefined) return

        setIsStudentLoading(true)
        setIsClubLoading(true)
        getStudent(userId).then(res => {
            setStudent(res.data)
        }).finally(() => setIsStudentLoading(false))

        getClubsForStudent(userId).then(res => {
            setClubs(res.data)
        }).finally(() => setIsClubLoading(false))
        setVisibility(true)
    }, [userId])

    useEffect(() => {
        if (history.location.pathname.includes("/student/")) {
            const indexUserId = history.location.pathname.lastIndexOf("/")
            setUserId(parseInt(history.location.pathname.substring(indexUserId + 1)))
        }
    }, [history.location.pathname])

    const closeDrawer = useCallback(() => {
        setVisibility(false)
        history.push(previousRoute)
    }, [previousRoute])

    return (
        <Drawer
            placement={isMobile ? "bottom" : "right"}
            width={400} height={400}
            onClose={closeDrawer} visible={visibility}
            className={`${isMobile ? "user-drawer-mobile" : "user-drawer"}`}
            closable
            destroyOnClose
        >
            {isStudentLoading ?
                <div className="h-full flex items-center justify-center">
                    <Loading size="4x"/>
                </div> :
                <>
                    <div className="flex justify-start items-center sm:items-start">
                        <StudentAvatar
                            id={student.id}
                            name={student.firstName + " " + student.lastName}
                            picture={student.picture}
                            pictureSize={AvatarSizes.FULL}
                            size={100}
                            className="flex-none text-3xl sm:text-6xl"
                        />
                        <div className="ml-3 mt-2 text-base">
                            <div className="text-gray-700 text-center font-bold text-sm sm:text-2xl mx-auto">
                                {student.firstName + " " + student.lastName.toUpperCase()}
                            </div>
                            <HorizontalSpacer/>
                            <div className="text-gray-500 text-sm sm:text-base">
                                Promo <span className="select-all">{student.promo}</span>,
                                n°<span className="select-all">{student.id}</span>
                            </div>
                            <div className="text-gray-500 text-sm sm:text-base">
                                {student.mail ?
                                    <span className="select-all">{student.mail}</span> :
                                    t("user:no-mail")}
                            </div>
                            <div className="mt-3 sm:mt-10 mx-auto">
                                {student.facebook && <SocialUserIcon profile={student.facebook} type="fa-facebook"/>}
                                {student.twitter && <SocialUserIcon profile={student.twitter} type="fa-twitter"/>}
                                {student.instagram && <SocialUserIcon profile={student.instagram} type="fa-instagram"/>}
                                {student.snapchat && <SocialUserIcon profile={student.snapchat} type="fa-snapchat"/>}
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <div className="pl-2 text-xs sm:text-lg">
                        <div className="text-gray-700 font-bold my-1">{t("user:bio")}</div>
                        <div className="text-gray-500 px-6 italic">
                            {student.bio || t("user:no-bio")}
                        </div>
                        <Divider/>
                        <div className="text-gray-700 font-bold my-1">{t("user:clubs")}</div>
                        <div className="flex flex-row hidden-scroller overflow-x-auto">
                            {
                                isClubLoading ? <IconFA name="fa-circle-notch fa-spin" size="4x" className="mx-auto"/> :
                                    clubs.length ?
                                        clubs.map(cm => {
                                            return (
                                                <Tooltip
                                                    title={cm.club.name}
                                                    placement="top"
                                                    key={cm.club.id}>
                                                    <Link to={`/club/${cm.club.id}`} onClick={() => setVisibility(false)}>
                                                        <Avatar
                                                            src={mediaPath(cm.club.logoUrl, AvatarSizes.DEFAULT)}
                                                            alt={cm.club.name}
                                                            shape="square"
                                                            className="w-12 h-12 sm:w-24 sm:h-24 m-1 rounded-lg shadow-md hover:shadow-outline"
                                                        />
                                                        <div className="text-center text-gray-500">{cm.position}</div>
                                                    </Link>
                                                </Tooltip>
                                            )
                                        })
                                        : <span className="px-6 italic">{t("user:no-clubs")}</span>
                            }
                        </div>
                        {/*<Divider/>*/}
                        {/*<div className="font-bold my-1">{t('user:photos')}</div>*/}
                        {/*{isEmpty(studentPictures) ? t('user:no-photos') : null}*/}
                    </div>
                </>
            }
        </Drawer>
    )
}

export default StudentDrawer