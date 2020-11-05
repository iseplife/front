import React, {useMemo, useState} from "react"
import {GroupPreview} from "../../data/group/types"
import {Link} from "react-router-dom"
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {mediaPath} from "../../util";
import {AvatarSizes} from "../../constants/MediaSizes";
import {useTranslation} from "react-i18next";

const GROUP_PREVIEW_COUNT = 15

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
            <div className="block md:hidden flex md:flex-col flex-row hidden-scroller whitespace-no-wrap w-full overflow-x-auto m-0 md:ml-2 ">
                {groups.map(g => (
                    <div key={g.id} className="m-1 px-2 rounded-full bg-gray-400 md:bg-transparent">
                        <Link to={`/group/${g.id}`} className="font-dinot text-white md:text-gray-500 hover:text-gray-600">
                            {g.name}
                        </Link>
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className=" flex flex-col overflow-y-auto" style={{maxHeight: 480}}>
                    {preview.map((g) => (
                        <div key={g.id} className="m-1 px-2 rounded-full bg-gray-400 md:bg-transparent">
                            <Link to={`/group/${g.id}`} className="font-dinot text-white md:text-gray-500 hover:text-gray-600">
                                {g.name}
                            </Link>
                        </div>
                    ))}
                    {viewAll && leftovers.map((g) => (
                        <div key={g.id} className="m-1 px-2 rounded-full bg-gray-400 md:bg-transparent">
                            <Link to={`/group/${g.id}`} className="font-dinot text-white md:text-gray-500 hover:text-gray-600">
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