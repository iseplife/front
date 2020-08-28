import React, {useMemo} from "react"
import {Skeleton} from "antd"
import MemberList from "./MemberList"
import {useTranslation} from "react-i18next"
import {GroupMember} from "../../data/group/types"


type MemberOrga = [GroupMember[], GroupMember[]]

type GroupMembersProps = {
    members?: GroupMember[]
}
const GroupMembers: React.FC<GroupMembersProps> = ({members}) => {
    const {t} = useTranslation("group")
    const [m, admins] = useMemo((): MemberOrga => {
        if (members) {
            return members.reduce((acc: MemberOrga, curr) => {
                acc[curr.admin ? 0 : 1].push(curr)
                return acc
            }, [[], []])
        }
        return [[], []]
    }, [members])
    return (
        members ?
            <div>
                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("admins")}</h3>
                <MemberList members={admins}/>

                <h3 className="font-dinotcb text-gray-800 text-lg mt-3">{t("members")}</h3>
                <MemberList members={m}/>
            </div> :
            <>
                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>

                <Skeleton title paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
                <Skeleton avatar paragraph={{rows: 0}}/>
            </>
    )
}

export default GroupMembers