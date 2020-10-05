import React, {useEffect, useState} from "react"
import {useHistory, Link} from "react-router-dom"
import {getClubsForStudent, getStudent} from "../../data/student"
import {Avatar, Divider, Drawer, Tooltip} from "antd"
import {useTranslation} from "react-i18next"
import {Student} from "../../data/student/types"
import {IconFA} from "../Common/IconFA"
import {HorizontalSpacer} from "../Common/HorizontalSpacer"
import {ClubMemberPreview} from "../../data/club/types"
import {getInitials, mediaPath, randomBackgroundColors} from "../../util"
import useDeviceDetect from "./DeviceDetection"
import {AvatarSizes} from "../../constants/MediaSizes"

const UserDrawer: React.FC = () => {
    const history = useHistory()
    const {t} = useTranslation()
    const isMobile = useDeviceDetect()
    const [userId, setUserId] = useState<number>()
    const [student, setStudent] = useState<Student>({} as Student)
    const [clubs, setClubs] = useState<ClubMemberPreview[]>([])
    const [visibility, setVisibility] = useState<boolean>(false)
    const [isStudentLoading, setIsStudentLoading] = useState<boolean>(true)
    const [isClubLoading, setIsClubLoading] = useState<boolean>(true)
    const [previousRoute, setPreviousRoute] = useState<string>("")

    const socialUserIcon = (type: string, profile: string) => {
        const urlType = type.substr(3)
        if (urlType === "snapchat")
            profile = "add/" + profile

        return (
            <Tooltip title={urlType} placement="bottom">
                <a href={`https://${urlType}.com/${profile}`} target="_blank"
                    rel="noopener noreferrer"
                    className="mx-2 text-indigo-500">
                    <IconFA type="brands" name={type} className="text-2xl sm:text-4xl"/>
                </a>
            </Tooltip>
        )
    }

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

        setPreviousRoute(history.location.pathname.slice(0, history.location.pathname.indexOf(`/student/${userId}`)))

    }, [userId])

    useEffect(() => {
        if (history.location.pathname.includes("/student/")) {
            const indexUserId = history.location.pathname.lastIndexOf("/")
            setUserId(parseInt(history.location.pathname.substring(indexUserId + 1)))
        }
    }, [history.location.pathname])

    const closeDrawer = () => {
        setVisibility(false)
        history.push(previousRoute)
    }

    return (
        <>
            {!isStudentLoading
                ? <Drawer placement={isMobile ? "bottom" : "right"}
                    closable={false} width={500} height={400}
                    onClose={() => closeDrawer()} visible={visibility}>
                    <div className="flex justify-start items-center sm:items-start">
                        <Avatar src={student ? mediaPath(student.picture, AvatarSizes.DEFAULT) : ""}
                            alt={student.firstName + " " + student.lastName}
                            className={"w-32 h-32 xl:w-48 xl:h-48 flex-none text-3xl sm:text-6xl " + randomBackgroundColors()}>
                            <div className="w-32 h-32 xl:w-48 xl:h-48 flex items-center justify-center">
                                {getInitials(student)}
                            </div>
                        </Avatar>
                        <div className="ml-3 mt-2 text-base">
                            <div
                                className="text-indigo-500 text-center font-bold text-sm sm:text-2xl mx-auto">
                                {student.firstName + " " + student.lastName.toUpperCase()}
                            </div>
                            <HorizontalSpacer/>
                            <div className="text-sm sm:text-base">
                                Promo <span className="select-all">{student.promo}</span>, n°<span
                                    className="select-all">{student.id}</span>
                            </div>
                            <div className="text-sm sm:text-base">
                                {student.mail ? <span className="select-all">{student.mail}</span>
                                    : t("user:no-mail")}
                            </div>
                            <div className="mt-3 sm:mt-10 mx-auto">
                                {student.facebook && socialUserIcon("fa-facebook", student.facebook)}
                                {student.twitter && socialUserIcon("fa-twitter", student.twitter)}
                                {student.instagram && socialUserIcon("fa-instagram", student.instagram)}
                                {student.snapchat && socialUserIcon("fa-snapchat", student.snapchat)}
                            </div>
                        </div>
                    </div>
                    <Divider/>
                    <div className="pl-2 text-xs sm:text-lg">
                        <div className="font-bold my-1">{t("user:bio")}</div>
                        <div className="px-6 italic">
                            {student.bio || t("user:no-bio")}
                        </div>
                        <Divider/>
                        <div className="font-bold my-1">{t("user:clubs")}</div>
                        <div className="flex flex-row flex-wrap">
                            {
                                isClubLoading ? <IconFA name="fa-circle-notch fa-spin" size="4x" className="mx-auto"/> :
                                    !clubs.length ?
                                        <span className="px-6 italic">{t("user:no-clubs")}</span> :
                                        (clubs.map(cm => {
                                            return (
                                                <Tooltip
                                                    title={cm.club.name}
                                                    placement="top"
                                                    key={cm.club.id}>
                                                    <Link to={`/club/${cm.club.id}`} onClick={() => setVisibility(false)}>
                                                        <Avatar src={mediaPath(cm.club.logoUrl, AvatarSizes.DEFAULT)}
                                                            alt={cm.club.name}
                                                            className="w-12 h-12 sm:w-24 sm:h-24 m-1 shadow-md hover:shadow-outline"/>
                                                        {cm.position}
                                                    </Link>
                                                </Tooltip>
                                            )
                                        }))
                            }
                        </div>
                        {/*<Divider/>*/}
                        {/*<div className="font-bold my-1">{t('user:photos')}</div>*/}
                        {/*{isEmpty(studentPictures) ? t('user:no-photos') : null}*/}
                    </div>
                </Drawer>
                : null}
        </>
    )
}

export default UserDrawer