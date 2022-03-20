import React, {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import { Divider, Skeleton } from "antd"


type EventDescriptionProps = {
    loading: boolean
    description: string | undefined
    phone?: boolean
}
const EventDescription: React.FC<EventDescriptionProps> = ({description, phone, loading}) => {
    const descLengthThrottle = 350
    const {t} = useTranslation("event")

    const skeletonLength = useMemo(() => Array(10).fill(0).map(() => 110 + Math.random() * 80), [])

    const tooLong = (description?.length ?? 0) > descLengthThrottle
    let totalLength = 0
    
    const [seeAll, setSeeAll] = useState(false)
    const toggleSeeAll = useCallback(() => setSeeAll(see => !see), [])


    return <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5">
        <span className="text-neutral-900 font-semibold text-base">Description</span>
        {!loading && description ?
            <span>
                {
                    description.split("\n").map((val, index, array) => {
                        if (totalLength >= descLengthThrottle) return

                        if (val == "<spacer>")
                            return <Divider className="my-4" />
                        
                        if (!seeAll && phone) {
                            if (totalLength + val.length > descLengthThrottle)
                                val = val.substring(0, descLengthThrottle - totalLength)
                            totalLength += val.length
                        }

                        return index && array[index - 1] != "<spacer>" ? <><br /> {val}</> : val
                    })
                }
                {tooLong && !seeAll && phone &&
                    <label className="ml-1 font-semibold hover:underline cursor-pointer text-gray-500" onClick={toggleSeeAll}>
                        {t("event:see_more")}
                    </label>
                }
            </span>
            :
            <div className="mt-1">
                {skeletonLength.map((length, index) =>
                    <Skeleton key={index} title={false} active paragraph={{ rows: 1, width: length }} className={"-mb-1 " + (index > 6 && "hidden sm:block")} />
                )}
            </div>
        }
    </div>
}

export default EventDescription
