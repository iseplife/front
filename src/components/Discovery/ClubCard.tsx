import {Link} from "react-router-dom";
import React from "react";
import {Club} from "../../data/club/types";

type ClubCardProps = {
    club: Club
}

const ClubCard: React.FC<ClubCardProps> = ({club}) => (
    <div className="my-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
        <div className="mx-1T rounded shadow-md hover:shadow-xl">
            <div className="h-48">
                <Link to={`/club/${club.id}`}>
                    <img className="rounded-t-lg mx-auto w-full h-full" alt={club.name} src={club.logoUrl}/>
                </Link>
            </div>
            <div className="h-12">
                <h1 className="text-2xl uppercase font-dinotcb">{club.name}</h1>
            </div>
        </div>
    </div>
);

export default ClubCard;