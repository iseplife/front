import React, { useEffect } from "react"
import {useTranslation} from "react-i18next"
import GroupList from "./GroupList"
import {Divider} from "antd"
import { useLiveQuery } from "dexie-react-hooks"
import { groupManager } from "../../datamanager/GroupManager"
import { GroupPreview } from "../../data/group/types"

let cachedGroups: GroupPreview[] = []

const UserGroups: React.FC = () => {
    const {t} = useTranslation("group")
    const groups = useLiveQuery(() => groupManager.getGroups(), [], cachedGroups)

    //Cache hook for fast first loading
    useEffect(() => {
        if(groups?.length)
            cachedGroups = groups
    }, [groups])

    return (
        <div>
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("group") + "s"}</Divider>
            <h3 className="text-gray-700 text-lg hidden sm:block">{t("group") + "s"}</h3>
            <GroupList groups={groups}/>
        </div>
    )
}

export default UserGroups