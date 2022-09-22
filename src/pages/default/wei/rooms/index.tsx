import { message } from "antd"
import { AxiosError } from "axios"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router"
import LoadingSpinner from "../../../../components/Common/LoadingSpinner"
import { bookRoom, getAvailableRooms, getMyRoom } from "../../../../data/wei/rooms"
import { WeiAvailableRoom } from "../../../../data/wei/rooms/types"
import Maintenance from "../../../errors/Maintenance"

enum WeiRoomsStep {
    START,
    CHOOSE,
    LINK,
}

export const roomsPictures: {[key: number]: string} = {
    5: "cabane.svg",
    6: "petite-maison.svg",
    7: "grande-maison.svg",
    8: "manoir.svg",
}

const WeiRoomsPage = () => {

    const { t } = useTranslation("wei")
    const [step, setStep] = useState(WeiRoomsStep.START)

    const [types, setTypes] = useState<WeiAvailableRoom[]>([5, 6, 7, 8].map(capacity => ({capacity, count: 0})))
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(false)
    
    const h = useHistory()

    useEffect(() => {
        getMyRoom().then(res => res.data.id.length && h.push(`/wei/rooms/${res.data.id}`))
    }, [])

    useEffect(() => {
        let id = 0
        const fnc = async () => {
            try {
                const types = (await getAvailableRooms()).data
                setTypes(old => [...old.filter(type => !types.find(newType => newType.capacity == type.capacity)), ...types].sort((a, b) => a.capacity-b.capacity))
            }catch(e){
                setError(true)
                id = -1
            }
            setLoading(false)
            if(id != -1)
                id = window.setTimeout(fnc, 2500)
        }

        fnc()
        return () => {window.clearTimeout(id); id = -1}
    }, [])


    const book = useCallback(async (capacity: number) => {
        try{
            const id = (await bookRoom(capacity)).data.id
            console.log("id is "+id)
            h.push(`/wei/rooms/${id}`)
        }catch(e){
            const status = (e as AxiosError).response?.status
            if(status == 404)
                message.error(t("rooms.no_available", {capacity}))
            else if(status == 400)
                message.error(t("rooms.already"))
        }
    }, [])

    return step == WeiRoomsStep.START ?
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col box-border sm:p-3 ">
            <div className="w-full text-white text-center mt-5 sm:mt-10 hidden sm:block">
                <div className="text-5xl font-bold">
                    {t("rooms.choose")}
                </div>
                <div className="text-xl font-medium text-white/70 mt-3">
                    {t("rooms.explaination")}
                </div>
            </div>
            <div className="py-2 px-4 text-black border-b bg-neutral-100 sm:hidden">
                <div className="text-2xl font-bold">
                    {t("rooms.choose")}
                </div>
                <div className="text-base text-neutral-900 mt-1">
                    {t("rooms.explaination")}
                </div>
            </div>
            <div className="relative sm:rounded-xl overflow-hidden bg-neutral-100 w-full sm:w-auto m-auto sm:my-14 h-full">
                <div className="overflow-auto h-full p-4 sm:p-8 pb-8">
                    {error ? <Maintenance /> : loading ? <LoadingSpinner /> :
                        <>
                            { types.map(type => <>
                                <div className="flex">
                                    <div
                                        className="rounded-full h-12 w-12 sm:w-14 sm:h-14 p-1 flex-shrink-0 bg-neutral-200"
                                    >
                                        <img src={`/img/wei/rooms/${roomsPictures[type.capacity]}`} alt="" className="w-full h-full" />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex justify-between">
                                            <div className="ml-2 sm:ml-4">
                                                <div className="font-bold text-lg sm:text-xl sm:mb-0.5 leading-6 mb-1">{t("rooms.title", type)}</div>
                                                <div className="text-md text-neutral-400 mb-0.5 -mt-1">{t("rooms.remaining", type)}</div>
                                                <div className="text-sm text-black/[65%] font-normal leading-4 sm:w-72 lg:w-96 hidden sm:block">
                                                    {t(`rooms.description.${type.capacity}`)}
                                                </div>
                                            </div>
                                            <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-2">
                                                {
                                                    type.count > 0 ? 
                                                        <button
                                                            className="h-10 font-bold cursor-pointer select-none rounded-full text-base grid place-items-center group bg-indigo-400 hover:bg-opacity-90 px-5 text-white whitespace-nowrap"
                                                            onClick={() => book(type.capacity)}
                                                        >
                                                            {t("rooms.book")}
                                                        </button>
                                                        :
                                                        <div
                                                            className="h-10 font-bold select-none rounded-full text-base grid place-items-center group border-red-400 border-2 text-red-500 cursor-not-allowed hover:bg-opacity-90 px-5 whitespace-nowrap"
                                                            onClick={() => book(type.capacity)}
                                                        >
                                                            Indispo.
                                                        </div>
                                                        
                                                }
                                            </div>
                                        </div>
                                        <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden">
                                            {t(`rooms.description.${type.capacity}`)}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
                            </>)}
                        </>
                    }
                </div>
            </div>
        </div>
        : <></>
}

export default WeiRoomsPage