import React, {useCallback, useEffect, useState} from "react"
import {PostUpdate} from "../../data/post/types"
import Embed from "./Embed"
import {Modal} from "antd"
import {useTranslation} from "react-i18next"
import PostEditForm from "./Form/PostEditForm"
import {faHouseCircleExclamation, faThumbtack} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import PostToolBar from "./PostToolBar"
import {homepageForcedPost, pinPost} from "../../data/post"
import DropdownPanel from "../Common/DropdownPanel"
import { feedsManager, ManagerPost } from "../../datamanager/FeedsManager"
import { PostContextTag } from "./context/PostContextTag"
import PostAuthor from "./PostAuthor"
import useAdminRole from "../../hooks/useAdminRole"
import PostThread from "./PostThread"


type PostProps = {
    data: ManagerPost
    feedId: number | undefined,
    isEdited: boolean
    forceShowComments?: boolean
    toggleEdition: (toggle: boolean) => void
    onPin: (id: number, pinned: boolean) => void
    onDelete: (id: number) => Promise<void>
    onUpdate: (id: number, postUpdate: PostUpdate) => void
}

const Post: React.FC<PostProps> = ({data, feedId, isEdited, forceShowComments = false, onPin, onDelete, onUpdate, toggleEdition}) => {
    const {t} = useTranslation(["common", "post"])
    const [showEditMenu, setShowEditMenu] = useState<boolean>(false)
    const isAdmin = useAdminRole()

    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
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
            onPin(data.id, !data.pinned)
        })
    }, [data.id, data.pinned, onPin])

    const toggleHomepageForced = useCallback(async () => {
        homepageForcedPost(data.id, !data.homepageForced)
    }, [data.id, data.homepageForced])


    let post!: HTMLDivElement
    useEffect(() => {
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
    }, [data.id])

    useEffect(() => {
        if (showEditMenu) {
            const onClick = () => setShowEditMenu(false)
            window.addEventListener("click", onClick)
            return () => {
                window.removeEventListener("click", onClick)
            }
        }
    }, [showEditMenu])

    const setRef = useCallback(ele => { post = ele ?? post }, [post])
    const applyUpdates = useCallback(() => feedsManager.applyUpdates(data.id), [data?.id])

    return (
        <div>
            {isEdited && (
                <Modal
                    className="md:w-1/2 w-4/5"
                    visible={true}
                    footer={null}
                    title={<span className="text-gray-800 font-bold text-2xl">{t("post:edit")}</span>}
                    onCancel={() => toggleEdition(false)}
                >
                    <PostEditForm post={data} onEdit={confirmUpdate} onClose={() => toggleEdition(false)}/>
                </Modal>
            )}
            <div className="flex flex-col p-4 shadow-sm rounded-lg bg-white my-5 relative" ref={setRef}>
                <div className="w-full flex justify-between mb-1">
                    <PostAuthor author={data.author} publicationDate={data.publicationDate}/>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4 -mr-1.5 min-w-0 ml-2">
                        {feedId == undefined &&
                            <PostContextTag context={data.context}/>
                        }
                        {data.pinned && (
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                className="mr-2.5 text-gray-500 ml-1"
                            />
                        )}
                        {data.homepageForced && isAdmin && (
                            <FontAwesomeIcon
                                icon={faHouseCircleExclamation}
                                className="mr-2.5 text-gray-500 ml-1"
                            />
                        )}
                        {data.hasWriteAccess && (
                            <DropdownPanel
                                panelClassName="w-32 right-0 lg:left-0"
                                closeOnClick={true}
                                buttonClassName="mr-0 ml-1"
                            >
                                <PostToolBar
                                    feed={feedId}
                                    pinned={data.pinned}
                                    homepageForced={data.homepageForced}
                                    triggerPin={togglePin}
                                    triggerHomepageForced={toggleHomepageForced}
                                    triggerEdition={() => toggleEdition(true)}
                                    triggerDeletion={confirmDeletion}
                                />
                            </DropdownPanel>
                        )}
                    </div>
                </div>
                <div>
                    <span>{data.description}</span>
                    {data.embed &&
                        <div className="mt-2"><Embed embed={data.embed} post={data}/></div>
                    }
                </div>
                <PostThread
                    thread={data.thread}
                    liked={data.liked}
                    likesCount={data.nbLikes}
                    commentsCount={data.nbComments}
                    forceShowComments={forceShowComments}
                    trendingComment={data.trendingComment}
                />

                {data.waitingForUpdate &&
                    <div className="bg-black/40 backdrop-blur-md h-full w-full grid place-items-center absolute rounded-lg top-0 left-0">
                        <button onClick={applyUpdates} className={"rounded-full px-4 py-2 bg-neutral-500 font-semibold text-white text-base mt-1 " + (data.waitFor?.delete && "text-red-400")}>
                            {t(data.waitFor?.delete ? "post:updates.deleted" : "post:updates.edited")}
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Post
