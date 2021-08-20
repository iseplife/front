import { Post } from "../../data/post/types"
import WSPCPostsSubscriptionUpdate from "../protocol/v1/packets/client/WSPCPostsSubscriptionUpdate"
import { getWebSocket } from "../websocket/WSServerClient"

export default class WSPostsService {
    private toUpdate = new Map<number, SubscriptionUpdate>()
    private subscribed = new Map<number, Post>()

    private sendUpdateTimeout!: number

    public subscribe(post: Post) {
        this.subscribed.set(post.id, post)
        this.toUpdate.set(post.id, new SubscriptionUpdate(post.id, true))
        this._sendUpdate()
    }

    public unsubscribe(post: Post) {
        if (this.subscribed.has(post.id)) {
            this.subscribed.delete(post.id)
            this.toUpdate.set(post.id, new SubscriptionUpdate(post.id, false))
            this._sendUpdate()
        }
    }

    private _sendUpdate() {
        window.clearTimeout(this.sendUpdateTimeout)
        this.sendUpdateTimeout = window.setTimeout(() =>
            getWebSocket().sendPacket(new WSPCPostsSubscriptionUpdate([...this.toUpdate.values()]))
        , 150)
    }

}

class SubscriptionUpdate {
    constructor(
        public id: number,
        public subscribe: boolean,
    ) { }
}