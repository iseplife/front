import PacketHandler from "../protocol/listener/PacketHandler"
import PacketListener from "../protocol/listener/PacketListener"
import WSPSGroupJoined from "../protocol/v1/packets/server/WSPSGroupJoined"
import { WSServerClient } from "../websocket/WSServerClient"
import { AppContext } from "../../context/app/context"
import { AppActionType } from "../../context/app/action"

export default class GroupListener extends PacketListener {

    constructor(wsServerClient: WSServerClient, private context: React.ContextType<typeof AppContext>){
        super(wsServerClient)
    }

    @PacketHandler(WSPSGroupJoined)
    public handleGroupJoined(packet: WSPSGroupJoined) {
        this.context.dispatch({
            type: AppActionType.SET_TOKEN,
            token: packet.jwt.token
        })
    }
    
}