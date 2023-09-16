import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Divider, message } from "antd"
import { AxiosError } from "axios"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router"
import { roomsPictures } from ".."
import Loading from "../../../../../components/Common/Loading"
import { WebPAvatarPolyfill } from "../../../../../components/Common/WebPPolyfill"
import { AvatarSizes } from "../../../../../constants/MediaSizes"
import { AppContext } from "../../../../../context/app/context"
import { deleteRoom, getRoom, joinRoom } from "../../../../../data/wei/rooms"
import { WeiRoom } from "../../../../../data/wei/rooms/types"
import { copyToClipboard, mediaPath } from "../../../../../util"
import ErrorInterface from "../../../../errors/ErrorInterface"
import Maintenance from "../../../../errors/Maintenance"
import LoadingPage from "../../../../LoadingPage"

const WeiRoomPage = () => {
    const { t } = useTranslation("wei")

    const {id} = useParams<{id: string}>()
    const [room, setRoom] = useState<WeiRoom>()
    const [error, setError] = useState(false)
    const [unknown, setUnknown] = useState(false)
    const [reservedSeconds, setReservedSeconds] = useState(0)
    const [joining, setJoining] = useState(false)

    useEffect(() => {
        let tid = 0
        const fnc = async () => {
            try {
                const res =await getRoom(id)
                setRoom(res.data)
            }catch(e){
                if((e as AxiosError).response?.status == 404)
                    setUnknown(true)
                else
                    setError(true)
                tid = -1
            }
            if(tid != -1)
                tid = window.setTimeout(fnc, 5000)
        }

        fnc()
        return () => {window.clearTimeout(tid); tid = -1}
    }, [id])

    useEffect(() => {
        if(room?.reservedUpTo){
            let id: number
            const fnc = () => {
                const diff = room.reservedUpTo.getTime() - Date.now()
                setReservedSeconds(Math.floor(diff / 1000))
                if(id != -1)
                    id = window.setTimeout(fnc, 1000)
            }

            fnc()
        }
    }, [room?.reservedUpTo])

    const {state: {user: {id: myId}}} = useContext(AppContext)

    const notIn = useMemo(() => !room?.members.find(mem => mem.student.id == myId), [room?.members, myId])
    const admin = useMemo(() => room?.members.find(mem => mem.student.id == myId)?.admin, [room?.members, myId])

    const join = useCallback(() => {
        setJoining(true)
        joinRoom(id).then(res => setRoom(res.data)).catch(error => {
            if((error as AxiosError).response?.status == 400) {
                message.error("You are already in a room, here it is.")
                setTimeout(() =>
                    h.push("/wei/rooms")
                , 1500)
            }
        })
    }, [id])
    const adminDelete = useCallback(() => {
        setJoining(true)
        deleteRoom(id).then(() => setUnknown(true))
    }, [id])

    const copy = useCallback(() => {
        copyToClipboard("https://iseplife.fr/wei/rooms/"+id)
        message.info(t("rooms.copied"))
    }, [id])

    const h = useHistory()

    const backHome = useCallback(() => h.push("/wei/rooms"), [])

    return unknown ?<ErrorInterface error={t("rooms.no_exist")} btnText={t("rooms.back")} onClick={backHome} /> : error ? <Maintenance /> : !room ? <LoadingPage /> : <div className="container max-w-md mx-auto px-3">
        <div className="mt-10 bg-white rounded-lg shadow-sm p-3 ">
            
            <div className="flex">
                <div
                    className="rounded-full h-12 w-12 sm:w-14 sm:h-14 p-1 flex-shrink-0 bg-neutral-200"
                >
                    <img src={`/img/wei/rooms/${roomsPictures[room.capacity]}`} alt="" className="w-full h-full" />
                </div>
                <div className="w-full">
                    <div className="flex justify-between">
                        <div className="ml-2 sm:ml-4">
                            <div className="font-bold text-lg sm:text-xl sm:mb-0.5 leading-6 mb-1">{t("rooms.title", room)}</div>
                            <div className="text-sm text-black/[65%] font-normal leading-4 hidden sm:block">
                                {t(`rooms.description.${room.capacity}`)}
                            </div>
                        </div>
                        <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-2">
                        </div>
                    </div>
                    <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden">
                        {t(`rooms.description.${room.capacity}`)}
                    </div>
                </div>
            </div>
            <Divider />
            <div className="text-center font-medium text-xl mt-2">
                { room.booked ? t("rooms.booked") : reservedSeconds > 0 ? <>Réservé pour {Math.floor(reservedSeconds / 60)} mn {reservedSeconds % 60}s</> : t("rooms.not_booked")}
                <div className="text-base font-normal text-left mt-1 text-neutral-600">
                    {t("rooms.join_explaination")}
                </div>
            </div>

            <Divider>{room.members.length} / {room.capacity}</Divider>

            <div className="px-3">
                {
                    room.members.map(member => <div className="mt-3">
                        <WebPAvatarPolyfill
                            src={mediaPath(member.student.picture, AvatarSizes.THUMBNAIL)}
                            icon={<FontAwesomeIcon icon={faUser} className="text-xl sm:text-2xl mt-2 sm:mt-3" />}
                            className="w-10 h-10 sm:w-12 sm:h-12"
                        />
                        <span className="ml-3 text-lg font-medium">
                            {
                                `${member.student.firstName} ${member.student.lastName}`
                            }
                        </span>
                    </div>)
                }
            </div>
            {
                notIn && <button onClick={join} className="rounded shadow bg-green-400 px-10 py-2 text-lg font-medium text-white mx-auto block mt-5">{
                    joining ? <Loading /> : t("rooms.join")
                }</button>
            }
            {
                !room.booked && admin && <button onClick={adminDelete} className="rounded shadow bg-red-400 px-10 py-2 text-lg font-medium text-white mx-auto block mt-5">{
                    joining ? <Loading /> : t("rooms.delete")
                }</button>
            }
        </div>
        <button onClick={copy} className="bg-green-400 text-white py-2 rounded-lg shadow mt-4 w-full text-center font-medium text-xl">{t("rooms.copy")}</button>
    </div>
}

export default WeiRoomPage