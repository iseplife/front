import { AvatarSizes } from "../../../../constants/MediaSizes"
import { SearchItem, SearchItemType } from "../../../../data/searchbar/types"
import { mediaPath, _format } from "../../../../util"

interface SearchItemProps {
    item: SearchItem
}
const SearchItemComponent = ({item}: SearchItemProps) => {
    return item.type === SearchItemType.EVENT ?
        <div className="w-10 h-10 relative z-10 mr-4">
            <div className="w-full h-full mx-auto sm:mx-0 text-2xl md:text-3xl rounded-md bg-neutral-100 shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                <div className="bg-red-500 w-full h-4 text-[10px] text-neutral-100 leading-4 md:leading-5 md:text-sm md:h-5 flex-shrink-0  uppercase">
                    {_format(item.startsAt ?? new Date(), "MMM")}
                </div>
                <div className="grid place-items-center h-full text-base">
                    { item.startsAt?.getDate() }
                </div>
            </div>
        </div>
        : 
        <img 
            src={mediaPath(item.thumbURL, AvatarSizes.THUMBNAIL)}
            alt="Profile picture"
            className={"w-10 h-10 mr-4 "+(item.type === SearchItemType.CLUB ? "rounded-full" : "rounded-lg ")}
        />
}

export default SearchItemComponent