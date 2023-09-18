import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { faBan } from "@fortawesome/free-solid-svg-icons"
import { useLiveQuery } from "dexie-react-hooks"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import DropdownPanel from "../../../components/Common/DropdownPanel"
import DropdownPanelElement from "../../../components/Common/DropdownPanelElement"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import { WebPAvatarPolyfill } from "../../../components/Common/WebPPolyfill"
import Feed from "../../../components/Feed"
import { entityPreloader } from "../../../components/Optimization/EntityPreloader"
import StudentClubs from "../../../components/Student/StudentClubs"
import SubscriptionHandler from "../../../components/Subscription"
import { AvatarSizes } from "../../../constants/MediaSizes"
import { AppContext } from "../../../context/app/context"
import { Subscription } from "../../../data/feed/types"
import { Author } from "../../../data/request.type"
import { getStudent } from "../../../data/student"
import { StudentOverview, StudentPreview } from "../../../data/student/types"
import { SubscribableType } from "../../../data/subscription/SubscribableType"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { mediaPath } from "../../../util"
import {AxiosError} from "axios"
import { familyColors, familyNames } from "../../../constants/FamilyType"

interface ParamTypes {
    id?: string
}
enum StudentTab {
    HOME_TAB,
    CLUBS,
    POSTS,
}

const Student: React.FC = () => {
    const {id: idStr} = useParams<ParamTypes>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])

    const [student, setStudent] = useState<StudentOverview>()

    const [t] = useTranslation(["common", "user"])

    const history = useHistory()

    const [tab, setTab] = useState<StudentTab>(StudentTab.HOME_TAB)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])

    const {state: {user: {id: myId}}} = useContext(AppContext)

    const cache = entityPreloader.get<StudentPreview, Author>(id)

    const linkedinUser = useMemo(() => myId == 60669, [myId])

    /**
     * Club initialisation on mounting
     */
    useEffect(() => {
        if (!isNaN(id)) {
            getStudent(id).then(res => 
                setStudent(res.data)
            ).catch((e: AxiosError) => {
                if (e.response && e.response.status == 404)
                    history.replace("/404")
            })
        } else {
            history.replace("404")
        }
    }, [id])

    const tabs = useMemo(() => ({
        [t("common:posts")]: <Feed 
            key={`sfeed${id}`}
            loading={!(student ?? cache)?.feedId}
            id={(student ?? cache)?.feedId}
            allowPublication={false}
        />,
        [t("user:clubs")]: <StudentClubs student={student} />,
        // [t("user:photos")]: <StudentPhotos id={student?.id} />,
    }), [student?.feedId, cache?.feedId])
    
    const handleSubscription = useCallback((sub: Subscription) => {
        if (student)
            setStudent({...student, subscribed: sub })
    }, [student])

    const onBlock = useCallback(() => {
        const id = (student ?? cache)?.id
        if(id)
            feedsManager.addBlocked(id)
    }, [(student ?? cache)?.id])
    const onUnBlock = useCallback(() => {
        const id = (student ?? cache)?.id
        if(id)
            feedsManager.removeBlocked(id)
    }, [(student ?? cache)?.id])
    

    const isBlocked = useLiveQuery(async () => (student || cache) && (await feedsManager.getBlocked()).includes((student || cache)!.id), [(student ?? cache)?.id])
    
    return (
        <>
            <div className="absolute flex w-full justify-end">
                <DropdownPanel 
                    buttonClassName="absolute top-2 right-2 "
                    panelClassName="w-32 right-0 select-none text-base font-medium"
                >
                    <DropdownPanelElement icon={faBan} title={t(isBlocked ? "common:unblock" : "common:block")} onClick={isBlocked ? onUnBlock : onBlock} color="red" />
                </DropdownPanel>
            </div>
            <div className="sm:mt-5 grid container mx-auto sm:grid-cols-2 lg:grid-cols-5">
                <div className="mx-4 md:mx-10 sm:col-span-2 sm:col-start-1 lg:col-start-2 lg:col-span-3 max-w-[calc(100vw-2rem)]">
                    <div className="container mx-auto my-5 mb-10 flex gap-5 items-center">
                        <WebPAvatarPolyfill className="w-32 h-32 rounded-full absolute" src={cache?.picture ?? cache?.thumbURL ?? cache?.thumbnail ? mediaPath(cache?.picture ?? cache?.thumbURL ?? cache?.thumbnail, AvatarSizes.THUMBNAIL) : "/img/icons/discovery/user.svg"} />
                        <WebPAvatarPolyfill className="w-32 h-32 rounded-full z-10 bg-transparent flex-shrink-0" src={student?.picture && mediaPath(student?.picture, AvatarSizes.FULL)} />
                        <div>
                            {student || cache ? 
                                <div className="text-2xl sm:text-3xl font-bold">{student ? `${student?.firstName} ${student?.lastName}` : (cache?.name ?? `${cache?.firstName} ${cache?.lastName}`)}</div>
                                :
                                <>
                                    <div className="text-2xl sm:text-3xl font-bold h-8 w-32 bg-neutral-200 rounded-full absolute"></div>
                                    <div className="text-2xl sm:text-3xl font-bold">&nbsp;</div>
                                </>
                            }
                            {student || cache?.promo ?
                                <div className="text-lg sm:text-xl text-neutral-500">Promo {student?.promo ?? cache?.promo}</div>
                                :
                                <div className="text-lg sm:text-xl text-neutral-500 flex">Promo ...</div>
                            }
                            {
                                (student?.family !== undefined || !student) &&
                                <div className="flex">
                                    {student?.family !== undefined ?
                                        <div className="text-lg sm:text-xl rounded-lg px-2 py-1" style={{
                                            backgroundColor: familyColors[student?.family]?.color,
                                            color: familyColors[student?.family]?.textColor
                                        }}>
                                            { familyNames[student?.family] }
                                        </div>
                                        :
                                        <div className="text-lg sm:text-xl bg-neutral-200 rounded-lg px-2 py-1">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </div>
                                    }
                                </div>
                            }
                            {id != myId &&
                                <div className="flex mt-3">
                                    {student ? 
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
                                    {linkedinUser && <img src="/img/linkedin (1).svg" alt="" className="h-8 w-8 mt-1 ml-2" />}
                                </div>
                            }
                        </div>
                        
                    </div>
                    {
                        linkedinUser && 
                            <div className="w-full text-center py-1 mb-4 -mt-6 text-lg rounded-full border-2 border-indigo-400/[30%] bg-indigo-400/[2%] font-medium text-indigo-400">
                                Voir le CV
                            </div>
                    }
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
