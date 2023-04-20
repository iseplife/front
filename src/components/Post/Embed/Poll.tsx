import React, {useCallback, useMemo} from "react"
import {useTranslation} from "react-i18next"
import {Poll as PollType} from "../../../data/poll/types"
import PollChoice from "./PollChoice"
import {isPast} from "date-fns"
import {Divider, Modal, message} from "antd"
import {addVote, removeVote} from "../../../data/poll"
import {_formatDistance} from "../../../util"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { EmbedPoll } from "../../../data/post/types"
import { getPollVotes } from "../action"
import PollVoteItem from "../types"
import LoadingSpinner from "../../Common/LoadingSpinner"
import StudentAvatar from "../../Student/StudentAvatar"
import { Link } from "react-router-dom"

type PollProps = {
    postId: number
    data: PollType
}
const Poll: React.FC<PollProps> = ({postId, data: poll}) => {
    const { t } = useTranslation("poll")
    
    const total = useMemo(() => (
        poll.choices.reduce((acc, choice) => acc + choice.votesNumber, 0)
    ), [poll.choices])
    const dateText = useMemo(() => (
        isPast(poll.endsAt) ?
            t("poll_ended") + " " + _formatDistance(new Date(), poll.endsAt) :
            t("poll_end") + " " + _formatDistance(poll.endsAt, new Date())
    ), [poll.endsAt])

    const handleVote = useCallback((choice: number, voted: boolean) => {
        if (isPast(poll.endsAt)) {
            message.error(t("poll_finished"))
            return
        }

        (voted ? removeVote : addVote)(poll.id, choice).then(res => {
            const newPoll = {
                ...poll,
                choices: res.data
            }
            feedsManager.updateEmbed(postId, newPoll as EmbedPoll)
        })

    }, [poll])
    
    const [likesLoading, setLikesLoading] = React.useState(true)
    const [showVotes, setShowVotes] = React.useState(false)
    const [votes, setVotes] = React.useState([] as PollVoteItem[])

    const openShowVotes = useCallback(async () => {
        if(!poll.anonymous){
            setLikesLoading(true)
            setShowVotes(true)

            setVotes((await getPollVotes(poll.id)).data)

            setLikesLoading(false)
        }
    }, [poll.id])

    const closeVotes = useCallback(() => 
        setShowVotes(false)
    , [])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-500 font-bold">
                    {poll.title}
                </h3>

                <span className="text-gray-500 text-xs lowercase">
                    {dateText}
                </span>
            </div>
            <div className="flex flex-col items-center">
                {poll.choices.map(choice => (
                    <PollChoice
                        key={choice.id}
                        total={total}
                        data={choice}
                        onClick={handleVote}
                        disabled={isPast(poll.endsAt)}
                    />
                ))}
            </div>

            <div className="flex text-neutral-600 text-sm items-center">
                <button onClick={openShowVotes} className={poll.anonymous ? "" : "hover:underline hover:cursor-pointer"}>{total} {t("votes")}</button>
                {(poll.multiple || poll.anonymous) && <>
                    <Divider type="vertical" className="mt-1" />
                    <span className="lowercase">
                        {poll.multiple && (t("allow_multiple") + ", ")} {poll.anonymous && t("anonymous_poll")}
                    </span>
                </>}
            </div>

            {
                <Modal
                    className="w-11/12 md:w-1/2 md:max-w-[600px] rounded-xl pb-0 top-6 md:top-14 max-h-[min(80vh,590px)] overflow-scroll scrollbar-thin"
                    visible={showVotes}
                    footer={null}
                    afterClose={closeVotes}
                    onCancel={closeVotes}
                >
                    <div className="text-center font-medium text-lg my-1.5 sm:mb-3">
                        Votes ({votes.reduce((acc, item) => acc + item.students.length, 0)})
                    </div>
                    {
                        likesLoading ? <div className="pt-48 pb-16">
                            <LoadingSpinner />
                        </div> : 
                            votes.map(item => (
                                <div>
                                    <div className="font-semibold my-2 text-lg bg-neutral-200 rounded-lg px-2 py-1 flex justify-between items-center">
                                        <span>
                                            { item.content }
                                        </span>
                                        <span className="text-base">
                                            ({ item.students.length })
                                        </span>
                                    </div>
                                    {
                                        item.students.map(student => <Link to={() => `/student/${student.id}`} key={student.id}>
                                            <div className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-1.5 rounded-lg transition-colors cursor-pointer">
                                                <StudentAvatar 
                                                    id={student.id}
                                                    name={student.firstName+" "+student.lastName}
                                                    picture={student.picture}
                                                />
                                                <div className="ml-3 text-[15px] flex justify-between w-full">
                                                    <span>
                                                        {student.firstName+" "+student.lastName}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>)
                                    }
                                </div>
                            ))
                    }
                </Modal>
            }
        </div>
    )
}

export default Poll