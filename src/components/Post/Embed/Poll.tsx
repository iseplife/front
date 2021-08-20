import React, {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {Poll as PollType} from "../../../data/poll/types"
import PollChoice from "./PollChoice"
import {isPast} from "date-fns"
import {message} from "antd"
import {addVote, getPollVotes, removeVote} from "../../../data/poll"
import {_formatDistance} from "../../../util"

type PollProps = {
    data: PollType
}
const Poll: React.FC<PollProps> = ({data}) => {
    const [poll, setPoll] = useState<PollType>(data)
    const {t} = useTranslation("poll")

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

        (voted ? removeVote : addVote)(poll.id, choice).then(() => {
            message.success(t("vote_updated"))
            getPollVotes(poll.id).then(res => {
                setPoll(p => ({
                    ...p,
                    choices: res.data
                }))
            })
        })

    }, [poll.endsAt, poll.id])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {t("poll")}: {poll.title}
                </h3>

                <span className="text-gray-500 text-xs lowercase">
                    {dateText}
                </span>
            </div>
            <div className="flex flex-col items-center mx-5">
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

            <span className="text-gray-500 text-xs lowercase">
                {poll.multiple && (t("allow_multiple") + ", ")} {poll.anonymous && t("anonymous_poll")}
            </span>
        </div>
    )
}

export default Poll