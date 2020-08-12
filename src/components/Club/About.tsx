import React from "react"
import {Club} from "../../data/club/types"
import {IconFA} from "../Common/IconFA"
import {Skeleton} from "antd"

interface AboutProps {
    club?: Club
    isLoading: boolean
}

const About: React.FC<AboutProps> = ({club, isLoading}) => (
    <div className="w-full">
        {club && !isLoading ? (
            <div>
                <IconFA name="fa-info-circle" type="solid" size="2x" className="mr-2 w-12 text-purple-500"/>
                <div className="w-full text-justify">{club.description}</div>
            </div>
        ) : (
            <div className="flex flex-row items-center">
                <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
            </div>
        )}
    </div>
)

export default About