import React, {useCallback, useMemo} from "react"
import {Checkbox} from "antd"
import {PollChoice as PollChoiceType} from "../../../data/poll/types"

type PollChoiceProps = {
    data: PollChoiceType
    disabled: boolean
    total: number
    onClick: (choice: number, voted: boolean) => void
}
const PollChoice: React.FC<PollChoiceProps> = ({total, onClick, data, disabled}) => {
    const percent = useMemo(() => (
        total > 0 ? Math.round((data.votesNumber / total) * 100) : 0
    ), [total, data.votesNumber])

    const onVote = useCallback(() => onClick(data.id, data.voted), [data.id, data.voted, onClick])

    return (
        <div
            className="relative items-center rounded-lg cursor-pointer
                transition transition-border duration-300
                border py-1 px-2 border-solid border-gray-200 hover:border-indigo-400
                flex mx-3 my-1 w-full"
            data-dd-privacy="hidden"
        >
            <Checkbox className="z-10 text-gray-700 w-full" disabled={disabled} checked={data.voted} onChange={onVote}>
                <div className="flex w-full">
                    {data.content}
                    <div className="absolute right-2">{percent}%</div>
                </div>
            </Checkbox>
            <div
                className="absolute rounded-lg h-full left-0 bottom-0 top-0 bg-indigo-400"
                style={{
                    width: `${percent}%`,
                    transition: "width 0.5s ease"
                }}
            />
        </div>
    )
}

export default PollChoice
