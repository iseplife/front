import React, {CSSProperties} from "react";
import {Club} from "../../../../data/club/type";
import {Avatar, Card, Collapse, Icon, Skeleton} from "antd";
import CustomCoverClub from "./CustomCoverClub";
import About from "../Components/About";
import Galleries from "../Components/Galleries";
import {Gallery} from "../../../../data/gallery/type";
import style from "../../Club.module.css";
import {IconFA} from "../../../Common/IconFA";
import {useTranslation} from "react-i18next";

// Service
const getCoverElement = (club: Club | undefined, clubLoading: boolean): React.ReactNode => {
    return (
        <div className="h-32 md:h-40 lg:h-40 xl:h-40">
            { !!club && !!club.cover && !clubLoading ? <Avatar className="w-full h-full bg-blue-500" shape="square" src={club.cover}/> : <CustomCoverClub/> }
        </div>
    );
};

interface CardDescriptionProps { club: Club | undefined, clubLoading: boolean, galleries: Gallery[], galleriesLoading: boolean }
const CardDescription: React.FC<CardDescriptionProps> = ({club, clubLoading, galleries, galleriesLoading}) => {
    const {t} = useTranslation('club');
    const { Panel } = Collapse;

    const CardCSSProperties: CSSProperties = {height: (window.innerWidth < 500 ? "fit-content" : "calc(100vh - 3rem)")};

    return (
        <Card className={"w-full md:w-64 lg:w-1/4 xl:w-1/4 xl:overflow-y-auto lg:overflow-y-auto md:overflow-y-auto " + style.customScrollbar} style={CardCSSProperties} cover={getCoverElement(club, clubLoading)} bodyStyle={{padding: "0"}}>
            <div className="flex flex-row items-center m-4">
                {
                    !!club && !clubLoading
                        ? <Avatar src={club.logoUrl} shape="circle" className="w-20 h-20 sm:w-12 sm:h-12 md:h-24 md:h-24 lg:w-24 lg:h-24 xl:w-2' xl:h-24 shadow-md "/>
                        : <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-gray-500"/>
                }
                <div className="flex flex-col ml-4">
                    { !!club && !clubLoading && (<div className="text-xl font-bold">{club.name}</div>) }
                    { !!club && !clubLoading && (<div className="text-md italic">{new Date(club.createdAt).toLocaleDateString()}</div>) }
                    { clubLoading && <Skeleton className="w-64" active title paragraph avatar={false}/> }
                </div>
            </div>
            <div key="desktop-display" className="w-full hidden md:block lg:block xl:block">
                <Collapse defaultActiveKey={['1', '2']}
                          bordered={false}
                          expandIconPosition="right"
                          expandIcon={({ isActive }) => <Icon type="right" className="text-gray-600 font-bold text-sm" rotate={isActive ? 90 : 0} />}
                          className="bg-white rounded-none border-b-0 border-t">
                    <Panel header={<span className="text-gray-500">{t('galleries')}</span>} key="1" className="border-b-0 border-t">
                        <Galleries galleries={galleries} isLoading={galleriesLoading}/>
                    </Panel>
                    <Panel  header={<span className="text-gray-500">{t('about')}</span>} key="2" className="border-b-0 border-t">
                        <About club={club} isLoading={clubLoading}/>
                    </Panel>
                </Collapse>,
            </div>
        </Card>
    )
};

export default CardDescription;