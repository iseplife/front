import React, {useContext, useEffect, useState} from "react"
import {getUserGroups} from "../../data/group"
import {GroupPreview} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import GroupList from "./GroupList"
import {Divider, Skeleton} from "antd"
import { AppContext } from "../../context/app/context"


const UserGroups: React.FC = () => {
    const {t} = useTranslation("group")
    const {state: {user}} = useContext(AppContext)

    return (
        <div className="">
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("group") + "s"}</Divider>
            <h3 className="text-gray-700 text-lg hidden sm:block">{t("group") + "s"}</h3>
            {!user?.groups ?
                <>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                    <Skeleton title paragraph={{rows: 0}}/>
                </> :
                <GroupList groups={user.groups}/>
            }
        </div>
    )
}

export default UserGroups