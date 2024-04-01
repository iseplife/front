import React, { MouseEvent, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { subscribe, unsubscribe } from "../../data/subscription"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { feedsManager } from "../../datamanager/FeedsManager"

interface SubscriptionButtonProps {
    id: number | undefined
    type: SubscribableType
    subscribed: boolean
    loading?: boolean
    className?: string
    updateSubscription: (sub?: {extensive: boolean}) => void
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ id, type, subscribed, loading, className, updateSubscription }) => {
    const { t } = useTranslation("common")
    const [minWidth, setMinWidth] = useState(0)

    const handleSubscription = useCallback(() => {
        if (id != undefined) {
            (subscribed ? unsubscribe : subscribe)(id, type, true).then(() => {
                updateSubscription(!subscribed ? {extensive: true} : undefined)
                feedsManager.outdateFeed(undefined)// Because main feed has now differents posts
            })
            setMinWidth(0)
        }
    }, [id, type, subscribed, updateSubscription])

    const mouseEnterCallback = useCallback((event: MouseEvent) => {
        if(subscribed)
            setMinWidth(minWidth => Math.max(minWidth, (event.target as HTMLDivElement).clientWidth + 4))
    }, [subscribed])

    return loading ? <div className={"w-24 h-10 bg-neutral-200 rounded-full " + className} /> : <div
        onClick={handleSubscription}
        className={
            "h-10 font-bold cursor-pointer select-none rounded-full text-base grid place-items-center group "
            + (subscribed ? "border-[#fe9200] border-2 text-[#fe9200] sm:hover:text-red-500 sm:hover:border-red-500 sm:hover:bg-red-400/10 px-3.5 " : "bg-[#fe9200] hover:bg-opacity-90 px-5 text-white ")
            + className
        }
        style={{ minWidth }}
        onMouseEnter={mouseEnterCallback}
        onMouseMove={mouseEnterCallback}
    >
        {subscribed && <div className="hidden sm:group-hover:block text-center">{t("subscription.unsubscribe")}</div>}
        <div className={subscribed ? "sm:group-hover:hidden text-center" : ""}>{subscribed ? t("subscription.subscribed") : t("subscription.subscribe")}</div>
    </div>
}

export default SubscriptionButton
