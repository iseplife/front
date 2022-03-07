import React, { useCallback } from "react"
import { subscribe, unsubscribe } from "../../data/subscription"
import { SubscribableType } from "../../data/subscription/SubscribableType"

interface SubscriptionButtonProps {
    id: number
    type: SubscribableType
    subscribed: boolean
    updateSubscription: (subscribed: boolean) => void
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ id, type, subscribed, updateSubscription }) => {
    const handleSubscription = useCallback(() => {
        if (id != undefined) {
            const wasSubscribed = subscribed;
            (subscribed ? unsubscribe : subscribe)(id, type).then(_ => updateSubscription(!wasSubscribed))
        }
    }, [id, type, subscribed, updateSubscription])
    return <div 
        onClick={handleSubscription}
        className={"h-10 font-bold cursor-pointer select-none rounded-full px-3.5 text-white text-base items-center flex " + (subscribed ? "border-blue-400 border-2 text-blue-400 hover:text-opacity-80 hover:border-opacity-80" : "bg-blue-400 hover:bg-opacity-90")}
    >
        {subscribed ? "Unfollow" : "Follow"}
    </div>
}

export default SubscriptionButton