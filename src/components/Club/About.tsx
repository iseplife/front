import React, {useContext} from "react"
import {ClubContext} from "../../context/club/context"
import CustomText from "../Common/CustomText"

const About: React.FC = () => {
    const {club: {description}} = useContext(ClubContext)

    return (
        <CustomText description={description} />
    )
}

export default About