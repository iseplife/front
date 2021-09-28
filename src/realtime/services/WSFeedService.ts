import WSPCFeedSubscriptionUpdate from "../protocol/v1/packets/client/WSPCFeedSubscriptionUpdate"
import { getWebSocket } from "../websocket/WSServerClient"

export default class WSFeedService {
    private subscribed: number[] = []

    public subscribe(feedId: number) {
        this.subscribed.push(feedId)
        getWebSocket().sendPacket(new WSPCFeedSubscriptionUpdate(feedId, true))
    }

    public unsubscribe(feedId: number) {
        if (this.subscribed.includes(feedId)) {
            this.subscribed.splice(this.subscribed.indexOf(feedId), 1)
            getWebSocket().sendPacket(new WSPCFeedSubscriptionUpdate(feedId, false))
        }
    }
}