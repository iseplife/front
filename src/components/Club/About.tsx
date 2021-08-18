import React, {useContext} from "react"
import {Skeleton} from "antd"
import {ClubContext} from "../../context/club/context"

const About: React.FC = () => {
    const {state: {club}} = useContext(ClubContext)

    return (
        <div className="w-full">
            {!club.loading && club.data ? (
                <div className="w-full text-justify">{club.data.description}</div>
            ) : (
                <div className="flex flex-row items-center">
                    <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                </div>
            )}
        </div>
    )
}

export default About