import React, {useCallback, useEffect, useState} from "react"
import {PostUpdate} from "../../data/post/types"
import Embed from "./Embed"
import {message, Modal} from "antd"
import {useTranslation} from "react-i18next"
import PostEditForm from "./Form/PostEditForm"
import {faFlag, faHouseCircleCheck, faShare, faThumbtack} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import PostToolBar from "./PostToolBar"
import {homepageForcedPost, pinPost} from "../../data/post"
import DropdownPanel from "../Common/DropdownPanel"
import { feedsManager, ManagerPost } from "../../datamanager/FeedsManager"
import { PostContextTag } from "./context/PostContextTag"
import PostAuthor from "./PostAuthor"
import useAdminRole from "../../hooks/useAdminRole"
import PostThread from "./PostThread"
import DropdownPanelElement from "../Common/DropdownPanelElement"
import { useHistory } from "react-router-dom"
import { copyToClipboard, getPostLink } from "../../util"
import CustomText from "../Common/CustomText"


export type PostProps = {
    data: ManagerPost
    feedId: number | undefined,
    isEdited: boolean
    forceShowComments?: boolean
    toggleEdition: (toggle: boolean) => void
    onPin: (id: number, pinned: boolean, homepage?: boolean) => void
    onDelete: (id: number) => Promise<void>
    onUpdate: (id: number, postUpdate: PostUpdate) => void
    onReport: (id: number) => Promise<void>
    selected?: boolean
    className?: string
    noPinned?: boolean
}

const Post: React.FC<PostProps> = ({data, feedId, isEdited, forceShowComments = false, onPin, onDelete, onUpdate, onReport, toggleEdition, selected, noPinned, className = "shadow-sm"}) => {
    const {t} = useTranslation(["common", "post"])
    const [showEditMenu, setShowEditMenu] = useState<boolean>(false)
    const [superVisibility, setSuperVisibility] = useState<boolean>(data.homepageForced)
    const isAdmin = useAdminRole()

    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: t("common:delete"),
            cancelText: t("cancel"),
            onOk: async () => {
                await onDelete(data.id)
            }
        })
    }, [data.id, t, onDelete])

    const confirmUpdate = useCallback((updatedPost: PostUpdate) => {
        onUpdate(data.id, updatedPost)
    }, [data.id, onUpdate])

    const togglePin = useCallback((homepage: boolean) => async () => {
        pinPost(data.id, !(homepage ? data.homepagePinned: data.pinned), homepage).then(() => {
            onPin(data.id, !data.pinned, homepage)
        })
    }, [data.homepagePinned, data.id, data.pinned, onPin])

    const toggleHomepageForced = useCallback(async () => {
        homepageForcedPost(data.id, !superVisibility).then(() => {
            setSuperVisibility(sv => !sv)
        })
    }, [data.id, superVisibility])

    useEffect(() => setSuperVisibility(data.homepageForced), [data.homepageForced])

    let post!: HTMLDivElement
    /* useEffect(() => {
        //Petite opti
        const scrollListener = () => {
            const boundings = post.getBoundingClientRect()
            if (boundings.bottom < -200)
                post.style.visibility = "hidden"
            else
                post.style.visibility = ""
        }

        const main = document.getElementById("main")
        main?.addEventListener("scroll", scrollListener)

        return () => {
            main?.removeEventListener("scroll", scrollListener)
        }
    }, [data.id]) */

    useEffect(() => {
        if (showEditMenu) {
            const onClick = () => setShowEditMenu(false)
            window.addEventListener("click", onClick)
            return () => {
                window.removeEventListener("click", onClick)
            }
        }
    }, [showEditMenu])

    const setRef = useCallback((ele: HTMLDivElement) => { post = ele ?? post }, [post])
    const applyUpdates = useCallback(() => feedsManager.applyUpdates(data.id), [data?.id])

    const h = useHistory()

    const copyLink = useCallback(() => {
        copyToClipboard(getPostLink(data))
        message.success(t("post:copied"))
    }, [feedId, data.id, data.context, h.location.pathname])
                                
    const triggerReport = useCallback(() => 
        onReport(data.id)
    , [data.id, onReport])

    return (
        <>
            {isEdited && (
                <Modal
                    className="w-11/12 md:w-1/2 md:max-w-[600px] rounded-xl overflow-hidden pb-0 top-6 md:top-14"
                    title={<span className="text-gray-800 font-bold text-lg">{t("post:edit")}</span>}
                    visible={true}
                    footer={null}
                    onCancel={() => toggleEdition(false)}
                >
                    <PostEditForm post={data} onEdit={confirmUpdate} onClose={() => toggleEdition(false)}/>
                </Modal>
            )}
            <div className={`flex flex-col p-4 rounded-lg bg-white relative ${className}`} ref={setRef}>
                <div className="w-full flex justify-between mb-1">
                    <PostAuthor author={data.author} publicationDate={data.publicationDate}/>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4 -mr-1.5 min-w-0 ml-2">
                        { (feedId == undefined || feedId == -1) &&
                            <PostContextTag context={data.context}/>
                        }
                        {superVisibility && isAdmin && (
                            <FontAwesomeIcon
                                icon={faHouseCircleCheck}
                                className="mr-2.5 text-gray-400 ml-1"
                            />
                        )}
                        {data.pinned && !noPinned && (
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                className="mr-2.5 text-gray-400 ml-1"
                            />
                        )}
                        {(
                            <DropdownPanel
                                panelClassName="w-32 right-0 lg:left-0 select-none text-base font-medium"
                                closeOnClick={true}
                                buttonClassName="mr-0 ml-1"
                            >
                                <DropdownPanelElement
                                    title={t("post:copy_link")}
                                    onClick={copyLink}
                                    icon={faShare}
                                />
                                {data.hasWriteAccess &&
                                    <PostToolBar
                                        feed={feedId}
                                        pinned={data.pinned}
                                        noPinned={noPinned}
                                        homepageForced={superVisibility}
                                        triggerPin={togglePin}
                                        triggerHomepageForced={toggleHomepageForced}
                                        triggerEdition={() => toggleEdition(true)}
                                        triggerDeletion={confirmDeletion}
                                    />
                                }
                                <DropdownPanelElement
                                    title={t("post:report")}
                                    onClick={triggerReport}
                                    icon={faFlag}
                                    color="red"
                                />
                            </DropdownPanel>
                        )}
                    </div>
                </div>
                <div>
                    <CustomText descLengthThrottle={1000} description={data.description} />
                    {data.embed &&
                        <div className="mt-2">
                            <Embed embed={data.embed} post={data} selected={selected} />
                        </div>
                    }
                </div>
                <PostThread
                    thread={data.thread}
                    liked={data.liked}
                    likesCount={data.oldLikes || data.nbLikes}
                    oldLikes={!!data.oldLikes}
                    commentsCount={data.nbComments}
                    forceShowComments={forceShowComments}
                    trendingComment={data.trendingComment}

                />

                {data.waitingForUpdate &&
                    <div className="bg-black/40 backdrop-blur-md h-full w-full grid place-items-center absolute rounded-lg top-0 left-0 z-50">
                        <button onClick={applyUpdates} className={"rounded-full px-4 py-2 bg-neutral-500 font-semibold text-white text-base mt-1 " + (data.waitFor?.delete && "text-red-400")}>
                            {t(data.waitFor?.delete ? "post:updates.deleted" : "post:updates.edited")}
                        </button>
                    </div>
                }
            </div>
        </>
    )
}

export default Post
