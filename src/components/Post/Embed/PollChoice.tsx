import React, {useContext, useMemo} from "react"
import {Checkbox} from "antd"
import {PollChoice as PollChoiceType} from "../../../data/poll/types"
import {AppContext} from "../../../context/app/context"

type PollChoiceProps = {
    data: PollChoiceType
    disabled: boolean
    total: number
    onClick: (choice: number, voted: boolean) => void
}
const PollChoice: React.FC<PollChoiceProps> = ({total, onClick, data, disabled}) => {
    const {state: {payload: {id}}} = useContext(AppContext)

    const hasVoted = useMemo(() => (data.voters || []).includes(id), [data.voters, id])
    const percent = useMemo(() => (
        total > 0 ? Math.round((data.votesNumber / total) * 100) : 0
    ), [total, data.votesNumber])

    return (
        <div
            className="relative items-center rounded-lg cursor-pointer
                transition transition-border duration-300
                border border-solid border-gray-200 hover:border-indigo-400 hover:border-2
                max-w-lg flex mx-3 my-1 w-full py-1 px-2"
        >
            <Checkbox className="z-10 text-gray-700 w-full" disabled={disabled} checked={hasVoted} onChange={() => onClick(data.id, hasVoted)}>
                {data.content}
                <span className="float-right">{percent}%</span>
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