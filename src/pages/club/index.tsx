import React, {useEffect, useState} from "react"
import {useParams} from "react-router"
import {Club as ClubType, ClubMember} from "../../data/club/types"
import {getClub, getClubGalleries, getClubMembers} from "../../data/club"
import CardDescription from "../../components/Club/ClubDescription/CardDescription"

import {message} from "antd"
import SidePanelMembers from "../../components/Club/Desktop/SidePanelMembers"
import {Gallery} from "../../data/gallery/types"
import Feed from "../../components/Feed"
import style from "../../components/Club/Club.module.css"
import {useHistory} from "react-router-dom"
import ClubNavbar from "../../components/Club/Mobile/ClubNavbar"

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
        <div className="xl:overflow-y-hidden lg:overflow-y-hidden md:overflow-y-hidden w-full h-full flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-start">
            {/* Desktop view */}
            <CardDescription club={club} loading={clubLoading} galleries={galleries} galleriesLoading={galleriesLoading}/>
            <div className={"overflow-y-auto overflow-x-hidden " + style.customScrollbar}>
                {club &&
                <Feed id={club.feed} allowPublication={false} className="m-4 hidden sm:hidden md:block lg:block xl:block"/>
                }
            </div>
            <SidePanelMembers members={members} loading={membersLoading}/>

            {/* Mobile view */}
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