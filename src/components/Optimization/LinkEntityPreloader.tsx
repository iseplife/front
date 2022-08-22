import { ReactElement, useCallback } from "react"
import { ClubPreview } from "../../data/club/types"
import { EventPreview } from "../../data/event/types"
import { Author } from "../../data/request.type"
import { SearchItem } from "../../data/searchbar/types"
import { StudentPreview } from "../../data/student/types"
import { entityPreloader } from "./EntityPreloader"

interface LinkEntityPreloaderProps {
    preview: Author | StudentPreview | ClubPreview | EventPreview | SearchItem | undefined
    children: ReactElement
}

const LinkEntityPreloader: React.FC<LinkEntityPreloaderProps> = ({preview, children}) => {
    const onClick = useCallback(() =>
        preview && entityPreloader.set(preview.id, preview!)
    , [preview])
    return <div onClick={onClick}>
        {children}
    </div>
}

export default LinkEntityPreloader