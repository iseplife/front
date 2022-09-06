import React, {useCallback, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import { Divider, Skeleton } from "antd"
import CustomText from "../Common/CustomText"


type EventDescriptionProps = {
    loading: boolean
    description: string | undefined
    phone?: boolean
}
const EventDescription: React.FC<EventDescriptionProps> = ({description, phone, loading}) => {
    const descLengthThrottle = 350
    const skeletonLength = useMemo(() => Array(10).fill(0).map(() => 110 + Math.random() * 80), [])

    return (
        <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5">
            <span className="text-neutral-900 font-semibold text-base">Description</span>
            {!loading && description ?
                <CustomText description={description} descLengthThrottle={phone ? descLengthThrottle : undefined} /> :
                <div className="mt-1">
                    {skeletonLength.map((length, index) =>
                        <Skeleton
                            key={index}
                            title={false}
                            active
                            paragraph={{ rows: 1, width: length }}
                            className={"-mb-1 " + (index > 6 && "hidden sm:block")}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default EventDescription
