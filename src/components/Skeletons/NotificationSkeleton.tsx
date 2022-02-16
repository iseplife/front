import React, { useMemo } from "react"
import { Skeleton } from "antd"

interface NotificationSkeletonProps {
    loading: boolean
    amount: number
    className?: string
}

const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({ loading, amount, className }) => {
    const skeletons = useMemo(() =>
        Array(Math.max(0, amount)).fill(null)
    , [amount])

    return <div className={"pointer-events-none mt-2 " + className}>
        {
            skeletons.map((val: unknown, i: number) =>
                <div key={i} className="w-full px-4 py-2.5 items-center left-32 flex rounded-lg -my-3">
                    <Skeleton.Avatar size={"large"} className="w-10 h-10 rounded-full shadow-sm flex-shrink-0 grid place-items-center" />
                    <Skeleton
                        className="ml-2.5 text-sm mt-2 -mb-2"
                        loading={loading}
                        active
                        title={false}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            )
        }
    </div>
}

export default NotificationSkeleton
