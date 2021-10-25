import React, {useContext} from "react"
import {ClubContext} from "../../context/club/context"

const About: React.FC = () => {
    const {club: {description}} = useContext(ClubContext)

    return (
        <div className="w-full">
            <div className="w-full text-justify">{description}</div>
        </div>
    )
}

export default About