import { useCallback, useContext, useState } from "react"
import { AvatarSizes } from "../../../constants/MediaSizes"
import { AppContext } from "../../../context/app/context"
import { Author } from "../../../data/request.type"
import { mediaPath } from "../../../util"
import DropdownPanel from "../../Common/DropdownPanel"
import { WebPAvatarPolyfill } from "../../Common/WebPPolyfill"

interface ClubSelectorProps {
    className?: string
}

const ClubSelector: React.FC<ClubSelectorProps> = ({className}) => {
    const [selectedClub, setSelectedClub] = useState<Author>()
    const {state: {authors}} = useContext(AppContext)

    const selectAuthorFactory = useCallback((author: Author) => () => setSelectedClub(author), [])

    return <DropdownPanel
        closeOnClick
        buttonClassName={`relative ${className} grid`}
        panelClassName="absolute top-[unset] -bottom-1.5 z-[9999] translate-y-full right-0 w-[200%] max-w-[200px] max-h-[50vh] overflow-y-auto scrollbar-thin bg-white rounded-lg shadow-xl border border-neutral-200"
        clickable
        icon={
            <div className={`relative rounded-lg border border-neutral-200 px-3 ${selectedClub ? "py-[11px]" : "py-3"} cursor-pointer text-neutral-400 text-start`}>
                {
                    selectedClub ? <div className="flex items-center">
                        <WebPAvatarPolyfill src={mediaPath(selectedClub.thumbnail, AvatarSizes.THUMBNAIL)} className="flex-shrink-0 w-6 h-6" />
                        <div className="ml-3 w-full line-clamp-1 text-ellipsis overflow-hidden text-indigo-400">{selectedClub.name}</div>
                    </div> : <>Organisateur</>
                }
            </div>
        }
    >
        <>
            {
                authors.map(author => 
                    <div onClick={selectAuthorFactory(author)} className="flex items-center rounded-lg hover:bg-neutral-100 p-2 px-3 cursor-pointer">
                        <WebPAvatarPolyfill src={mediaPath(author.thumbnail, AvatarSizes.THUMBNAIL)} className="flex-shrink-0" />
                        <div className="ml-3 overflow-hidden text-ellipsis line-clamp-1 text-indigo-400">{author.name}</div>
                    </div>
                )
            }
        </>
    </DropdownPanel>
}

export default ClubSelector