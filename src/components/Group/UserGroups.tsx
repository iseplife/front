import React from "react"
import {useTranslation} from "react-i18next"
import GroupList from "./GroupList"
import {Divider, Skeleton} from "antd"
import { useLiveQuery } from "dexie-react-hooks"
import { groupManager } from "../../datamanager/GroupManager"


const UserGroups: React.FC = () => {
    const {t} = useTranslation("group")
    const groups = useLiveQuery(() => groupManager.getGroups(), [])

    return (
        <div className="">
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("group") + "s"}</Divider>
            <h3 className="text-gray-700 text-lg hidden sm:block">{t("group") + "s"}</h3>
            {!groups ?
                <>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                </> :
                <GroupList groups={groups}/>
            }
        </div>
    )
}

export default UserGroups