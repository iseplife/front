import React, {useCallback, useState} from "react"
import { GalleryPreview} from "../../data/gallery/types"
import {useTranslation} from "react-i18next"
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller"
import {getEventGalleries} from "../../data/event"
import GalleryCard from "../Gallery/GalleryCard"


const Galleries: React.FC = () => {
    const {t} = useTranslation("club")
    const [galleries, setGalleries] = useState<GalleryPreview[]>([])
    const getFollowingGalleries: loaderCallback = useCallback(async (page: number) => {
        const res = await getEventGalleries(1, page)
        if(res.status === 200) {
            setGalleries(prevState => [...prevState, ...res.data.content])
            return res.data.last
        }
        return false
    }, [])

    return (
        <div className="w-full overflow-y-auto">
            <InfiniteScroller
                watch="DOWN"
                callback={getFollowingGalleries}
                className="flex flex-row flex-wrap w-full"
            >
                {galleries.map(g =>
                    <GalleryCard
                        key={g.id}
                        className="md:w-1/2 w-full p-2"
                        gallery={g}
                    />
                )}
            </InfiniteScroller>
        </div>

    )
}

export default Galleries