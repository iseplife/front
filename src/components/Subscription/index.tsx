import React, { useCallback } from "react"
import SubscriptionButton from "./SubscriptionButton"
import {SubscribableType} from "../../data/subscription/SubscribableType"
import SubscriptionExtensiveButton from "./SubscriptionExtensiveButton"
import {Subscription as SubscriptionType} from "../../data/feed/types"

type SubscriptionHandlerProps = {
    subscribable?: number
    subscription: SubscriptionType
    onUpdate: (sub: SubscriptionType) => void
    type: SubscribableType
}
const SubscriptionHandler: React.FC<SubscriptionHandlerProps> = ({subscribable, subscription, type, onUpdate}) => {
    const extensiveCallback = useCallback((ext: boolean) => onUpdate({ extensive: ext }), [onUpdate])
    return (
        <>
            {type != SubscribableType.GROUP && <SubscriptionButton
                loading={!subscribable}
                id={subscribable}
                subscribed={subscription != undefined}
                type={type}
                updateSubscription={onUpdate}
            />}
            {subscription && subscribable &&
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