import React, { MouseEvent, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { subscribe, unsubscribe } from "../../data/subscription"
import { SubscribableType } from "../../data/subscription/SubscribableType"

interface SubscriptionButtonProps {
    id: number
    type: SubscribableType
    subscribed: boolean
    updateSubscription: (subscribed: boolean) => void
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ id, type, subscribed, updateSubscription }) => {
    const { t } = useTranslation("common")
    const [minWidth, setMinWidth] = useState(0)

    const handleSubscription = useCallback(() => {
        if (id != undefined) {
            const wasSubscribed = subscribed;
            (subscribed ? unsubscribe : subscribe)(id, type).then(_ => updateSubscription(!wasSubscribed))

            setMinWidth(0)
        }
    }, [id, type, subscribed, updateSubscription])

    const mouseEnterCallback = useCallback((event: MouseEvent) => {
        if(subscribed)
            setMinWidth((event.target as HTMLDivElement).clientWidth + 4)
    }, [subscribed])

    return <div 
        onClick={handleSubscription}
        className={
            "h-10 font-bold cursor-pointer select-none rounded-full text-base grid place-items-center group "
            + (subscribed ? "border-indigo-400 border-2 text-indigo-400 hover:text-red-500 hover:border-red-500 hover:bg-red-400/10 px-3.5" : "bg-indigo-400 hover:bg-opacity-90 px-5 text-white")
        }
        style={{ minWidth }}
        onMouseEnter={mouseEnterCallback}
        onMouseMove={mouseEnterCallback}
    >
        {subscribed && <div className="hidden group-hover:block text-center">{t("subscription.unsubscribe")}</div>}
        <div className={subscribed ? "group-hover:hidden text-center" : ""}>{subscribed ? t("subscription.subscribed") : t("subscription.subscribe")}</div>
    </div>
}

export default SubscriptionButton