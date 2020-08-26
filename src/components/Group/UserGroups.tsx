import React, {useEffect, useState} from "react"
import {getUserGroups} from "../../data/group"
import {GroupPreview} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import GroupList from "./GroupList"
import {Skeleton} from "antd"


const UserGroups: React.FC = () => {
    const {t} = useTranslation("group")
    const [groups, setGroups] = useState<GroupPreview[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getUserGroups().then(res => {
            setGroups(res.data)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="">
            <h3 className="font-dinotcb text-gray-800 text-lg">{t("group") + "s"}</h3>
            {loading ?
                <>
                    <Skeleton avatar title/>
                    <Skeleton avatar title/>
                    <Skeleton avatar title/>
                </> :
                <GroupList groups={groups}/>
            }
        </div>
    )
}

export default UserGroups