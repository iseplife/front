import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {ClubPreview} from "../../../data/club/types";
import ClubEditor from "../../../components/Club/ClubEditor";
import {getAllClubs} from "../../../data/club";
import Loading from "../../../components/Common/Loading";
import ClubCard from "../../../components/Club/ClubCard";

const ClubPanel: React.FC = () => {
    const {id} = useParams();
    const [clubs, setClubs] = useState<ClubPreview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Fetch students first page on first load
     */
    useEffect(() => {
        setLoading(true);
        getAllClubs().then(res => {
            if (res.status === 200)
                setClubs(res.data);
        }).finally(() => setLoading(false))
    }, []);

    return (
        <div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/3">
                    <h1 className="font-dinotcb text-2xl text-gray-600">Utilisateurs</h1>
                    <div className="flex flex-no-wrap justify-center md:justify-start md:flex-wrap ">
                        {loading ?
                            <div className="h-full w-full text-center">
                                <Loading size="4x"/>
                            </div>:
                            clubs.map(c =>
                                <Link key={c.id} to={`/admin/club/${c.id}`} className="my-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
                                    <ClubCard className="h-48" club={c}/>
                                </Link>
                            )
                        }
                    </div>
                </div>
                <ClubEditor
                    id={id}
                    onDelete={id => setClubs(clubs => clubs.filter(c => c.id !== id))}
                    onCreate={club => setClubs(clubs => [...clubs, club])}
                    onUpdate={club => setClubs(clubs => clubs.map(c => c.id === club.id ? club : c))}
                    onArchive={club => setClubs(clubs => clubs.map(c => c.id === club.id ? club : c))}
                />
            </div>
        </div>
    )
}

export default ClubPanel;