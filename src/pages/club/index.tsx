import React, {useEffect, useReducer, useState} from "react"
import {useParams} from "react-router"
import {Club as ClubType} from "../../data/club/types"
import {getClub, getClubGalleries, getClubMembers} from "../../data/club"
import {Button, message, Skeleton} from "antd"
import {Gallery, GalleryPreview} from "../../data/gallery/types"
import {useHistory} from "react-router-dom"
import ClubNavbar from "../../components/Club/Mobile/ClubNavbar"
import ClubCover from "../../components/Club/ClubDescription/ClubCover"
import {IconFA} from "../../components/Common/IconFA"
import SocialIcon from "../../components/Common/SocialIcon"
import SidePanelMembers from "../../components/Club/Desktop/SidePanelMembers"
import Feed from "../../components/Feed"
import ClubPresentation from "../../components/Club/ClubDescription/ClubPresentation"
import ClubAdmin from "../../components/Club/ClubAdmin"
import ClubLogo from "../../components/Club/ClubLogo"
import {clubContextReducer} from "../../context/club/reducer"
import {ClubContext, DEFAULT_STATE} from "../../context/club/context"
import {ClubActionType} from "../../context/club/action"

const Club: React.FC = () => {
    const {id} = useParams()

    const history = useHistory()
    const [state, dispatch] = useReducer(clubContextReducer, DEFAULT_STATE)

    const [galleries, setGalleries] = useState<GalleryPreview[]>([])
    const [galleriesLoading, setGalleriesLoading] = useState<boolean>(false)

    // Updated function called when respective tab is active
    const getMembers = (club?: ClubType): void => {
        if (club) {
            dispatch({type: ClubActionType.FETCH_MEMBERS})
            getClubMembers(club.id)
                .then(res => {
                    dispatch({type: ClubActionType.GET_MEMBERS, payload: res.data})
                })
                .catch(e => message.error(e))
                //.finally(() => setMembersLoading(false))
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
            dispatch({type: ClubActionType.FETCH_CLUB})
            getClub(+id)
                .then(res => {
                    dispatch({type: ClubActionType.GET_CLUB, payload: res.data})
                })
                .catch(e => message.error(e))
                //.finally(() => setClubLoading(false))
        } else {
            history.push("404")
        }
    }, [id])


    useEffect(() => {
        getMembers(state.club.data)
        getGalleries(state.club.data)
    }, [state.club.data])

    return (
        <ClubContext.Provider value={{ state, dispatch }}>
            <div className="w-full h-full ">
                <ClubCover />
                <div className="flex justify-between container p-3 mx-auto">
                    <div className="flex">
                        <ClubLogo />
                        <div className="flex flex-col ml-4 md:mt-0 -mt-4">
                            {state.club.loading || !state.club.data ?
                                <>
                                    <Skeleton className="w-64" active title paragraph={false}/>
                                    <Skeleton className="w-32" active title paragraph={false}/>
                                </> :
                                <>
                                    <h1 className="text-3xl mb-0 font-bold">{state.club.data.name}</h1>
                                    <h4 className="text-md italic">{new Date(state.club.data.creation).toLocaleDateString()}</h4>
                                </>
                            }
                        </div>
                        {state.adminMode && <h1 className="ml-5 my-auto font-dinotcb text-2xl text-gray-600">Panel administration</h1>}
                    </div>
                    {state.club.data &&
                    <div className="flex items-center" style={{height: "min-content"}}>
                        {state.club.data.website && <SocialIcon type="fa-firefox" url={state.club.data.website}/>}
                        {state.club.data.facebook && <SocialIcon type="fa-facebook" url={state.club.data.facebook}/>}
                        {state.club.data.instagram && <SocialIcon type="fa-instagram" url={state.club.data.instagram}/>}
                        {state.club.data.snapchat && <SocialIcon type="fa-snapchat" url={state.club.data.snapchat}/>}
                        {state.club.data.canEdit &&
                        <Button type="primary" onClick={() => dispatch({type: ClubActionType.TOGGLE_ADMIN_MODE})}>
                            Mode admin
                            <IconFA
                                className="hidden md:inline cursor-pointer ml-2"
                                name={state.adminMode ? "fa-sign-out-alt" : "fa-tools"}
                            />
                        </Button>
                        }
                    </div>
                    }
                </div>


                <div key="desktop-display" className="hidden md:flex flex-row -mt-10 pt-10 px-5">
                    {state.adminMode && state.club.data ?
                        <ClubAdmin /> :
                        <>
                            <ClubPresentation />
                            <div className="flex-grow">
                                {state.club.data &&
                                <Feed id={state.club.data.feed} allowPublication={false} className="m-4 hidden md:block"/>
                                }
                            </div>

                            <SidePanelMembers />
                        </>
                    }
                </div>

                <ClubNavbar key="mobile-display"/>
            </div>
        </ClubContext.Provider>
    )
}

export default Club