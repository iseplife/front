import React, {useEffect, useState} from "react"
import {getUserGroups} from "../../data/group"
import {GroupPreview} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import GroupList from "./GroupList"
import {Divider, Skeleton} from "antd"


const UserGroups: React.FC = () => {
    const {t} = useTranslation("group")
    const [groups, setGroups] = useState<GroupPreview[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        getUserGroups().then(res => {
            setGroups(res.data)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="">
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("group") + "s"}</Divider>
            <h3 className="text-gray-700 text-lg hidden sm:block">{t("group") + "s"}</h3>
            {loading ?
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