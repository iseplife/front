import { message } from "antd"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import WebPPolyfill from "../../../components/Common/WebPPolyfill"
import Feed from "../../../components/Feed"
import StudentClubs from "../../../components/Student/StudentClubs"
import SubscriptionHandler from "../../../components/Subscription"
import { AvatarSizes } from "../../../constants/MediaSizes"
import { AppContext } from "../../../context/app/context"
import { Subscription } from "../../../data/feed/types"
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
    
    const handleSubscription = useCallback((sub: Subscription) => {
        if (student)
            setStudent({...student, subscribed: sub })
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
                        <WebPPolyfill className="w-32 h-32 rounded-full" src={student?.picture ? mediaPath(student?.picture, AvatarSizes.FULL) : "/img/icons/discovery/user.svg"} />
                        <div>
                            {
                                student ? <>
                                    <div className="text-2xl sm:text-3xl font-bold">{`${student?.firstName} ${student?.lastName}`}</div>
                                    <div className="text-lg sm:text-xl text-neutral-500">Promo {student?.promo}</div>
                                </> : <>
                                    <div className="text-2xl sm:text-3xl font-bold h-8 w-32 bg-neutral-200 rounded-full absolute"></div>
                                    <div className="text-2xl sm:text-3xl font-bold">&nbsp;</div>
                                    <div className="text-lg sm:text-xl text-neutral-500 flex">Promo ...</div>
                                </>
                            }
                            <div className="flex mt-3">
                                {student ? 
                                    student?.id != myId &&
                                        <SubscriptionHandler
                                            type={SubscribableType.STUDENT}
                                            subscribable={student.id}
                                            subscription={student.subscribed}
                                            onUpdate={handleSubscription}
                                        />
                                    : <div className="flex">
                                        <div className="w-24 h-10 rounded-full bg-neutral-200" />
                                        <div className="w-10 h-10 rounded-full bg-neutral-200 ml-2" />
                                    </div>
                                }
                            </div>
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