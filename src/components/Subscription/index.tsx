import React from "react"
import SubscriptionButton from "./SubscriptionButton"
import {SubscribableType} from "../../data/subscription/SubscribableType"
import SubscriptionExtensiveButton from "./SubscriptionExtensiveButton"
import {Subscription as SubscriptionType} from "../../data/feed/types"

type SubscriptionHandlerProps = {
    subscribable: number
    subscription: SubscriptionType
    onUpdate: (sub: SubscriptionType) => void
    type: SubscribableType
}
const SubscriptionHandler: React.FC<SubscriptionHandlerProps> = ({subscribable, subscription, type, onUpdate}) => {
    return (
        <>
            <SubscriptionButton
                loading={!subscribable}
                id={subscribable}
                subscribed={subscription != undefined}
                type={type}
                updateSubscription={sub => onUpdate(sub ? { extensive: false } : undefined)}
            />
            {subscription &&
                <SubscriptionExtensiveButton
                    id={subscribable}
                    updateExtensive={ext => onUpdate({extensive: ext})}
                    extensive={subscription.extensive}
                    type={SubscribableType.CLUB}
                />
            }
        </>
    )
}

export default SubscriptionHandler