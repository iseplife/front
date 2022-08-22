import React, {useContext} from "react"
import {ClubContext} from "../../context/club/context"
import CustomText from "../Common/CustomText"

const About: React.FC = () => {
    const {state} = useContext(ClubContext)

    return (
        <CustomText description={(state.club ?? state.cache)?.description ?? ""} />
    )
}

export default About