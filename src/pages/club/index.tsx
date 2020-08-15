import React, {useEffect, useState} from "react"
import {useParams} from "react-router"
import {Club as ClubType, ClubMember} from "../../data/club/types"
import {getClub, getClubGalleries, getClubMembers} from "../../data/club"
import {Avatar, Button, message, Skeleton} from "antd"
import {Gallery} from "../../data/gallery/types"
import {useHistory} from "react-router-dom"
import ClubNavbar from "../../components/Club/Mobile/ClubNavbar"
import ClubCover from "../../components/Club/ClubDescription/ClubCover"
import {IconFA} from "../../components/Common/IconFA"
import SocialIcon from "../../components/Common/SocialIcon"
import SidePanelMembers from "../../components/Club/Desktop/SidePanelMembers"
import Feed from "../../components/Feed"
import ClubPresentation from "../../components/Club/ClubDescription/ClubPresentation"
import ClubAdmin from "../../components/Club/ClubAdmin"

const Club: React.FC = () => {
    const {id} = useParams()

    const history = useHistory()
    const [adminMode, setAdminMode] = useState(false)
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
        <div className="w-full h-full ">
            <ClubCover id={club?.id} cover={club?.coverUrl} canEdit={adminMode}/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <Avatar src={club?.logoUrl} shape="circle" className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md">
                        {clubLoading && <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-white mt-6"/>}
                    </Avatar>

                    <div className="flex flex-col ml-4 md:mt-0 -mt-4">
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
                    {adminMode && <h1 className="ml-5 my-auto font-dinotcb text-2xl text-gray-600">Panel administration</h1>}
                </div>
                {club &&
                <div className="flex items-center" style={{height: "min-content"}}>
                    {club.website && <SocialIcon type="fa-firefox" url={club.website}/>}
                    {club.facebook && <SocialIcon type="fa-facebook" url={club.facebook}/>}
                    {club.instagram && <SocialIcon type="fa-instagram" url={club.instagram}/>}
                    {club.snapchat && <SocialIcon type="fa-snapchat" url={club.snapchat}/>}
                    {club.canEdit &&
                    <Button type="primary" onClick={() => setAdminMode(mode => !mode)}>
                        Mode admin
                        <IconFA
                            className="hidden md:inline cursor-pointer ml-2"
                            name={adminMode ? "fa-sign-out-alt" : "fa-tools"}
                        />
                    </Button>
                    }
                </div>
                }
            </div>


            <div key="desktop-display" className="hidden md:flex flex-row -mt-10 pt-10 px-5">
                {adminMode && club ?
                    <ClubAdmin club={club} members={members}/> :
                    <>
                        <ClubPresentation club={club} loading={clubLoading} galleries={galleries} galleriesLoading={galleriesLoading}/>
                        <div className="flex-grow">
                            {club &&
                            <Feed id={club.feed} allowPublication={false} className="m-4 hidden md:block"/>
                            }
                        </div>

                        <SidePanelMembers loading={membersLoading} members={members}/>
                    </>
                }
            </div>

            <ClubNavbar
                key="mobile-display"
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