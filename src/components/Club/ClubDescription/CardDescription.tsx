import React from "react"
import {Avatar, Card, Collapse,  Skeleton} from "antd"
import {RightOutlined} from "@ant-design/icons"
import CustomCoverClub from "./CustomCoverClub"
import About from "../About"
import Galleries from "../Galleries"
import {Gallery} from "../../../data/gallery/types"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {Club} from "../../../data/club/types"

import style from "../Club.module.css"
const {Panel} = Collapse

const getCoverElement = (club: Club | undefined, clubLoading: boolean): React.ReactNode => {
    return (
        <div className="h-32 md:h-40 lg:h-40 xl:h-40">
            {club && club.cover && !clubLoading ?
                <Avatar className="w-full h-full bg-blue-500" shape="square" src={club.cover}/> :
                <CustomCoverClub/>
            }
        </div>
    )
}

type CardDescriptionProps = {
    club?: Club,
    loading: boolean,
    galleries: Gallery[],
    galleriesLoading: boolean
}

const CardDescription: React.FC<CardDescriptionProps> = ({club, loading, galleries, galleriesLoading}) => {
    const {t} = useTranslation("club")
    return (
        <Card
            className={"w-full md:w-64 lg:w-1/4 xl:w-1/4 xl:overflow-y-auto lg:overflow-y-auto md:overflow-y-auto " + style.customScrollbar}
            style={{height: "calc(100vh - 3rem)"}}
            cover={getCoverElement(club, loading)}
            bodyStyle={{padding: "0"}}
        >
            <div className="flex flex-row items-center m-4">
                {
                    club && !loading
                        ? <Avatar src={club.logoUrl} shape="circle" className="w-20 h-20 sm:w-12 sm:h-12 md:h-24 md:h-24 lg:w-24 lg:h-24 xl:w-2' xl:h-24 shadow-md "/>
                        : <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-gray-500"/>
                }
                <div className="flex flex-col ml-4">
                    {loading ?
                        <Skeleton className="w-64" active title paragraph avatar={false}/> :
                        club &&
                        <>
                            <div className="text-xl font-bold">{club.name}</div>
                            <div className="text-md italic">{new Date(club.creation).toLocaleDateString()}</div>
                        </>
                    }
                </div>
            </div>
            <div key="desktop-display" className="w-full hidden md:block lg:block xl:block">
                <Collapse
                    className="bg-white rounded-none border-b-0 border-t"
                    defaultActiveKey={["1", "2"]}
                    bordered={false}
                    expandIconPosition="right"
                    expandIcon={({isActive}) =>
                        <RightOutlined className="text-gray-600 font-bold text-sm" rotate={isActive ? 90 : 0}/>
                    }
                >
                    <Panel
                        key={1}
                        className="border-b-0 border-t"
                        header={<span className="text-gray-500">{t("galleries")}</span>}
                    >
                        <Galleries galleries={galleries} loading={galleriesLoading}/>
                    </Panel>
                    <Panel
                        key={2}
                        className="border-b-0 border-t"
                        header={<span className="text-gray-500">{t("about")}</span>}
                    >
                        <About club={club} isLoading={loading}/>
                    </Panel>
                </Collapse>,
            </div>
        </Card>
    )
}

export default CardDescription