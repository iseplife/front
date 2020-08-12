import React, {useEffect, useState} from "react"
import {useParams} from "react-router"
import {Club as ClubType, ClubMember} from "../../data/club/types"
import {getClub, getClubGalleries, getClubMembers} from "../../data/club"
import {Avatar, message, Skeleton} from "antd"
import {Gallery} from "../../data/gallery/types"
import {useHistory} from "react-router-dom"
import ClubNavbar from "../../components/Club/Mobile/ClubNavbar"
import ClubCover from "../../components/Club/ClubDescription/ClubCover"
import {IconFA} from "../../components/Common/IconFA"

const Club: React.FC = () => {
    const {id} = useParams()

    const history = useHistory()
    const [club, setClub] = useState<ClubType>()
    const [clubLoading, setClubLoading] = useState<boolean>(true)

    const [members, setMembers] = useState<ClubMember[]>([])
    const [membersLoading, setMembersLoading] = useState<boolean>(false)

    const [galleries, setGalleries] = useState<Gallery[]>([])
    const [galleriesLoading, setGalleriesLoading] = useState<boolean>(false)

    // Updated function called when respective tab is active
    const getMembers = (club?: ClubType): void => {
        if (club) {
            setMembersLoading(true)
            getClubMembers(club.id)
                .then(res => {
                    setMembers(res.data)
                })
                .catch(e => message.error(e))
                .finally(() => setMembersLoading(false))
        }
    }
    const getGalleries = (club?: ClubType): void => {
        if (club) {
            setGalleriesLoading(true)
            getClubGalleries(club.id)
                .then(res => {
                    setGalleries(res.data.content)
                })
                .catch(e => message.error(e))
                .finally(() => setGalleriesLoading(false))
        }
    }

    /**
     * Club initialisation on mounting
     */
    useEffect(() => {
        if (!isNaN(id)) {
            setClubLoading(true)
            getClub(+id)
                .then(res => {
                    setClub(res.data)
                })
                .catch(e => message.error(e))
                .finally(() => setClubLoading(false))
        } else {
            history.push("404")
        }
    }, [id])


    useEffect(() => {
        getMembers(club)
        getGalleries(club)
    }, [club])

    return (
        <div className="xl:overflow-y-hidden w-full h-full flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-start">
            <div className="flex flex-col items-center w-full">
                <ClubCover id={club?.id} cover={club?.coverUrl} canEdit={club ? club.canEdit : false}/>
                <div className="flex container p-3">
                    <Avatar src={club?.logoUrl} shape="circle" className="-mt-8 w-20 h-20 sm:w-12 sm:h-12 md:w-32 md:h-32 shadow-md">
                        {clubLoading && <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-white mt-6"/>}
                    </Avatar>

                    <div className="flex flex-col ml-4">
                        {clubLoading || !club ?
                            <>
                                <Skeleton className="w-64" active title paragraph={false}/>
                                <Skeleton className="w-32" active title paragraph={false}/>
                            </> :
                            <>
                                <h1 className="text-3xl mb-0 font-bold">{club.name}</h1>
                                <h4 className="text-md italic">{new Date(club.creation).toLocaleDateString()}</h4>
                            </>
                        }
                    </div>
                </div>
            </div>
            {/* Desktop view
                            <CardDescription club={club} loading={clubLoading} galleries={galleries} galleriesLoading={galleriesLoading}/>
                            <div className={"overflow-y-auto overflow-x-hidden " + style.customScrollbar}>
                            {club &&
                            <Feed id={club.feed} allowPublication={false} className="m-4 hidden sm:hidden md:block lg:block xl:block"/>
                            }
                            </div>
                            <SidePanelMembers members={members} loading={membersLoading}/>
                            */
            }
            {/* Mobile view */
            }
            <ClubNavbar
                club={club}
                members={members}
                galleries={galleries}
                clubLoading={clubLoading}
                membersLoading={membersLoading}
                galleriesLoading={galleriesLoading}
            />
        </div>
    )
}

export default Club