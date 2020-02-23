import React, {useEffect, useState} from "react";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import {Card, Collapse, Skeleton} from "antd";
import {Link} from "react-router-dom";
import {HorizontalSpacer} from "../../pages/discovery";
import {useTranslation} from "react-i18next";
import {getAllClubs} from "../../data/club";
import {Club} from "../../data/club/types";

const DiscoveryClub: React.FC = () => {
    const {t} = useTranslation('discovery');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [nbOfClubs, setNbOfClubs] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const initClubs = () => {
        setIsLoading(true);
        getAllClubs().then(res => {
            setClubs(res.data);
            setNbOfClubs(res.data.length);
        }).catch().finally(() => setIsLoading(false));
    };
    useEffect(() => initClubs(), []);

    const CustomClubCard = (props: any) => (
        <div className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 text-center content-end my-2">
            <Card hoverable className="rounded-lg shadow-xl hover:shadow-outline h-full mx-1"
                  cover={<Link to={`/club/${props.club.id}`}>
                      <img className="rounded-t-lg mx-auto w-full h-full" alt={props.club.name}
                           src={props.club.logoUrl}/></Link>}>
                <Collapse className="font-bold mt-2 text-sm sm:text-xl rounded-t-lg"
                          expandIconPosition="right" bordered={false}>
                    <CollapsePanel key={1} header={props.club.name} className="rounded-b-lg">
                        <p className="text-xs sm:text-sm">{props.club.description}</p>
                    </CollapsePanel>
                </Collapse>
            </Card>
        </div>
    );


    return (
        <div className="container text-center mx-auto my-5">
            <div
                className="flex justify-center items-center font-bold text-indigo-500 py-3 text-4xl">
                {t('associations')}
                <span
                    className="flex ml-2 text-lg">{(nbOfClubs !== 0) ? `(${nbOfClubs})` : ""}</span>
            </div>
            <HorizontalSpacer spacing={6}/>
            {/* List of Clubs */}
            <div className="flex flex-wrap justify-start">
                {!isLoading
                    ? clubs.map((club, i) => {
                        return (<CustomClubCard key={i} club={club}/>);
                    })
                    : <div className="flex flex-wrap flex-row w-full">
                        <Skeleton className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4" active
                                  avatar loading={true} paragraph={{rows: 5}}/>
                        <Skeleton className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4" active
                                  avatar loading={true} paragraph={{rows: 5}}/>
                        <Skeleton className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4" active
                                  avatar loading={true} paragraph={{rows: 5}}/>
                        <Skeleton className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4" active
                                  avatar loading={true} paragraph={{rows: 5}}/>
                    </div>}
            </div>
        </div>
    );
};

export default DiscoveryClub;