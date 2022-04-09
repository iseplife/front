import { message } from "antd"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import Feed from "../../../components/Feed"
import StudentClubs from "../../../components/Student/StudentClubs"
import SubscriptionButton from "../../../components/Subscription/SubscriptionButton"
import SubscriptionExtensiveButton from "../../../components/Subscription/SubscriptionExtensiveButton"
import { AvatarSizes } from "../../../constants/MediaSizes"
import { AppContext } from "../../../context/app/context"
import { getStudent } from "../../../data/student"
import { StudentOverview } from "../../../data/student/types"
import { SubscribableType } from "../../../data/subscription/SubscribableType"
import { mediaPath } from "../../../util"

enum StudentTab {
    HOME_TAB,
    CLUBS,
    POSTS,
}

const Student: React.FC = () => {
    const { id: idStr } = useParams<{ id?: string }>()
    const id = useMemo(() => +idStr!, [idStr])

    const [student, setStudent] = useState<StudentOverview>()

    const [t] = useTranslation(["common", "user"])

    const history = useHistory()

    const [tab, setTab] = useState<StudentTab>(StudentTab.HOME_TAB)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])

    const {state: {user: {id: myId}}} = useContext(AppContext)


    /**
     * Club initialisation on mounting
     */
    useEffect(() => {
        if (!isNaN(id)) {
            getStudent(id).then(res => 
                setStudent(res.data)
            ).catch(e =>
                message.error(e)
            )
        } else {
            history.push("404")
        }
    }, [id])

    const tabs = useMemo(() => ({
        [t("common:posts")]: <Feed
            loading={!student?.feedId}
            id={student?.feedId}
            allowPublication={false}
        />,
        [t("user:clubs")]: <StudentClubs student={student} />,
        // [t("user:photos")]: <StudentPhotos id={student?.id} />,
    }), [student?.feedId])
    
    const handleSubscription = useCallback((subscribed) => {
        if (student)
            setStudent({...student, subscribed: subscribed ? {extensive: false} : undefined})
    }, [student])
    const handleExtensive = useCallback((newExtensive: boolean) => {
        if(student)
            setStudent({...student, subscribed: {extensive: newExtensive}})
    }, [student])

    return (
        <>
            {/* <ClubHeader /> */}
            <div className="sm:mt-5 grid container mx-auto sm:grid-cols-2 lg:grid-cols-5">
                
                <div className="mx-4 md:mx-10 sm:col-span-2 sm:col-start-1 lg:col-start-2 lg:col-span-3">
                    <div className="container mx-auto my-5 mb-10 flex gap-5 items-center">
                        <img className="w-32 h-32 rounded-full" src={student?.picture ? mediaPath(student?.picture, AvatarSizes.FULL) : "/img/icons/discovery/user.svg"} />
                        <div>
                            <div className="text-3xl font-bold">{`${student?.firstName} ${student?.lastName}`}</div>
                            <div className="text-xl text-neutral-500">Promo {student?.promo}</div>
                        
                            {student?.id != myId && <div className="flex mt-3">
                                <SubscriptionButton id={student?.id} subscribed={!!student?.subscribed} type={SubscribableType.STUDENT} updateSubscription={handleSubscription} />
                                {student?.subscribed &&
                                    <SubscriptionExtensiveButton updateExtensive={handleExtensive} extensive={student?.subscribed?.extensive} id={student?.id} type={SubscribableType.STUDENT} />
                                }
                            </div>}
                        </div>
                        
                    </div>
                    <TabsSwitcher
                        currentTab={tab}
                        setCurrentTab={setTabFactory}
                        tabs={tabs}
                    />
                </div>
            </div>
        </>
    )
}

export default Student