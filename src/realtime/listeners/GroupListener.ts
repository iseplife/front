import PacketHandler from "../protocol/listener/PacketHandler"
import PacketListener from "../protocol/listener/PacketListener"
import WSPSGroupJoined from "../protocol/packets/server/WSPSGroupJoined"
import { WSServerClient } from "../websocket/WSServerClient"
import { AppContext } from "../../context/app/context"
import { AppActionType } from "../../context/app/action"
import WSPSGroupLeft from "../protocol/packets/server/WSPSGroupLeft"
import React from "react"
import {refresh} from "../../data/security"

export default class GroupListener extends PacketListener {

    constructor(wsServerClient: WSServerClient, private context: React.ContextType<typeof AppContext>){
        super(wsServerClient)
    }

    @PacketHandler(WSPSGroupJoined)
    public handleGroupJoined() {
        refresh().then(res => {
            try {
                this.context.dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
            } catch (e) {
                new Error("JWT cookie unreadable")
            }
        }).catch(() => {
            this.context.dispatch({type: AppActionType.SET_LOGGED_OUT})
        })
    }
    @PacketHandler(WSPSGroupLeft)
    public handleGroupLeft() {
        refresh().then(res => {
            try {
                this.context.dispatch({
                    type: AppActionType.SET_TOKEN,
                    token: res.data.token
                })
            } catch (e) {
                new Error("JWT cookie unreadable")
            }
        }).catch(() => {
            this.context.dispatch({type: AppActionType.SET_LOGGED_OUT})
        })
    }
    
}