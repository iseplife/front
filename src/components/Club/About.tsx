import React, {useContext} from "react"
import {IconFA} from "../Common/IconFA"
import {Skeleton} from "antd"
import {ClubContext} from "../../context/club/context"

const About: React.FC = () => {
    const {state: {club}} = useContext(ClubContext)

    return (
        <div className="w-full">
            {!club.loading && club.data ? (
                <div>
                    <IconFA name="fa-info-circle" type="solid" size="2x" className="mr-2 w-12 text-purple-500"/>
                    <div className="w-full text-justify">{club.data.description}</div>
                </div>
            ) : (
                <div className="flex flex-row items-center">
                    <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                </div>
            )}
        </div>
    )
}

export default About