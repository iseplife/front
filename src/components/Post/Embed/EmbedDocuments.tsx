import React, { useMemo } from "react"
import {Document} from "../../../data/media/types"
import { mediaPath } from "../../../util"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFileArrowDown} from "@fortawesome/free-solid-svg-icons"

type EmbedDocumentsProps = {
    data: Document
}
const EmbedDocuments: React.FC<EmbedDocumentsProps> = ({ data }) => {
    const sizeKo = useMemo(() => Math.floor(data.sizeBytes / 1024), [data.sizeBytes])
    const sizeMb = useMemo(() => (sizeKo / 1024).toFixed(sizeKo > 1024 * 10 ? 0 : 2), [sizeKo])

    const sizeFile = useMemo(() => {
        const sizeKo = Math.floor(data.sizeBytes / 1024)
        const sizeMb = (sizeKo / 1024).toFixed(sizeKo > 1024 * 10 ? 0 : 2)

        return sizeKo >= 1024 ? sizeMb + " Mo" : sizeKo + " Ko"
    }, [data.sizeBytes])
    return (
        <span>
            <a
                className="text-neutral-500"
                href={mediaPath(data.name)}
                target="_blank"
                download={data.title}
            >
                <div className="flex items-center bg-indigo-800/[13%] border-indigo-800/20 border rounded p-2 group">
                    <div className="flex">
                        <FontAwesomeIcon icon={faFileArrowDown} className="text-4xl text-white drop-shadow-sm" />
                        <div className="ml-3 leading-5">
                            <div className="text-indigo-500 font-medium text-md group-hover:underline">{ data.title }</div>
                            <div className="text-neutral-500/90 font-normal text-sm -mb-0.5">{ sizeFile }</div>
                        </div>
                    </div>
                </div>
            </a>
        </span>
    )
}

export default EmbedDocuments
