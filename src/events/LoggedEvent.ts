import React from "react"
import GeneralEventType from "../constants/GeneralEventType"
import { AppContext } from "../context/app/context"

export default class LoggedEvent extends Event {
    constructor(
        public readonly context: React.ContextType<typeof AppContext>
    ){
        super(GeneralEventType.LOGGED)
    }
}