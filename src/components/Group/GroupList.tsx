import React, {useMemo, useState} from "react"
import {GroupPreview} from "../../data/group/types"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next"
//@ts-ignore
import { getPastelColor } from "pastel-color"
import { Skeleton } from "antd"

const GROUP_PREVIEW_COUNT = 13

type GroupListProps = {
    groups?: GroupPreview[]
}
const GroupList: React.FC<GroupListProps> = ({ groups }) => {
    const { t } = useTranslation("home")
    const [viewAll, setViewAll] = useState<boolean>(false)
    const [preview, leftovers] = useMemo(() => [groups?.slice(0, GROUP_PREVIEW_COUNT) ?? [], groups?.slice(GROUP_PREVIEW_COUNT) ?? []], [groups])

    return (
        <>
            {/* Mobile View */}
            <div className="grid">
                <div className="lg:hidden flex relative flex-row hidden-scroller whitespace-no-wrap w-full max-w-full overflow-x-auto sm:overflow-x-clip m-0 sm:grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 sm:gap-y-3 md:gap-2 md:gap-y-2 pl-1 sm:pl-0">
                    {groups?.length ? groups.map(g => (
                        <Link key={g.id} to={`/group/${g.id}`} className="text-white hover:opacity-80 transition-opacity aspect-square">
                            <div className="px-2 flex-shrink-0 rounded-lg h-20 w-20 sm:h-full sm:w-full text-xs font-semibold relative flex" style={{ backgroundColor: getPastelColor(g.name).hex }}>
                                <div className="absolute bottom-1 box-border w-full pr-4 break-words">{g.name}</div>
                            </div>
                        </Link>
                    )) : [1, 2, 3, 4, 5, 6].map(_ =>
                        <div className="px-2 rounded-lg flex-shrink-0 h-20 w-20 sm:h-full sm:w-full text-xs font-semibold relative flex bg-neutral-200 animate-pulse" />
                    )}
                </div>
            </div>
                

            {/* Desktop View */}
            <div className="hidden lg:block">
                <div className=" flex flex-col overflow-y-auto" style={{ maxHeight: 720 }}>
                    {!groups?.length &&
                        [1, 2, 3].map(id => 
                            <div key={id} className="bg-gray-400 md:bg-transparent flex p-2">
                                <div className="bg-indigo-300/70 p-1 rounded-full mr-2.5 h-6 w-6 flex-shrink-0 my-auto animate-pulse" />
                                <div className="bg-neutral-200 w-32 rounded-md animate-pulse">&nbsp;</div>
                            </div>
                        )
                    }
                    {preview.map((g) => (
                        <div key={g.id} className="bg-gray-400 md:bg-transparent">
                            <Link to={`/group/${g.id}`} className="text-white md:text-gray-500 hover:text-gray-600 flex hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2">
                                <div className="bg-indigo-400 p-1 rounded-full mr-2.5 h-6 w-6 flex-shrink-0 my-auto">
                                    <img src="/img/icons/user-group.svg" className="w-4 h-4" />
                                </div>
                                {g.name}
                            </Link>
                        </div>
                    ))}
                    {viewAll && leftovers.map((g) => (
                        <div key={g.id} className="rounded-full bg-gray-400 md:bg-transparent">
                            <Link to={`/group/${g.id}`} className="text-white md:text-gray-500 hover:text-gray-600 flex hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2">
                                <div className="bg-indigo-400 p-1 rounded-full mr-2.5 h-6 w-6 flex-shrink-0 my-auto">
                                    <img src="/img/icons/user-group.svg" className="w-4 h-4 max-h-4" />
                                </div>
                                {g.name}
                            </Link>
                        </div>
                    ))}
                </div>
                {(groups?.length ?? 0) >= GROUP_PREVIEW_COUNT && (
                    <p className="cursor-pointer font-bold text-center text-gray-500" onClick={() => setViewAll(v => !v)}>
                        {viewAll ? t("see_less_group") : t("see_all_group")}
                    </p>
                )}
            </div>
        </>
    )
}
export default GroupList