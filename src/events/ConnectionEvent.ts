import React from "react"
import GeneralEventType from "../constants/GeneralEventType"

export default class ConnectionEvent extends Event {
    constructor(
        public readonly online: boolean
    ){
        super(GeneralEventType.CONNECTION)
    }
}
