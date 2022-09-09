import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { ClubPreview } from "../../data/club/types"
import { getAllClubs } from "../../data/club"
import { AppContext } from "../../context/app/context"
import { didFirstFollow } from "../../data/student"
import { AppActionType } from "../../context/app/action"
import { useHistory } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ClubFollowSkeleton from "./ClubFollowSkeleton"
import ClubFollow from "./ClubFollow"

const REQUIRED_FOLLOWING = 3

const FirstFollow: React.FC = () => {
    const [clubs, setClubs] = useState<ClubPreview[]>([])
    const [error, setError] = useState(false)
    const loading = useMemo(() => !clubs.length && !error, [clubs, error])
    const { t } = useTranslation("first-follow")
    const history = useHistory()

    const { dispatch } = useContext(AppContext)

    const didFollow = useCallback(() => {
        didFirstFollow().then(student => dispatch({
            type: AppActionType.SET_STUDENT,
            payload: student.data,
        }))
    }, [])

    const [followsCount, setFollowsCount] = useState<number>(0)
    const subscriptionCallback = useCallback((subscribed: boolean) => {
        setFollowsCount(count => subscribed ? count + 1: count - 1)
    }, [])

    useEffect(() => {
        history.replace("/discovery")
    }, [])

    useEffect(() => {
        getAllClubs().then(res =>
            setClubs(res.data.sort(() => 0.5 - Math.random()))
        ).catch(() => setError(true))
    }, [])

    return (
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col box-border sm:p-3 ">
            <div className="w-full text-white text-center mt-5 sm:mt-10 hidden sm:block">
                <div className="text-5xl font-bold">
                    { t("follow_clubs")}
                </div>
                <div className="text-xl font-medium text-white/70 mt-3">
                    { t("why_follow")}
                </div>
            </div>
            <div className="py-2 px-4 text-black border-b bg-neutral-100 sm:hidden">
                <div className="text-2xl font-bold">
                    { t("follow_clubs")}
                </div>
                <div className="text-lg text-neutral-900">
                    { t("why_follow_small")}
                </div>
            </div>
            <div className="relative sm:rounded-xl overflow-hidden bg-neutral-100 w-full sm:w-auto  m-auto sm:my-14 h-full max-w-full">
                <div className="overflow-auto h-full p-4 sm:p-8 pb-8">
                    { loading ?
                        <ClubFollowSkeleton count={10}/> :
                        clubs.map(club => (
                            <ClubFollow
                                club={club}
                                onSubscribe={subscriptionCallback}
                            />
                        ))
                    }
                </div>
                <div className="absolute bottom-0 left-0 w-full text-neutral-500 bg-neutral-300/30 py-3 text-center font-semibold text-lg backdrop-blur-md">
                    { followsCount < REQUIRED_FOLLOWING ?
                        t("follow_needed", {clubs: REQUIRED_FOLLOWING - followsCount}) :
                        <div className="flex">
                            <button onClick={didFollow} className="ml-auto mr-4 rounded-full px h-10 font-bold cursor-pointer select-none text-base grid place-items-center bg-indigo-400 hover:bg-opacity-90 px-5 text-white">
                                { t("next") }
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default FirstFollow