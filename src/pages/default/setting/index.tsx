import React, {useContext, useEffect, useState} from "react"
import {_format, mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {useTranslation} from "react-i18next"
import {getCompleteLoggedUser} from "../../../data/student"
import {Student} from "../../../data/student/types"
import Loading from "../../../components/Common/Loading"
import Error from "../../../components/Common/Error"
import StudentSettings from "../../../components/Student/StudentSettings"
import {AppContext} from "../../../context/app/context"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { WebPAvatarPolyfill } from "../../../components/Common/WebPPolyfill"

const Setting: React.FC = () => {
    const {t} = useTranslation("setting")
    const {state: {user, payload: {lastConnection}}} = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(false)
    const [student, setStudent] = useState<Student>()

    useEffect(() => {
        setLoading(true)
        getCompleteLoggedUser().then(res => {
            setStudent(res.data)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="container mx-auto h-full flex flex-col">
            <div className="flex bg-white text-gray-700 rounded-lg p-5 m-5 h-32 shadow">
                <div>
                    <WebPAvatarPolyfill
                        src={mediaPath(user.picture, AvatarSizes.DEFAULT)}
                        icon={<FontAwesomeIcon icon={faUser}/>}
                        className="rounded-lg mr-5"
                        size={80}
                    />
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="text-2xl truncate">{user.firstName + " " + user.lastName}</h3>
                    <p className="-mt-4">Promo {user.promo} - n°{user.id}</p>
                </div>
                <div className="text-xs hidden md:block">
                    <span className="font-bold ">{t("last_connection")}: </span>
                    {lastConnection ? _format(lastConnection, "HH:mm dd/MM/yyyy") : t("first_time")}
                </div>
            </div>
            <div className={`mx-4 flex-grow flex flex-wrap md:flex-row flex-row-reverse ${loading || !student ? "items-center" : ""}`}>
                {loading ?
                    <Loading size="4x" className="mx-auto"/> :
                    student ? (
                        <StudentSettings info={student}/>
                    ) : <Error/>
                }
            </div>
        </div>
    )
}

export default Setting
