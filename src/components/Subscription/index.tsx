import React, { useCallback } from "react"
import SubscriptionButton from "./SubscriptionButton"
import {SubscribableType} from "../../data/subscription/SubscribableType"
import SubscriptionExtensiveButton from "./SubscriptionExtensiveButton"
import {Subscription as SubscriptionType} from "../../data/feed/types"
import { feedsManager } from "../../datamanager/FeedsManager"

type SubscriptionHandlerProps = {
    subscribable: number
    subscription: SubscriptionType
    onUpdate: (sub: SubscriptionType) => void
    type: SubscribableType
}
const SubscriptionHandler: React.FC<SubscriptionHandlerProps> = ({subscribable, subscription, type, onUpdate}) => {
    const extensiveCallback = useCallback(ext => onUpdate({ extensive: ext }), [onUpdate])
    const subCallback = useCallback(sub => onUpdate(sub ? { extensive: false } : undefined), [onUpdate])
    return (
        <>
            <SubscriptionButton
                loading={!subscribable}
                id={subscribable}
                subscribed={subscription != undefined}
                type={type}
                updateSubscription={subCallback}
            />
            {subscription &&
                <SubscriptionExtensiveButton
                    id={subscribable}
                    updateExtensive={extensiveCallback}
                    extensive={subscription.extensive}
                    type={SubscribableType.CLUB}
                />
            }
        </>
    )
}

export default SubscriptionHandler