import ConnectionEvent from "../events/ConnectionEvent"

class ConnectionManager {
    private _online = navigator.onLine

    get online() {
        return this._online
    }

    public init() {
        window.addEventListener("online", () => {
            this.updateConnectionStatus(true)
        })

        window.addEventListener("offline", () => {
            this.updateConnectionStatus(false)
        })
    }

    public updateConnectionStatus(online: boolean) {
        this._online = online
        window.dispatchEvent(new ConnectionEvent(online))
    }
}
const connectionManager = new ConnectionManager()
connectionManager.init()
export { connectionManager }
