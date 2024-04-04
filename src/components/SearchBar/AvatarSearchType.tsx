import React, {useMemo} from "react"
import {SearchItemType} from "../../data/searchbar/types"
import {AvatarSizes} from "../../constants/MediaSizes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faUser, faUsers, IconDefinition} from "@fortawesome/free-solid-svg-icons"
import {faCalendar} from "@fortawesome/free-regular-svg-icons"
import { WebPAvatarPolyfill } from "../Common/WebPPolyfill"
import { isBefore } from "date-fns/esm"
import { mediaPath, _format } from "../../util"

type AvatarSearchTypeProps = {
    type: SearchItemType
    text: string
    thumbURL?: string
    description?: string
    startsAt?: Date
}
const AvatarSearchType: React.FC<AvatarSearchTypeProps> = ({thumbURL, text, type, description, startsAt = new Date()}) => {
    const icon: IconDefinition = useMemo(() => {
        switch (type){
            case SearchItemType.EVENT:
                return faCalendar
            case SearchItemType.GROUP:
            case SearchItemType.CLUB:
                return faUsers
            case SearchItemType.STUDENT:
            default:
                return faUser
        }
    }, [type])

    // const getImgPath = (value:string | undefined) => {
    //     console.log(value)
    //     const id = 92
    //     let newPath = process.env.PUBLIC_URL+"/img/takeover/asso/" // Initialisation du nouveau chemin avec la valeur actuelle de imgPath
    //     switch (id) {
    //         case 92:
    //             newPath += "ludisep.jpg"
    //             break
    //         case 125:
    //             newPath += "anim.jpg" // Assurez-vous que c'est ce que vous voulez pour l'ID 125
    //             break
    //         case 122:
    //             newPath += "as.jpg"
    //             break
    //         case 59:
    //             newPath += "aumonerie.jpg"
    //             break
    //         case 77:
    //             newPath += "bands.jpg"
    //             break
    //         default:
    //             break
    //     }
    //     return newPath
    // }

    return (
        <>
            <div className="w-8 flex justify-center">
                { type == SearchItemType.EVENT &&
                    <div className="w-6 h-6 relative flex-shrink-0">
                        <div className="bg-neutral-100 w-full h-full mx-auto sm:mx-0 rounded shadow overflow-hidden relative flex flex-col flex-shrink-0">
                            <div className="bg-red-500 w-full h-2 flex-shrink-0">
                            </div>
                        </div>
                    </div>
                }
                { type != SearchItemType.EVENT && 
                    <WebPAvatarPolyfill
                        src={mediaPath(thumbURL, AvatarSizes.THUMBNAIL)}
                        size="default"
                        shape="circle"
                    >
                        {text.split(" ")[0].slice(0, 1)}
                    </WebPAvatarPolyfill>
                }
            </div>   
        </>
    )
}

export default AvatarSearchType
