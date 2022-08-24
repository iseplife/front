import React, { useMemo } from "react"
import {RichLink} from "../../../data/media/types"
import { appUrl } from "../../../data/http"
import { Link } from "react-router-dom"
import WebPPolyfill from "../../Common/WebPPolyfill"
import { mediaPath } from "../../../util"

type EmbedRichLinkProps = {
    data: RichLink
}
const EmbedRichLink: React.FC<EmbedRichLinkProps> = ({ data }) => {
    const currentUrl = useMemo(() => new URL(data.link), [data.link])
    const related = currentUrl.host == appUrl.host
    return (
        <Link
            to={{pathname: related ? currentUrl.pathname : data.link}}
            target={related ? "_self" : "_blank"}
        >
            <div className="rounded-xl border-[#dbe2e6] border relative h-32 w-full overflow-hidden flex items-center">
                {data.imageUrl && <WebPPolyfill src={mediaPath(data.imageUrl)} className="h-32 w-32 flex-shrink-0" />}
                <div className="ml-3 text-base max-w-full overflow-hidden text-ellipsis pr-3">
                    <div className="text-neutral-500/90 text-[14.5px]">
                        {currentUrl.host}
                    </div>
                    <span className="text-neutral-900 whitespace-nowrap">
                        {data.title}
                    </span>

                    <br />
                    
                    <span className="text-neutral-500 line-clamp-2">
                        {data.description}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default EmbedRichLink
