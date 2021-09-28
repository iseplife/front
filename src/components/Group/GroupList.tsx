import React, {useMemo, useState} from "react"
import {GroupPreview} from "../../data/group/types"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next"
//@ts-ignore
import { getPastelColor } from "pastel-color"

const GROUP_PREVIEW_COUNT = 13

type GroupListProps = {
    groups: GroupPreview[]
}
const GroupList: React.FC<GroupListProps> = ({groups}) => {
    const {t} = useTranslation("home")
    const [viewAll, setViewAll] = useState<boolean>(false)
    const [preview, leftovers] = useMemo(() => [groups.slice(0, GROUP_PREVIEW_COUNT), groups.slice(GROUP_PREVIEW_COUNT)], [groups])

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden flex md:flex-col flex-row hidden-scroller whitespace-no-wrap w-full overflow-x-auto m-0 md:ml-2 ">
                {groups.map(g => (
                    <Link key={g.id} to={`/group/${g.id}`} className="text-white hover:opacity-80 transition-opacity">
                        <div className="m-1 px-2 rounded-lg h-20 w-20 text-xs font-semibold relative" style={{ backgroundColor: getPastelColor(g.name).hex }}>
                            <div className="absolute bottom-1 box-border w-full pr-4 break-words">{g.name}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className=" flex flex-col overflow-y-auto" style={{maxHeight: 720}}>
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
                {groups.length >= GROUP_PREVIEW_COUNT && (
                    <p className="cursor-pointer font-bold text-center text-gray-500" onClick={() => setViewAll(v => !v)}>
                        {viewAll ? t("see_less_group") : t("see_all_group")}
                    </p>
                )}
            </div>
        </>
    )
}
export default GroupList