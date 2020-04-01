import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Club as ClubType, ClubMember} from "../../data/club/type";
import {getClubById, getClubGalleries, getClubMembers} from "../../data/club";
import CardDescription from "../../components/Club/Common/ClubDescription/CardDescription";
import ClubTabs from "../../components/Club/Mobile/ClubTabs";
import {message} from "antd";
import SidepanelMembers from "../../components/Club/Desktop/SidepanelMembers";
import {Page} from "../../data/request.type";
import {Gallery} from "../../data/gallery/type";
import Feed from "../../components/Feed";
import style from "../../components/Club/Club.module.css";

const Club: React.FC = () => {
    const {id} = useParams();

    const [club, setClub] = useState<ClubType>();
    const [clubLoading, setClubLoading] = useState<boolean>(true);

    const [members, setMembers] = useState<ClubMember[]>([]);
    const [membersLoading, setMembersLoading] = useState<boolean>(false);

    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [galleriesLoading, setGalleriesLoading] = useState<boolean>(false);

    // Club initialization
    useEffect(() => {
        if (!!id) {
            getClubById(id)
                .then(res => {
                    const club = res.data as ClubType;
                    setClub(club);
                })
                .catch(e => message.error(e))
                .finally(() => setClubLoading(false));
        }
    }, [id]);

    useEffect(() => {
        updateMembers(club);
        updateGalleries(club);
    }, [club]);

    // Updated function called when respective tab is active
    const updateMembers = (club: ClubType | undefined): void => {
        if (!!club && !!club.id) {
            setMembersLoading(true);
            getClubMembers(club.id.toString())
                .then(res => {
                    const members = res.data as ClubMember[];
                    setMembers(members);
                })
                .catch(e => message.error(e))
                .finally(() => setMembersLoading(false));
        }
    };
    const updateGalleries = (club: ClubType | undefined): void => {
        if (!!club && !!club.id) {
            setGalleriesLoading(true);
            getClubGalleries(club.id.toString())
                .then(res => {
                    const page = res.data as Page<Gallery>;
                    const galleries = page.content;
                    setGalleries(galleries);
                })
                .catch(e => message.error(e))
                .finally(() => setGalleriesLoading(false));
        }
    };

    return (
        <div className="xl:overflow-y-hidden lg:overflow-y-hidden md:overflow-y-hidden w-full h-full flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-start">
            <CardDescription club={club} clubLoading={clubLoading} galleries={galleries} galleriesLoading={galleriesLoading}/>
            <div className={"overflow-y-auto overflow-x-hidden " + style.customScrollbar}>
                { !!club && ( <Feed id={club.feed.id} allowPublication={false} className="m-4 hidden sm:hidden md:block lg:block xl:block"/> )}
            </div>
            <SidepanelMembers members={members} isLoading={membersLoading}/>
            <ClubTabs club={club} members={members} galleries={galleries} clubLoading={clubLoading} membersLoading={membersLoading} galleriesLoading={galleriesLoading}></ClubTabs>
        </div>
    );
};

export default Club;