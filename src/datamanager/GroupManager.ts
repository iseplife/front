import { getUserGroups } from "../data/group"
import { GroupPreview } from "../data/group/types"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSGroupJoined from "../realtime/protocol/v1/packets/server/WSPSGroupJoined"
import WSPSGroupLeft from "../realtime/protocol/v1/packets/server/WSPSGroupLeft"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import DataManager from "./DataManager"

export default class GroupManager extends DataManager<GroupPreview> {
    constructor(wsServerClient: WSServerClient){
        super("groups", ["id", "feedId", "name"], wsServerClient)
    }

    protected async initData() {
        const data = (await getUserGroups()).data
        await this.addBulkData(data)
        await this.getTable().bulkDelete(
            (await this.getGroups())
                .filter(group => !data.find(other => other.id == group.id))
                .map(group => group.id)
        )
    }

    public getGroups(): Promise<GroupPreview[]>{
        return this.getTable().toArray()
    }

    @PacketHandler(WSPSGroupJoined)
    private handleGroupJoined(packet: WSPSGroupJoined){
        this.addData(packet.group)
    }
    @PacketHandler(WSPSGroupLeft)
    private handleGroupLeft(packet: WSPSGroupLeft){
        setTimeout(() => this.getTable().delete(packet.id))
    }
    
}
let groupManager = new GroupManager(undefined!)

window.addEventListener("logged", () => (groupManager = new GroupManager(getWebSocket())).init())

export { groupManager }