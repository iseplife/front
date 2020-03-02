import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {Club as ClubType} from "../../data/club/type";
import {getClubById} from "../../data/club";

const Club: React.FC = () => {
    const {id} = useParams();

    const [club, setClub] = useState<ClubType>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => initClub(), [])
    const initClub = () => {
        if (!!id) {
            getClubById(id)
                .then(res => {
                    const club = res.data as ClubType;
                    setClub(club);
                })
                .catch(e => console.log("ERREUR", e))
                .finally(() => setIsLoading(false));
        }
    };
    return (
        <div></div>
    );
}

export default Club;