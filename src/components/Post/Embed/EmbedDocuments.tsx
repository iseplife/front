import React from "react"
import {Document} from "../../../data/media/types"
import { mediaPath } from "../../../util"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFileLines} from "@fortawesome/free-solid-svg-icons"

type EmbedDocumentsProps = {
    data: Document
}
const EmbedDocuments: React.FC<EmbedDocumentsProps> = ({data}) => {
    return (
        <span>
            <a
                className="text-gray-500 hover:text-gray-600 font-bold"
                href={mediaPath(data.name)}
                target="_blank"
                download={data.title}
            >
                <FontAwesomeIcon icon={faFileLines} /> {data.title}
            </a>
        </span>
    )
}

export default EmbedDocuments
